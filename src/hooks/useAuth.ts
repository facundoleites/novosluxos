import { useContext } from "react";
import { AuthContext } from "../context/Auth/Context";

export const useAuth = () => {
  return useContext(AuthContext);
};
