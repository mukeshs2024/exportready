import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIPopup from "./components/AIPopup";

import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import ProfitSimulator from "./pages/ProfitSimulator";
import ExportPlan from "./pages/ExportPlan";
import ExportAdvisor from "./pages/ExportAdvisor";
import ProductsMarketplace from "./pages/ProductsMarketplace";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openAIChat = () => {
    setIsAIChatOpen(true);
  };

  const closeAIChat = () => {
    setIsAIChatOpen(false);
  };

  return (
    <Router>

      <Navbar />

      <div style={{display: "flex", marginTop: "75px"}}>

        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        <div style={{
          marginLeft: isCollapsed ? "70px" : "220px",
          padding: "2rem 2.5rem",
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

            <Route path="/products" element={<ProductsMarketplace />} />

            <Route path="/compliance" element={<Compliance />} />
            <Route path="/reports" element={<Reports />} />

            <Route path="/chatbot" element={<ExportAdvisor />} />

          </Routes>

        </div>

      </div>

      <AIPopup isOpen={isAIChatOpen} onClose={closeAIChat} onOpen={openAIChat} />

    </Router>
  );
}

export default App;