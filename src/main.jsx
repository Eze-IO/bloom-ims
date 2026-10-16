import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider, useStore } from "./store.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Records from "./pages/Records.jsx";
import Reports from "./pages/Reports.jsx";
import Workflow from "./pages/Workflow.jsx";
import Users from "./pages/Users.jsx";
import About from "./pages/About.jsx";
import "./styles.css";

// Hash routing, because GitHub Pages can't rewrite deep links like /records/inventory to index.html.
function App() {
  const { session } = useStore();
  if (!session) return <Login />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="records/:table?" element={<Records />} />
        <Route path="reports/:report?" element={<Reports />} />
        <Route path="workflow" element={<Workflow />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </HashRouter>
  </StrictMode>,
);
