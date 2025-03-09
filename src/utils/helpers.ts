import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const formatCurrency = (
  amount: number,
  currency: string = "GHS",
  locale: string = "en-GH"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const getDateRange = (
  range: "today" | "week" | "month" | "year"
): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      start.setDate(start.getDate() - 7);
      break;
    case "month":
      start.setMonth(start.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end };
};

export const getNetworkStats = async (userId: string) => {
  const downlineQuery = query(
    collection(db, "users"),
    where("ancestors", "array-contains", userId)
  );

  const salesQuery = query(
    collection(db, "sales"),
    where("marketerId", "==", userId)
  );

  const [downlineSnap, salesSnap] = await Promise.all([
    getDocs(downlineQuery),
    getDocs(salesQuery),
  ]);

  const activeMarketers = downlineSnap.docs.filter(
    (doc) => doc.data().lastPurchaseDate?.toDate() > getDateRange("month").start
  ).length;

  return {
    totalDownline: downlineSnap.size,
    activeMarketers,
    totalSales: salesSnap.docs.reduce((sum, doc) => sum + doc.data().total, 0),
  };
};

export const calculateEarnings = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<number> => {
  const commissionsQuery = query(
    collection(db, "commissions"),
    where("receiverId", "==", userId),
    where("timestamp", ">=", startDate),
    where("timestamp", "<=", endDate)
  );

  const commissionsSnap = await getDocs(commissionsQuery);
  return commissionsSnap.docs.reduce(
    (total, doc) => total + doc.data().amount,
    0
  );
};
