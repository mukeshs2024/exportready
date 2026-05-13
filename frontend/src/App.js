

import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BadgeIndianRupee,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  Filter,
  LayoutDashboard,
  LockKeyhole,
  Link as RouterLink,
  Menu,
  PanelLeftClose,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
  FileSignature,
  Hash,
  Eye,
  Download,
  Plus,
  CreditCard,
  Users,
  Mail,
  Smartphone,
  CircleDashed,
  AlertTriangle,
} from "lucide-react";
import "./App.css";
import Landing from "./pages/Landing";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/shipments", label: "Shipments", icon: Truck },
  { to: "/billing", label: "Billing", icon: BadgeIndianRupee },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

const DOCUMENT_TEMPLATES = [
  { name: "Commercial Invoice", status: "AI ready", time: "4 sec" },
  { name: "Packing List", status: "Auto-filled", time: "3 sec" },
  { name: "Certificate of Origin", status: "Needs buyer details", time: "6 sec" },
  { name: "Proforma Invoice", status: "Saved template", time: "2 sec" },
  { name: "Shipping Bill Draft", status: "Pending review", time: "7 sec" },
  { name: "LC Helper", status: "Draft support", time: "5 sec" },
];

const RECENT_DOCUMENTS = [
  { id: "TRD-2025-0142", name: "Commercial Invoice", buyer: "Milan Textiles GmbH", amount: "₹18.4L", status: "Ready" },
  { id: "TRD-2025-0139", name: "Packing List", buyer: "Dubai Home Co.", amount: "₹7.2L", status: "In review" },
  { id: "TRD-2025-0133", name: "Certificate of Origin", buyer: "Apex FZE", amount: "₹11.1L", status: "Approved" },
];

const COMPLIANCE_ALERTS = [
  { title: "SABER certificate required", detail: "Saudi Arabia shipment due in 2 days", tone: "warning" },
  { title: "HS code review suggested", detail: "Wooden furniture classification needs confirmation", tone: "neutral" },
  { title: "Packing compliance update", detail: "EU labeling requirements changed last week", tone: "critical" },
];

const SHIPMENTS = [
  { id: "SHP-4081", buyer: "Apex FZE", country: "UAE", value: "₹22.4L", stage: "Documentation", progress: 42 },
  { id: "SHP-4077", buyer: "Nordline GmbH", country: "Germany", value: "₹15.8L", stage: "Customs", progress: 68 },
  { id: "SHP-4068", buyer: "Jinsei Trading", country: "Japan", value: "₹9.6L", stage: "In Transit", progress: 84 },
];

const SHIPMENT_MILESTONES = ["Draft", "Documentation", "Customs", "In Transit", "Delivered"];

