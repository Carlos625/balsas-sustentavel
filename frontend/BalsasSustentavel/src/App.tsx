import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AppPrivate from "./pages/AppPrivate";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppPrivate />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
