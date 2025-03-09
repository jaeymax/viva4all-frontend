import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/hooks/useAppContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import {
  isValidEmail,
  isValidPhone,
  formatPhoneNumber,
  validateUserRegistration,
} from "../../utils/auth";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateUserRegistration(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Format phone number to E.164 format
      const formattedPhone = formatPhoneNumber(formData.phone);

      // Create user document in Firestore
      const userId = userCredential.user.uid;
      const businessId = `MKT${Date.now().toString(36).toUpperCase()}`;

      const userData = {
        userId,
        businessId,
        name: formData.name.trim(),
        email: formData.email,
        phone: formattedPhone,
        role: "marketer",
        stock: {},
        commission: 0,
        referrerId: null,
        ancestors: [],
        directDescendants: [],
        createdAt: new Date(),
        lastPurchaseDate: null,
      };

      await setDoc(doc(db, "users", userId), userData);

      // Store both auth and user data
      localStorage.setItem("authUser", JSON.stringify(userCredential.user));
      localStorage.setItem("userData", JSON.stringify(userData));

      // Update context with both pieces of data
      dispatch({ type: "SET_AUTH_USER", payload: userCredential.user });
      dispatch({ type: "SET_USER_DATA", payload: userData });

      // Show success notification
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          type: "success",
          message: "Registration successful! Welcome to Viva4all.",
        },
      });

      // Redirect to marketer dashboard
      navigate("/marketer/dashboard");
    } catch (error: any) {
      setErrors({
        submit: error.message || "Failed to register. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  ${errors.name ? "border-red-300" : "border-gray-300"}
                  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="mb-4">
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  ${errors.phone ? "border-red-300" : "border-gray-300"}
                  placeholder-gray-500 text-gray-900 focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Phone Number (e.g., 024XXXXXXX)"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  ${errors.email ? "border-red-300" : "border-gray-300"}
                  placeholder-gray-500 text-gray-900 focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Inputs */}
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  ${errors.password ? "border-red-300" : "border-gray-300"}
                  placeholder-gray-500 text-gray-900 focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }
                  placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">
              {errors.submit}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
