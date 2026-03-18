import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  LayoutGrid,
  Package,
  Globe2,
  TrendingUp,
  FileText,
  ShieldCheck,
  BadgeCheck,
  ShoppingBag,
  ClipboardList,
  Bot,
  Settings,
  CheckCircle,
  Bell,
  MapPin,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  // MAIN SECTION
  const mainItems = [
    { path: "/", labelKey: "nav.dashboard", icon: <LayoutGrid size={16} /> },
    { path: "/product", labelKey: "nav.addProduct", icon: <Package size={16} /> },
    { path: "/market", labelKey: "nav.marketAnalysis", icon: <Globe2 size={16} /> },
    { path: "/opportunity", labelKey: "nav.opportunityScanner", icon: <TrendingUp size={16} /> },
    { path: "/profit", labelKey: "nav.profitSimulator", icon: <TrendingUp size={16} /> },
  ];

  // EXPORT EXECUTION SECTION (formerly "Compliance")
  const exportItems = [
    { path: "/compliance", label: "Compliance Check", icon: <ShieldCheck size={16} /> },
    { path: "/export-plan", label: "My Export Plan", icon: <MapPin size={16} /> },
    { path: "/export-documents", label: "Export Documents", icon: <CheckCircle size={16} /> },
    { path: "/readiness", label: "Readiness Score", icon: <BadgeCheck size={16} /> },
    { path: "/docs", label: "Document Generator", icon: <FileText size={16} /> },
  ];

  // BUSINESS SECTION (formerly "Buyer")
  const businessItems = [
    { path: "/marketplace", labelKey: "nav.marketplace", icon: <ShoppingBag size={16} /> },
    { path: "/buyer/orders", labelKey: "nav.buyerOrders", icon: <ClipboardList size={16} /> },
  ];

  // SUPPORT SECTION
  const supportItems = [
    { path: "/chatbot", labelKey: "nav.aiAdvisor", icon: <Bot size={16} /> },
    { path: "/notifications", label: "Notifications", icon: <Bell size={16} /> },
    { path: "/settings", labelKey: "nav.settings", icon: <Settings size={16} /> },
  ];

  return (
    <aside className="aurora-sidebar">
      <div style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "1rem 0.85rem 0.75rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--aurora-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
            ER
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--aurora-text)" }}>ExportReady</span>
            <span style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)" }}>Global Trade</span>
          </div>
        </div>

        {/* MAIN Section */}
        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)", padding: "0.5rem 0.85rem 0.25rem" }}>Main</div>
        {mainItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{item.label || t(item.labelKey)}</span>
            </Link>
          );
        })}

        {/* EXPORT EXECUTION Section */}
        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)", padding: "0.75rem 0.85rem 0.25rem" }}>Export Execution</div>
        {exportItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{item.label || t(item.labelKey)}</span>
            </Link>
          );
        })}

        {/* BUSINESS Section */}
        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)", padding: "0.75rem 0.85rem 0.25rem" }}>Business</div>
        {businessItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{item.label || t(item.labelKey)}</span>
            </Link>
          );
        })}

        {/* SUPPORT Section */}
        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)", padding: "0.75rem 0.85rem 0.25rem" }}>Support</div>
        {supportItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{item.label || t(item.labelKey)}</span>
            </Link>
          );
        })}

        {/* User Profile Section */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.85rem", borderTop: "1px solid var(--aurora-border)" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--aurora-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
              RG
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "var(--aurora-text)", fontWeight: 500 }}>Rajesh Gupta</span>
              <span style={{ fontSize: "10px", color: "var(--aurora-text-muted)" }}>Pro Exporter</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
