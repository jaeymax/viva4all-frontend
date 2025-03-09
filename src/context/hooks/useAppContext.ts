import { useContext } from "react";
import { AppContext } from "../AppContext";
import { Notification } from "../types";

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Convenience hooks for specific state slices
export const useUser = () => {
  const { state } = useAppContext();
  return state.user;
};

export const useProducts = () => {
  const { state } = useAppContext();
  return state.products;
};

export const useNotifications = () => {
  const { state, dispatch } = useAppContext();

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: { ...notification, id },
    });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
  };
};

export const useLoading = () => {
  const { state, dispatch } = useAppContext();

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  return {
    loading: state.loading,
    setLoading,
  };
};
