import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/hooks/useAppContext";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  getNetworkStats,
  formatCurrency,
  getDateRange,
} from "../../utils/helpers";

interface DashboardStats {
  dailySales: number;
  monthlySales: number;
  commissionEarnings: number;
  networkSize: number;
  activeMarketers: number;
  totalSales: number;
}

const MarketerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { authUser, userData } = state;
  const [stats, setStats] = useState<DashboardStats>({
    dailySales: 0,
    monthlySales: 0,
    commissionEarnings: 0,
    networkSize: 0,
    activeMarketers: 0,
    totalSales: 0,
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add auth check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If we don't have context data, try localStorage
        if (!authUser || !userData) {
          const storedAuthUser = localStorage.getItem("authUser");
          const storedUserData = localStorage.getItem("userData");

          if (storedAuthUser && storedUserData) {
            const parsedAuthUser = JSON.parse(storedAuthUser);
            const parsedUserData = JSON.parse(storedUserData);

            await Promise.all([
              dispatch({ type: "SET_AUTH_USER", payload: parsedAuthUser }),
              dispatch({ type: "SET_USER_DATA", payload: parsedUserData }),
            ]);

            setLoading(false);
            return;
          }

          console.log("No stored auth data found");
          navigate("/auth/login", { replace: true });
          return;
        }

        // Verify role
        if (userData.role !== "marketer") {
          console.log("Invalid role:", userData.role);
          navigate("/", { replace: true });
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.clear(); // Clear potentially corrupted data
        navigate("/auth/login", { replace: true });
      }
    };

    checkAuth();
  }, [authUser, userData, navigate, dispatch]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Exit if no auth user or user data
      if (!authUser?.uid || !userData?.userId) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching dashboard data for user:", userData.userId);

        // Get date ranges
        const { start: monthStart } = getDateRange("month");
        const { start: dayStart } = getDateRange("today");

        // Create Firestore timestamps
        const monthStartTimestamp = new Date(monthStart);
        const dayStartTimestamp = new Date(dayStart);

        // Fetch sales data
        const salesRef = collection(db, "sales");
        const dailySalesQuery = query(
          salesRef,
          where("marketerId", "==", userData.userId),
          where("timestamp", ">=", dayStartTimestamp)
        );
        const monthlySalesQuery = query(
          salesRef,
          where("marketerId", "==", userData.userId),
          where("timestamp", ">=", monthStartTimestamp)
        );

        // Fetch recent sales
        const recentSalesQuery = query(
          salesRef,
          where("marketerId", "==", userData.userId),
          orderBy("timestamp", "desc"),
          limit(5)
        );

        console.log("Executing queries...");

        // Execute all queries in parallel with error handling
        const [
          dailySalesSnap,
          monthlySalesSnap,
          recentSalesSnap,
          networkStats,
        ] = await Promise.all([
          getDocs(dailySalesQuery).catch((err) => {
            console.error("Daily sales query failed:", err);
            return { docs: [] };
          }),
          getDocs(monthlySalesQuery).catch((err) => {
            console.error("Monthly sales query failed:", err);
            return { docs: [] };
          }),
          getDocs(recentSalesQuery).catch((err) => {
            console.error("Recent sales query failed:", err);
            return { docs: [] };
          }),
          getNetworkStats(userData.userId).catch((err) => {
            console.error("Network stats query failed:", err);
            return { totalDownline: 0, activeMarketers: 0, totalSales: 0 };
          }),
        ]);

        console.log("Queries completed, processing results...");

        // Calculate totals with null checks
        const dailyTotal = dailySalesSnap.docs.reduce(
          (sum, doc) => sum + (doc.data()?.total || 0),
          0
        );
        const monthlyTotal = monthlySalesSnap.docs.reduce(
          (sum, doc) => sum + (doc.data()?.total || 0),
          0
        );

        // Update stats with default values for safety
        setStats({
          dailySales: dailyTotal,
          monthlySales: monthlyTotal,
          commissionEarnings: userData.commission || 0,
          networkSize: networkStats.totalDownline || 0,
          activeMarketers: networkStats.activeMarketers || 0,
          totalSales: networkStats.totalSales || 0,
        });

        // Update recent sales with proper type checking
        setRecentSales(
          recentSalesSnap.docs
            .map((doc) => {
              const data = doc.data();
              return data
                ? {
                    id: doc.id,
                    ...data,
                    // Ensure timestamp is properly handled
                    timestamp: data.timestamp?.toDate?.() || new Date(),
                  }
                : null;
            })
            .filter(Boolean) // Remove any null values
        );

        console.log("Dashboard data updated successfully");
      } catch (error) {
        console.error("Error in fetchDashboardData:", error);
        // Show error to user
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: Date.now().toString(),
            type: "error",
            message:
              "Failed to load dashboard data. Please try refreshing the page.",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser?.uid, userData?.userId, dispatch]);

  // Show message if no auth user or user data
  if (!authUser?.uid || !userData?.userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard</p>
          <Link
            to="/auth/login"
            className="text-indigo-600 hover:text-indigo-500 mt-2 block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Sales Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Today's Sales</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(stats.dailySales)}
          </p>
        </div>

        {/* Monthly Sales Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Sales</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(stats.monthlySales)}
          </p>
        </div>

        {/* Commission Earnings Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Commission Earnings
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.commissionEarnings)}
          </p>
        </div>

        {/* Network Size Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Network Size</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.networkSize}
          </p>
          <p className="text-sm text-gray-500">
            Active: {stats.activeMarketers}
          </p>
        </div>

        {/* Stock Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Stock Status</h3>
          <div className="mt-2">
            {Object.entries(userData?.stock || {}).map(
              ([productId, quantity]) => (
                <div
                  key={productId}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="text-gray-600">
                    {state.products.find((p) => p.id === productId)?.name ||
                      productId}
                  </span>
                  <span
                    className={`font-medium ${
                      quantity < 10 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {quantity} units
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-700">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.timestamp.toDate()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {state.products.find((p) => p.id === sale.productId)
                      ?.name || sale.productId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sale.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketerDashboard;
