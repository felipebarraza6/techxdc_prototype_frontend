import { createContext } from "react";
import type { UserContextProps } from '../types';

const UserContext = createContext<UserContextProps | undefined>(undefined);

export default UserContext;