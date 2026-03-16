

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthLayout from "./layouts/AuthLayout";
import AIPopup from "./components/AIPopup";
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MarketAnalysis from "./pages/MarketAnalysis";
import ProfitSimulator from "./pages/ProfitSimulator";
import ExportPlan from "./pages/ExportPlan";
import ExportAdvisor from "./pages/ExportAdvisor";
import OpportunityScanner from "./pages/OpportunityScanner";
import ExportReadiness from "./pages/ExportReadiness";
import ProductsMarketplace from "./pages/ProductsMarketplace";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import DocumentGenerator from "./pages/DocumentGenerator";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import ProductDetail from "./pages/ProductDetail";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerOrderDetail from "./pages/BuyerOrderDetail";
import ImporterRegister from "./pages/ImporterRegister";
import ExporterDashboard from "./pages/ExporterDashboard";
import ExporterProducts from "./pages/ExporterProducts";
import ExporterOrders from "./pages/ExporterOrders";
import ExporterOrderDetail from "./pages/ExporterOrderDetail";
import ExporterRegister from "./pages/ExporterRegister";

function App() {
  const [isCollapsed] = useState(false);
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

  const openAIChat = () => setIsAIChatOpen(true);
  const closeAIChat = () => setIsAIChatOpen(false);

  const tickerItems = [
    { flag: "🇦🇪", country: "UAE", product: "Cotton Shirts", change: "+18%", tone: "teal" },
    { flag: "🇩🇪", country: "Germany", product: "Organic Textiles", change: "+9%", tone: "blue" },
    { flag: "🇺🇸", country: "USA", product: "Spices", change: "+6%", tone: "teal" },
    { flag: "🇯🇵", country: "Japan", product: "Home Linen", change: "+4%", tone: "blue" },
    { flag: "🇸🇬", country: "Singapore", product: "Leather Goods", change: "-2%", tone: "red" },
    { flag: "🇬🇧", country: "UK", product: "Agri Produce", change: "+7%", tone: "teal" },
  ];

  return (
    <LanguageProvider>
      <Router>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        <Routes>
          {/* Auth routes: no Navbar/Sidebar */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          <Route path="/signup" element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          } />
          {/* Main app routes: with Navbar/Sidebar */}
          <Route path="*" element={
            <>
              <Navbar />
              <div style={{ display: "flex", marginTop: "86px" }}>
                <Sidebar isCollapsed={isCollapsed} />
                <div className="aurora-main" style={{ marginLeft: "220px", flex: 1 }}>
                  <div className="aurora-container">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/product" element={<ExporterProducts />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/market" element={<MarketAnalysis />} />
                      <Route path="/profit" element={<ProfitSimulator />} />
                      <Route path="/opportunity" element={<OpportunityScanner />} />
                      <Route path="/export-plan" element={<ExportPlan />} />
                      <Route path="/products" element={<ProductsMarketplace />} />
                      <Route path="/marketplace" element={<ProductsMarketplace />} />
                      <Route path="/compliance" element={<Compliance />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/chatbot" element={<ExportAdvisor />} />
                      <Route path="/docs" element={<DocumentGenerator />} />
                      <Route path="/readiness" element={<ExportReadiness />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<AccountSettings />} />
                      <Route path="/buyer/orders" element={<BuyerOrders />} />
                      <Route path="/buyer/orders/:id" element={<BuyerOrderDetail />} />
                      <Route path="/importer/register" element={<ImporterRegister />} />
                      <Route path="/exporter/dashboard" element={<ExporterDashboard />} />
                      <Route path="/exporter/products" element={<ExporterProducts />} />
                      <Route path="/exporter/orders" element={<ExporterOrders />} />
                      <Route path="/exporter/orders/:id" element={<ExporterOrderDetail />} />
                      <Route path="/exporter/register" element={<ExporterRegister />} />
                    </Routes>
                  </div>
                </div>
              </div>
              <AIPopup isOpen={isAIChatOpen} onClose={closeAIChat} onOpen={openAIChat} />
            </>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;