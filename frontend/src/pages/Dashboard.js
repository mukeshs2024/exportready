import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  return (

    <div>

      <h2>Welcome to ExportReady</h2>
      <p>Analyze global markets and export profit potential.</p>

      <div style={{display:"flex",gap:"20px",marginTop:"30px"}}>

        <div
          onClick={()=>navigate("/market")}
          style={{
            background:"#F5A623",
            padding:"20px",
            borderRadius:"10px",
            width:"220px",
            color:"white",
            cursor:"pointer"
          }}
        >
          <h3>Market Analysis</h3>
          <p>Find top export countries</p>
        </div>

        <div
          onClick={()=>navigate("/profit")}
          style={{
            background:"#0D1B4C",
            padding:"20px",
            borderRadius:"10px",
            width:"220px",
            color:"white",
            cursor:"pointer"
          }}
        >
          <h3>Profit Simulator</h3>
          <p>Estimate export profitability</p>
        </div>

        <div
          onClick={()=>navigate("/export-plan")}
          style={{
            background:"#0D1B4C",
            padding:"20px",
            borderRadius:"10px",
            width:"220px",
            color:"white",
            cursor:"pointer"
          }}
        >
          <h3>Compliance Guide</h3>
          <p>Understand export rules</p>
        </div>

      </div>

    </div>

  );
}

export default Dashboard;
