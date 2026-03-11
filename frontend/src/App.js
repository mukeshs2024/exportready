import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import ProfitSimulator from "./pages/ProfitSimulator";
import ExportPlan from "./pages/ExportPlan";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/market-analysis" element={<MarketAnalysis />} />
          <Route path="/profit-simulator" element={<ProfitSimulator />} />
          <Route path="/export-plan" element={<ExportPlan />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;