const BILLING_PLANS = [
  {
    name: "Free",
    price: "₹0",
    description: "For early export operations",
    features: ["5 shipments/month", "Basic document drafts", "Core dashboards"],
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹4,999",
    description: "For serious SME exporters",
    features: ["Unlimited shipments", "AI docs", "ComplianceCore", "ShipmentHub"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "₹14,999",
    description: "For multi-user operating teams",
    features: ["Multi-user access", "Buyer portal", "Priority support", "API access"],
    highlight: false,
  },
];

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/" element={<TradeOSShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="documents/new" element={<DocumentsPage variant="wizard" />} />
          <Route path="documents/:docId" element={<DocumentPreviewPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="shipments/:shipmentId" element={<ShipmentDetailPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

function TradeOSShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const title = useMemo(() => {
    const route = location.pathname.split("/")[1] || "dashboard";
    if (route === "documents") return "DocEngine";
    if (route === "compliance") return "ComplianceCore";
    if (route === "shipments") return "ShipmentHub";
    if (route === "billing") return "Billing";
    if (route === "settings") return "Settings";
    return "Command Center";
  }, [location.pathname]);

  return (
    <div className="tradeos-app">
      <header className="tradeos-topbar">
        <div className="tradeos-topbar-left">
          <button className="tradeos-icon-button tradeos-mobile-toggle" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle navigation">
            {sidebarOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <div className="tradeos-brand">TradeOS</div>
            <div className="tradeos-topbar-subtitle">Operating system for Indian SME exporters</div>
          </div>
        </div>
        <div className="tradeos-topbar-center">
          <Search size={16} />
          <input className="tradeos-search" placeholder="Search documents, shipments, compliance items" />
        </div>
        <div className="tradeos-topbar-actions">
          <span className="tradeos-status-pill"><CircleDashed size={12} /> All systems operational</span>
          <button className="tradeos-icon-button" aria-label="Notifications"><Bell size={16} /></button>
          <button className="tradeos-primary-button">Create document</button>
        </div>
      </header>

      <div className="tradeos-shell">
        <aside className={cn("tradeos-sidebar", sidebarOpen && "is-open")}>
          <div className="tradeos-sidebar-section">
            <div className="tradeos-sidebar-label">Workspace</div>
            <div className="tradeos-sidebar-title">TradeOS Command Center</div>
            <div className="tradeos-sidebar-copy">Focused on docs, compliance, and shipment execution.</div>
          </div>
          <nav className="tradeos-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => cn("tradeos-nav-link", isActive && "active")}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="tradeos-sidebar-card">
            <div className="tradeos-sidebar-card-title">TradeOS Growth</div>
            <div className="tradeos-sidebar-card-copy">Unlimited document workflows, compliance alerts, and shipment visibility.</div>
            <button className="tradeos-secondary-button tradeos-full-width">Upgrade plan</button>
          </div>
        </aside>

        <main className="tradeos-main">
          <div className="tradeos-page">
            <div className="tradeos-page-kicker">{title}</div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function PageHeader({ title, description, action, secondaryAction }) {
  return (
    <div className="tradeos-page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="tradeos-page-actions">
        {secondaryAction}
        {action}
      </div>
    </div>
  );
}

function StatCard({ label, value, detail, tone = "default" }) {
  return (
    <div className={cn("tradeos-card", tone === "accent" && "tone-accent")}>
      <div className="tradeos-card-label">{label}</div>
      <div className="tradeos-card-value">{value}</div>
      <div className="tradeos-card-detail">{detail}</div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  return <span className={cn("tradeos-badge", `tone-${tone}`)}>{children}</span>;
}

function DashboardPage() {
  return (
    <>
      <section className="tradeos-hero">
        <div>
          <Badge tone="accent">DocEngine + ComplianceCore + ShipmentHub</Badge>
          <h2>Run export operations like a modern B2B SaaS team.</h2>
          <p>
            TradeOS helps Indian SME exporters generate documents, validate compliance, and track shipments from one operational workspace.
          </p>
          <div className="tradeos-hero-actions">
            <button className="tradeos-primary-button">Start new document</button>
            <button className="tradeos-secondary-button">Review compliance queue</button>
          </div>
        </div>
        <div className="tradeos-hero-panel">
          <div className="tradeos-hero-panel-row">
            <span>Document SLA</span>
            <strong>Under 30 seconds</strong>
          </div>
          <div className="tradeos-hero-panel-row">
            <span>Active shipments</span>
            <strong>18</strong>
          </div>
          <div className="tradeos-hero-panel-row">
            <span>Compliance items</span>
            <strong>7 pending</strong>
          </div>
          <div className="tradeos-hero-panel-row">
            <span>Operational revenue</span>
            <strong>₹1.24 Cr</strong>
          </div>
        </div>
      </section>

      <section className="tradeos-metric-grid">
        <StatCard label="Documents generated" value="142" detail="This month across 23 export accounts" />
        <StatCard label="Compliance warnings" value="7" detail="Items requiring review before dispatch" />
        <StatCard label="Shipments in motion" value="18" detail="Tracked through customs and transit" />
        <StatCard label="Time saved" value="64 hrs" detail="Automated drafts and autofill workflows" tone="accent" />
      </section>

      <section className="tradeos-grid-two">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Recent documents</h3>
            <button className="tradeos-link-button">View all <ChevronRight size={14} /></button>
          </div>
          <div className="tradeos-table-wrap">
            <table className="tradeos-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Buyer</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_DOCUMENTS.map((document) => (
                  <tr key={document.id}>
                    <td>
                      <div className="tradeos-table-title">{document.name}</div>
                      <div className="tradeos-table-subtitle">{document.id}</div>
                    </td>
                    <td>{document.buyer}</td>
                    <td>{document.amount}</td>
                    <td><Badge tone={document.status === "Approved" ? "success" : document.status === "Ready" ? "accent" : "warning"}>{document.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Compliance alerts</h3>
            <button className="tradeos-link-button">Open queue <ChevronRight size={14} /></button>
          </div>
          <div className="tradeos-stack">
            {COMPLIANCE_ALERTS.map((alert) => (
              <div className="tradeos-alert" key={alert.title}>
                <div className="tradeos-alert-icon">
                  {alert.tone === "critical" ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                </div>
                <div>
                  <div className="tradeos-alert-title">{alert.title}</div>
                  <div className="tradeos-alert-copy">{alert.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tradeos-grid-two bottom-gap">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Shipment pipeline</h3>
            <button className="tradeos-link-button">Open ShipmentHub <ChevronRight size={14} /></button>
          </div>
          <div className="tradeos-pipeline">
            {SHIPMENTS.map((shipment) => (
              <div key={shipment.id} className="tradeos-pipeline-row">
                <div>
                  <div className="tradeos-table-title">{shipment.id}</div>
                  <div className="tradeos-table-subtitle">{shipment.buyer} · {shipment.country}</div>
                </div>
                <div className="tradeos-progress">
                  <div className="tradeos-progress-track"><span style={{ width: `${shipment.progress}%` }} /></div>
                  <div className="tradeos-progress-copy">{shipment.stage} · {shipment.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Today’s actions</h3>
          </div>
          <div className="tradeos-action-list">
            <div className="tradeos-action-item"><CheckCircle2 size={16} /> Generate invoice for Milan Textiles</div>
            <div className="tradeos-action-item"><FileCheck2 size={16} /> Verify HS code before final packing</div>
            <div className="tradeos-action-item"><Truck size={16} /> Update shipment status for SHP-4077</div>
            <div className="tradeos-action-item"><LockKeyhole size={16} /> Review destination regulation changes</div>
          </div>
        </div>
      </section>
    </>
  );
}

function DocumentsPage({ variant = "overview" }) {
  return (
    <>
      <PageHeader
        title="DocEngine"
        description="Generate export documents in under 30 seconds with AI-assisted autofill, editable previews, and reusable templates."
        action={<button className="tradeos-primary-button"><Plus size={16} /> New document</button>}
      />

      <section className={cn("tradeos-grid-two", variant === "wizard" && "wizard-layout")}>
        <DocumentWizard compact={variant !== "wizard"} />
        <div className="tradeos-stack">
          <div className="tradeos-panel">
            <div className="tradeos-panel-header">
              <h3>Templates</h3>
              <Badge tone="accent">Save as template</Badge>
            </div>
            <div className="tradeos-template-grid">
              {DOCUMENT_TEMPLATES.map((template) => (
                <div className="tradeos-template-card" key={template.name}>
                  <div className="tradeos-table-title">{template.name}</div>
                  <div className="tradeos-table-subtitle">{template.status}</div>
                  <div className="tradeos-template-meta">
                    <span>{template.time}</span>
                    <button className="tradeos-link-button">Use template</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tradeos-panel">
            <div className="tradeos-panel-header">
              <h3>Recent documents</h3>
            </div>
            <div className="tradeos-stack">
              {RECENT_DOCUMENTS.map((document) => (
                <div className="tradeos-list-row" key={document.id}>
                  <div>
                    <div className="tradeos-table-title">{document.name}</div>
                    <div className="tradeos-table-subtitle">{document.buyer}</div>
                  </div>
                  <div className="tradeos-list-side">
                    <span>{document.amount}</span>
                    <Badge tone={document.status === "Approved" ? "success" : document.status === "Ready" ? "accent" : "warning"}>{document.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DocumentWizard({ compact }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    product: "Organic cotton shirts",
    buyer: "Apex FZE",
    quantity: "1,200 pcs",
    country: "United Arab Emirates",
    terms: "FOB Mumbai",
  });
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const steps = ["Product", "Buyer", "Shipment", "Generate", "Export"];

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      navigate("/documents/preview");
    }, 700);
  };

  return (
    <div className={cn("tradeos-panel", compact && "tradeos-panel-compact")}>
      <div className="tradeos-panel-header">
        <h3>AI document generator</h3>
        <Badge tone="accent">30 second workflow</Badge>
      </div>

      <div className="tradeos-stepper">
        {steps.map((label, index) => (
          <div key={label} className={cn("tradeos-step", step >= index + 1 && "active")}>
            <span>{index + 1}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>

      <div className="tradeos-form-grid">
        <label>
          <span>Product name</span>
          <input value={form.product} onChange={(event) => updateField("product", event.target.value)} />
        </label>
        <label>
          <span>Buyer details</span>
          <input value={form.buyer} onChange={(event) => updateField("buyer", event.target.value)} />
        </label>
        <label>
          <span>Quantity</span>
          <input value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} />
        </label>
        <label>
          <span>Country</span>
          <input value={form.country} onChange={(event) => updateField("country", event.target.value)} />
        </label>
        <label className="tradeos-form-wide">
          <span>Shipping terms</span>
          <input value={form.terms} onChange={(event) => updateField("terms", event.target.value)} />
        </label>
      </div>

      <div className="tradeos-ai-note">
        <Sparkles size={16} />
        <span>AI suggestions: invoice, packing list, certificate of origin, proforma invoice, shipping bill draft, LC helper.</span>
      </div>

      <div className="tradeos-wizard-actions">
        <button className="tradeos-secondary-button" onClick={() => setStep((value) => Math.max(1, value - 1))}>Back</button>
        <button className="tradeos-primary-button" onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate documents"}
        </button>
      </div>

      <div className="tradeos-preview">
        <div className="tradeos-preview-header">
          <div>
            <div className="tradeos-preview-title">Commercial Invoice Preview</div>
            <div className="tradeos-preview-copy">Editable, export-ready, and structured for PDF download.</div>
          </div>
          <div className="tradeos-preview-actions">
            <button className="tradeos-link-button"><Eye size={14} /> Preview</button>
            <button className="tradeos-link-button"><Download size={14} /> PDF</button>
          </div>
        </div>
        <div className="tradeos-doc-surface">
          <div className="tradeos-doc-row"><span>Exporter</span><strong>TradeOS Manufacturing Pvt. Ltd.</strong></div>
          <div className="tradeos-doc-row"><span>Buyer</span><strong>{form.buyer}</strong></div>
          <div className="tradeos-doc-row"><span>Product</span><strong>{form.product}</strong></div>
          <div className="tradeos-doc-row"><span>Quantity</span><strong>{form.quantity}</strong></div>
          <div className="tradeos-doc-row"><span>Country</span><strong>{form.country}</strong></div>
          <div className="tradeos-doc-row"><span>Terms</span><strong>{form.terms}</strong></div>
        </div>
      </div>
    </div>
  );
}

function DocumentPreviewPage() {
  const { docId } = useParams();

  return (
    <>
      <PageHeader
        title="Document preview"
        description="Inspect the generated export file, edit the fields, and download a polished PDF version."
        action={<button className="tradeos-primary-button"><Download size={16} /> Download PDF</button>}
      />
      <div className="tradeos-panel tradeos-preview-page">
        <div className="tradeos-preview-header">
          <div>
            <div className="tradeos-preview-title">{docId === "preview" ? "Commercial Invoice" : `Document ${docId}`}</div>
            <div className="tradeos-preview-copy">Stripe-style document surface with export-grade spacing and clear fields.</div>
          </div>
          <Badge tone="success">Ready for export</Badge>
        </div>
        <div className="tradeos-doc-surface large">
          <div className="tradeos-doc-row"><span>Exporter</span><strong>TradeOS Manufacturing Pvt. Ltd.</strong></div>
          <div className="tradeos-doc-row"><span>Buyer</span><strong>Apex FZE</strong></div>
          <div className="tradeos-doc-row"><span>Product</span><strong>Organic cotton shirts</strong></div>
          <div className="tradeos-doc-row"><span>Invoice value</span><strong>₹18,40,000</strong></div>
          <div className="tradeos-doc-row"><span>Shipping terms</span><strong>FOB Mumbai</strong></div>
          <div className="tradeos-doc-row"><span>Next step</span><strong>Share with buyer and save to shipment record</strong></div>
        </div>
        <div className="tradeos-preview-actions bottom">
          <button className="tradeos-secondary-button">Edit fields</button>
          <button className="tradeos-primary-button">Share link</button>
        </div>
      </div>
    </>
  );
}

function CompliancePage() {
  const [query, setQuery] = useState("Organic cotton shirts");

  return (
    <>
      <PageHeader
        title="ComplianceCore"
        description="Keep shipments clean with HS intelligence, regulatory checks, and destination-specific document requirements."
        action={<button className="tradeos-primary-button"><ShieldCheck size={16} /> Run check</button>}
      />

      <section className="tradeos-grid-two">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>HS code intelligence</h3>
          </div>
          <label className="tradeos-search-block">
            <span>Product or category</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product classification" />
          </label>
          <div className="tradeos-compliance-box">
            <div className="tradeos-compliance-row"><Hash size={16} /> Suggested HS code: 6109.10</div>
            <div className="tradeos-compliance-row"><FileCheck2 size={16} /> Classification confidence: High</div>
            <div className="tradeos-compliance-row"><Sparkles size={16} /> AI note: confirm fabric blend and knit structure before export filing.</div>
          </div>
        </div>

        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Live alerts</h3>
          </div>
          <div className="tradeos-stack">
            {COMPLIANCE_ALERTS.map((alert) => (
              <div className="tradeos-alert" key={alert.title}>
                <div className="tradeos-alert-icon"><CircleAlert size={16} /></div>
                <div>
                  <div className="tradeos-alert-title">{alert.title}</div>
                  <div className="tradeos-alert-copy">{alert.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tradeos-grid-two bottom-gap">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Required checklist</h3>
          </div>
          <div className="tradeos-checklist">
            {[
              "Commercial Invoice",
              "Packing List",
              "Certificate of Origin",
              "HS code validation",
              "Country-specific certificate",
            ].map((item, index) => (
              <div key={item} className="tradeos-list-row">
                <div className="tradeos-check-item"><CheckCircle2 size={16} /> {item}</div>
                <Badge tone={index < 3 ? "success" : "warning"}>{index < 3 ? "Ready" : "Pending"}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Country regulations</h3>
          </div>
          <div className="tradeos-regulation">
            <div className="tradeos-regulation-item">
              <span>Destination</span>
              <strong>Saudi Arabia</strong>
            </div>
            <div className="tradeos-regulation-item">
              <span>Required document</span>
              <strong>SABER certification</strong>
            </div>
            <div className="tradeos-regulation-item">
              <span>Risk severity</span>
              <strong>Medium</strong>
            </div>
            <div className="tradeos-regulation-item">
              <span>Timeline</span>
              <strong>Review before shipping</strong>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ShipmentsPage() {
  return (
    <>
      <PageHeader
        title="ShipmentHub"
        description="Track export orders through draft, documentation, customs, in-transit, and delivered states with a clean workflow view."
        action={<button className="tradeos-primary-button"><Truck size={16} /> New shipment</button>}
      />
      <section className="tradeos-grid-two">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Shipment pipeline</h3>
            <div className="tradeos-inline-actions">
              <button className="tradeos-link-button"><Filter size={14} /> Filter</button>
              <button className="tradeos-link-button"><Upload size={14} /> Import</button>
            </div>
          </div>
          <div className="tradeos-pipeline-cards">
            {SHIPMENTS.map((shipment) => (
              <NavLink key={shipment.id} to={`/shipments/${shipment.id}`} className="tradeos-shipment-card">
                <div className="tradeos-shipment-card-top">
                  <div>
                    <div className="tradeos-table-title">{shipment.id}</div>
                    <div className="tradeos-table-subtitle">{shipment.buyer} · {shipment.country}</div>
                  </div>
                  <Badge tone={shipment.stage === "In Transit" ? "success" : "accent"}>{shipment.stage}</Badge>
                </div>
                <div className="tradeos-shipment-card-bottom">
                  <strong>{shipment.value}</strong>
                  <span>{shipment.progress}% complete</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Communication timeline</h3>
          </div>
          <div className="tradeos-timeline">
            <div className="tradeos-timeline-item"><Clock3 size={16} /> Buyer confirmed draft invoice</div>
            <div className="tradeos-timeline-item"><FileSignature size={16} /> Documents auto-generated and shared</div>
            <div className="tradeos-timeline-item"><ShieldCheck size={16} /> Compliance review completed</div>
            <div className="tradeos-timeline-item"><Truck size={16} /> Customs filing prepared for pickup</div>
          </div>
        </div>
      </section>
    </>
  );
}

function ShipmentDetailPage() {
  const { shipmentId } = useParams();
  const shipment = SHIPMENTS.find((item) => item.id === shipmentId) || SHIPMENTS[0];

  return (
    <>
      <PageHeader
        title={shipment.id}
        description="Shipment detail view with workflow steps, document status, buyer context, and operational notes."
        action={<button className="tradeos-primary-button"><Download size={16} /> Export summary</button>}
      />
      <section className="tradeos-grid-two bottom-gap">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Shipment summary</h3>
          </div>
          <div className="tradeos-detail-grid">
            <div><span>Buyer</span><strong>{shipment.buyer}</strong></div>
            <div><span>Country</span><strong>{shipment.country}</strong></div>
            <div><span>Value</span><strong>{shipment.value}</strong></div>
            <div><span>Status</span><strong>{shipment.stage}</strong></div>
          </div>
          <div className="tradeos-doc-surface compact">
            {SHIPMENT_MILESTONES.map((milestone, index) => (
              <div className="tradeos-timeline-step" key={milestone}>
                <span className={cn(index <= 2 && "complete")}>{index + 1}</span>
                <div>
                  <strong>{milestone}</strong>
                  <p>{index === 0 ? "Draft created" : index === 1 ? "Documents prepared" : index === 2 ? "Awaiting clearance" : index === 3 ? "Moving to destination" : "Completed"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tradeos-panel">
          <div className="tradeos-panel-header">
            <h3>Activity feed</h3>
          </div>
          <div className="tradeos-stack">
            <div className="tradeos-feed-row"><FileText size={16} /> Invoice updated and sent to buyer</div>
            <div className="tradeos-feed-row"><ShieldCheck size={16} /> ComplianceCore cleared packing list requirements</div>
            <div className="tradeos-feed-row"><Mail size={16} /> Buyer requested ETA confirmation</div>
            <div className="tradeos-feed-row"><Smartphone size={16} /> Operations team logged customs handoff</div>
          </div>
        </div>
      </section>
    </>
  );
}

function BillingPage() {
  return (
    <>
      <PageHeader
        title="Billing"
        description="Premium SaaS pricing for exporters who need operational document automation and trusted workflow visibility."
        action={<button className="tradeos-secondary-button"><CreditCard size={16} /> Manage payment</button>}
      />
      <section className="tradeos-price-grid bottom-gap">
        {BILLING_PLANS.map((plan) => (
          <div className={cn("tradeos-plan-card", plan.highlight && "highlight")} key={plan.name}>
            <Badge tone={plan.highlight ? "accent" : "neutral"}>{plan.name}</Badge>
            <div className="tradeos-plan-price">{plan.price}</div>
            <div className="tradeos-plan-copy">{plan.description}</div>
            <div className="tradeos-plan-list">
              {plan.features.map((feature) => (
                <div key={feature} className="tradeos-plan-item"><CheckCircle2 size={16} /> {feature}</div>
              ))}
            </div>
            <button className={cn("tradeos-full-width", plan.highlight ? "tradeos-primary-button" : "tradeos-secondary-button")}>Choose plan</button>
          </div>
        ))}
      </section>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure company identity, team access, notifications, and product defaults."
        action={<button className="tradeos-primary-button"><Users size={16} /> Invite team</button>}
      />
      <section className="tradeos-grid-two bottom-gap">
        <div className="tradeos-panel">
          <div className="tradeos-panel-header"><h3>Company profile</h3></div>
          <div className="tradeos-settings-grid">
            <label><span>Company name</span><input defaultValue="TradeOS Manufacturing Pvt. Ltd." /></label>
            <label><span>GST / Tax ID</span><input defaultValue="27ABCDE1234F1Z5" /></label>
            <label><span>Primary email</span><input defaultValue="ops@tradeos.in" /></label>
            <label><span>Phone</span><input defaultValue="+91 98765 43210" /></label>
          </div>
        </div>
        <div className="tradeos-panel">
          <div className="tradeos-panel-header"><h3>Automation defaults</h3></div>
          <div className="tradeos-settings-list">
            <div className="tradeos-settings-row"><span>Auto-fill buyer details</span><Badge tone="success">On</Badge></div>
            <div className="tradeos-settings-row"><span>Compliance alerts by email</span><Badge tone="success">On</Badge></div>
            <div className="tradeos-settings-row"><span>Generate PDF after draft approval</span><Badge tone="accent">Enabled</Badge></div>
            <div className="tradeos-settings-row"><span>Buyer portal access</span><Badge tone="warning">Enterprise</Badge></div>
          </div>
        </div>
      </section>
    </>
  );
}

function AuthPage({ mode }) {
  return (
    <div className="tradeos-auth">
      <div className="tradeos-auth-panel">
        <div className="tradeos-auth-brand">TradeOS</div>
        <h1>{mode === "login" ? "Sign in to your export operating system" : "Create your TradeOS workspace"}</h1>
        <p>
          Premium software for Indian SME exporters who need fast documents, compliance control, and shipment visibility.
        </p>
        <div className="tradeos-auth-points">
          <div><FileText size={16} /> DocEngine for AI-generated export paperwork</div>
          <div><ShieldCheck size={16} /> ComplianceCore for risk and regulation checks</div>
          <div><Truck size={16} /> ShipmentHub for daily workflow tracking</div>
        </div>
      </div>
      <div className="tradeos-auth-card">
        <Badge tone="accent">Enterprise-ready SaaS</Badge>
        <h2>{mode === "login" ? "Welcome back" : "Start your workspace"}</h2>
        <form className="tradeos-auth-form">
          {mode === "signup" && <input placeholder="Company name" />}
          <input placeholder="Work email" />
          <input placeholder="Password" type="password" />
          {mode === "signup" && <input placeholder="Primary export market" />}
          <button className="tradeos-primary-button tradeos-full-width" type="button">{mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        <div className="tradeos-auth-footer">
          {mode === "login" ? "Need an account?" : "Already have an account?"} <RouterLink to={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create one" : "Sign in"}</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default App;