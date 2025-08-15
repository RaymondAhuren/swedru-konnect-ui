// components/RoleProtectedRoute.jsx
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const RoleProtectedRoute = ({ allowedRoles, redirectPath = "/auth/login" }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Smoothly handle the initial auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 300); // Short delay to prevent flash of loading

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen"
      >
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-purple-600 rounded-full"></div>
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Outlet />
    </motion.div>
  );
};

export default RoleProtectedRoute;
