import { Link } from "react-router-dom";

const linkStyle = {
  display: "block",
  marginBottom: "20px",
  textDecoration: "none",
  color: "#0D1B4C",
  fontWeight: "600"
};

function Sidebar() {

  return (
    <div style={{
      width:"220px",
      background:"#FAFAFA",
      height:"100vh",
      padding:"20px",
      borderRight:"1px solid #eee"
    }}>

      <Link style={linkStyle} to="/">Dashboard</Link>

      <Link style={linkStyle} to="/product">Add Product</Link>

      <Link style={linkStyle} to="/market">Market Analysis</Link>

      <Link style={linkStyle} to="/profit">Profit Simulator</Link>

      <Link style={linkStyle} to="/export-plan">Export Plan</Link>

    </div>
  );
}

export default Sidebar;
