

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIPopup from "./components/AIPopup";
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";

import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import ProfitSimulator from "./pages/ProfitSimulator";
import ExportPlan from "./pages/ExportPlan";
import ExportAdvisor from "./pages/ExportAdvisor";
import ExportReadiness from "./pages/ExportReadiness";
import ProductsMarketplace from "./pages/ProductsMarketplace";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import DocumentGenerator from "./pages/DocumentGenerator";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("er_onboarding");
    if (!saved) {
      // Will show onboarding after splash finishes
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    const saved = localStorage.getItem("er_onboarding");
    if (!saved) setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const openAIChat = () => setIsAIChatOpen(true);
  const closeAIChat = () => setIsAIChatOpen(false);

  return (
    <Router>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <Navbar />

      <div style={{ display: "flex", marginTop: "64px" }}>

        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        <div className="main-content" style={{
          marginLeft: isCollapsed ? "64px" : "216px",
          padding: "2rem 2.5rem",
          flex: 1,
          minHeight: "calc(100vh - 64px)",
          background: "#f4f6f9",
          transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product" element={<ProductForm />} />
            <Route path="/market" element={<MarketAnalysis />} />
            <Route path="/profit" element={<ProfitSimulator />} />
            <Route path="/export-plan" element={<ExportPlan />} />
            <Route path="/products" element={<ProductsMarketplace />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/chatbot" element={<ExportAdvisor />} />
            <Route path="/docs" element={<DocumentGenerator />} />
            <Route path="/readiness" element={<ExportReadiness />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<AccountSettings />} />
          </Routes>

        </div>

      </div>

      <AIPopup isOpen={isAIChatOpen} onClose={closeAIChat} onOpen={openAIChat} />

    </Router>
  );
}

export default App;