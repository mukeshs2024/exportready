import React from "react";
import { Link } from "react-router-dom";

export default function OpportunityScanner() {
  return (
    <div style={{ padding: '2rem', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb' }}>
      <h2 style={{ margin: 0, color: '#0D1B4C' }}>Opportunity scanner retired</h2>
      <p style={{ color: '#374151' }}>This feature has been retired in TradeOS. Use the operational modules instead:</p>
      <ul>
        <li><Link to="/documents">DocEngine — Generate export documents</Link></li>
        <li><Link to="/compliance">ComplianceCore — Run regulation checks</Link></li>
        <li><Link to="/shipments">ShipmentHub — Track shipments</Link></li>
      </ul>
    </div>
  );
}

