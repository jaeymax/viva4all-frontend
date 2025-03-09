import { User, Product, Sale, Commission, Notification } from "./index";

export interface AppState {
  user: User | null;
  products: Product[];
  loading: boolean;
  notifications: Notification[];
  sales: Sale[];
  commissions: Commission[];
}

export type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_SALES"; payload: Sale[] }
  | { type: "SET_COMMISSIONS"; payload: Commission[] };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
