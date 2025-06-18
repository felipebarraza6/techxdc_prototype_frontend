import { createContext } from "react";
import type { UserContextProps } from '../types/index';

const UserContext = createContext<UserContextProps | undefined>(undefined);

export default UserContext;