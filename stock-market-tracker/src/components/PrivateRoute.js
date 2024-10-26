import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser, loading } = useAuth();

  return (
    <Route
      {...rest}
      element={loading ? <div>Loading...</div> : (
        currentUser ? (
          children
        ) : (
          <Navigate
            to="/login"
            state={{ from: rest.location }}
          />
        )
      )}
    />
  );
};

export default PrivateRoute;
