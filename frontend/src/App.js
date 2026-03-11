import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import ProfitSimulator from "./pages/ProfitSimulator";
import ExportPlan from "./pages/ExportPlan";

function App() {
  return (
    <Router>

      <Navbar />

      <div style={{display:"flex"}}>

        <Sidebar />

        <div style={{padding:"20px",width:"100%"}}>

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/product" element={<ProductForm />} />

            <Route path="/market" element={<MarketAnalysis />} />

            <Route path="/profit" element={<ProfitSimulator />} />

            <Route path="/export-plan" element={<ExportPlan />} />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;