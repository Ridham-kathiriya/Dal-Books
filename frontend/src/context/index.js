import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const PointsContext = createContext();

export const usePoints = () => useContext(PointsContext);