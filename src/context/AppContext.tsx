import React, { createContext, useReducer, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { AppState, AppAction, AppContextType } from "../types/context.types";
import { Notification } from "../types";

const initialState: AppState = {
  authUser: null, // Firebase Auth user
  userData: null, // Firestore user data
  user: null,
  products: [],
  loading: false,
  notifications: [],
  sales: [],
  commissions: [],
};

// Export the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_AUTH_USER":
      return { ...state, authUser: action.payload };
    case "SET_USER_DATA":
      return { ...state, userData: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case "SET_SALES":
      return { ...state, sales: action.payload };
    case "SET_COMMISSIONS":
      return { ...state, commissions: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Add auth state persistence
  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: "SET_AUTH_USER", payload: user });

        // Fetch and set user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            dispatch({ type: "SET_USER_DATA", payload: userDoc.data() });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        dispatch({ type: "SET_AUTH_USER", payload: null });
        dispatch({ type: "SET_USER_DATA", payload: null });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
