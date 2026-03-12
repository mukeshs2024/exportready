import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import ProfitSimulator from "./pages/ProfitSimulator";
import ExportPlan from "./pages/ExportPlan";
import ExportAdvisor from "./pages/ExportAdvisor";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Router>

      <Navbar />

      <div style={{display: "flex"}}>

        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        <div style={{
          marginLeft: isCollapsed ? "90px" : "260px",
          padding: "2.5rem 2rem",
          flex: 1,
          minHeight: "calc(100vh - 75px)",
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f3f7 100%)",
          transition: "all 0.3s ease"
        }}>

          <Routes>

            <Route path="/" element={<Dashboard toggleSidebar={toggleSidebar} />} />

            <Route path="/product" element={<ProductForm />} />

            <Route path="/market" element={<MarketAnalysis />} />

            <Route path="/profit" element={<ProfitSimulator />} />

            <Route path="/export-plan" element={<ExportPlan />} />

            <Route path="/chatbot" element={<ExportAdvisor />} />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;