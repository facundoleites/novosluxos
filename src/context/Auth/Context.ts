import { createContext } from "react";
import firebase from "firebase/app";

type AuthContextValue = false | null | firebase.User;
export const AuthContext = createContext<AuthContextValue>(null);
