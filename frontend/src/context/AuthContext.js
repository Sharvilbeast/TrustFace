
import React from 'react';

export const AuthContext = React.createContext({
  auth: {
    token: null,
    user: {},
    isAuthenticated: false,
  },
  login: () => {},
  logout: () => {},
});
