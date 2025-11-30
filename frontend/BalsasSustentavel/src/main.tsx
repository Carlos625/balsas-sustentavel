import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AppPrivate from "./pages/AppPrivate";
import { AuthProvider } from "./context/AuthContext";
import { PontosProvider } from "./context/PontosContext";
import PrivateRoute from "./routes/PrivateRoute";
import Register from './pages/Register'

import "./styles/header.css";
import "./styles/global.css";
import "./styles/app.css";
import "./styles/auth.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PontosProvider>
                  <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <AppPrivate />
              </PrivateRoute>
            }
          />
        </Routes>
        </PontosProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
