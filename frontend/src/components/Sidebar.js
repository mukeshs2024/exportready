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
  BarChart3,
  Bot,
  Settings,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  const mainItems = [
    { path: "/", labelKey: "nav.dashboard", icon: <LayoutGrid size={16} /> },
    { path: "/product", labelKey: "nav.addProduct", icon: <Package size={16} /> },
    { path: "/market", labelKey: "nav.marketAnalysis", icon: <Globe2 size={16} /> },
    { path: "/profit", labelKey: "nav.profitSimulator", icon: <TrendingUp size={16} /> },
    { path: "/docs", labelKey: "nav.documents", icon: <FileText size={16} /> },
  ];

  const complianceItems = [
    { path: "/compliance", labelKey: "nav.compliance", icon: <ShieldCheck size={16} /> },
    { path: "/readiness", labelKey: "nav.readinessScore", icon: <BadgeCheck size={16} /> },
    { path: "/reports", labelKey: "nav.reports", icon: <BarChart3 size={16} /> },
  ];

  const supportItems = [
    { path: "/chatbot", labelKey: "nav.aiAdvisor", icon: <Bot size={16} /> },
    { path: "/settings", labelKey: "nav.settings", icon: <Settings size={16} /> },
  ];

  return (
    <aside className="aurora-sidebar">
      <div style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1rem 0.85rem 0.75rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
            ER
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>ExportReady</span>
            <span style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8" }}>Global Trade</span>
          </div>
        </div>

        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", padding: "0.5rem 0.85rem 0.25rem" }}>Main</div>
        {mainItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}

        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", padding: "0.75rem 0.85rem 0.25rem" }}>Compliance</div>
        {complianceItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}

        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", padding: "0.75rem 0.85rem 0.25rem" }}>Support</div>
        {supportItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`aurora-nav-link${isActive ? " active" : ""}`}>
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}

        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.85rem", borderTop: "1px solid #E6ECF3" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
              RG
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "#0F172A", fontWeight: 500 }}>Rajesh Gupta</span>
              <span style={{ fontSize: "10px", color: "#94A3B8" }}>Pro Exporter</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
