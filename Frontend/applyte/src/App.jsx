import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home/Home";
import EmailVerification from "./pages/Auth/emailVer";
import Dashboard from "./pages/Dashboard/dashboard";
import { Store } from "./store/store";
import { base_url } from "./lib/constant";
import { SidebarProvider } from "./Context/ActiveDashboardComp";

const AuthRoute = ({ children }) => {
  const { user } = Store();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const PrivateRoute = ({ children }) => {
  const { user } = Store();
  // No dedicated /login page; redirect to home where Auth modal exists
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { setUser } = Store();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${base_url}/user/auth/get-info`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.User) {
          setUser(res.data.User);
        } else {
          setUser(undefined);
        }
      } catch (e) {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <SidebarProvider>
                <Dashboard />
              </SidebarProvider>
            </PrivateRoute>
          }
        />
        <Route
          path="/verify_email/:email"
          element={
            <AuthRoute>
              <EmailVerification />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
