import { Link } from "react-router-dom";

const features = [
  {
    title: "Add Product",
    desc: "Register your product for export readiness analysis.",
    path: "/add-product",
  },
  {
    title: "Market Analysis",
    desc: "Discover the best international markets for your product.",
    path: "/market-analysis",
  },
  {
    title: "Profit Simulator",
    desc: "Simulate export profitability with duties and shipping costs.",
    path: "/profit-simulator",
  },
  {
    title: "Export Plan",
    desc: "Generate a step-by-step action plan for exporting.",
    path: "/export-plan",
  },
];

function Dashboard() {
  return (
    <div className="page">
      <h1>Welcome to ExportReady</h1>
      <p className="subtitle">
        AI-powered platform to help Indian SMEs go global.
      </p>

      <div className="card-grid">
        {features.map((f) => (
          <Link to={f.path} key={f.path} className="feature-card">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
