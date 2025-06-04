import type { UserState, UserAction } from '../types';


export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          token: action.payload.token,
          id: action.payload.id,
          name: action.payload.name,
          lastName: action.payload.lastName,
          email: action.payload.email,
        },
        isAuthenticated: true,
      };
    
    case 'LOGOUT':
      return {
        user: {
          token: null,
          id: null,
          name: null,
          lastName: null,
          email: null,
        },
        isAuthenticated: false,
      };

    default:
      return state;
  }
};