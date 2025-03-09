import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Ghana phone number format: 02XXXXXXXX or 05XXXXXXXX
  const ghanaPhoneRegex = /^(02|05)\d{8}$/;
  return ghanaPhoneRegex.test(phone);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add Ghana country code if not present
  if (cleaned.startsWith("0")) {
    return "+233" + cleaned.substring(1);
  }
  return cleaned.startsWith("233") ? "+" + cleaned : "+233" + cleaned;
};

export const validateUserRegistration = (
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!name.trim()) errors.name = "Name is required";
  if (!email) errors.email = "Email is required";
  if (!isValidEmail(email)) errors.email = "Invalid email format";
  if (!phone) errors.phone = "Phone number is required";
  if (!isValidPhone(phone)) errors.phone = "Invalid Ghana phone number format";
  if (!password) errors.password = "Password is required";
  if (password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Invalid password";
    default:
      return "An error occurred during authentication";
  }
};

// Add function to check auth state
export const checkAuthAndRole = async (requiredRole?: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  if (requiredRole) {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== requiredRole) {
      return false;
    }
  }

  return true;
};
