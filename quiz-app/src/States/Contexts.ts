import React from "react";
import { UserProps } from "../Interfaces/UserProps";

export const UserContext = React.createContext(Array<string>());
export const UsersContext = React.createContext(Array<UserProps>());
