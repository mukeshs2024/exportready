import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'linear-gradient(180deg,#ffffff,#fbfdff)' }}>
      <div style={{ maxWidth: 980, width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#0D1B4C', fontWeight: 800, fontSize: 18 }}>TradeOS</div>
          <h1 style={{ margin: '0.5rem 0 1rem', fontSize: '2.6rem', color: '#0D1B4C', lineHeight: 1.03 }}>An operating system for Indian SME exporters</h1>
          <p style={{ color: '#374151', fontSize: '1rem', marginBottom: '1.25rem' }}>
            DocEngine: AI-first export document generation. ComplianceCore: country-specific regulatory checks. ShipmentHub: operational shipment workflows.
            Built for real export teams — fast, reliable, and enterprise-grade.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/signup" style={{ background: '#0D1B4C', color: '#fff', padding: '0.8rem 1rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Get started — Free</Link>
            <Link to="/billing" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#0D1B4C', padding: '0.8rem 1rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>See pricing</Link>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', color: '#6B7280', fontSize: 13 }}>
            <div><strong style={{ color: '#111827' }}>Under 30s</strong> AI document generation</div>
            <div><strong style={{ color: '#111827' }}>Real-time</strong> compliance warnings</div>
            <div><strong style={{ color: '#111827' }}>Operational</strong> shipment pipeline</div>
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: 12, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(13,27,76,0.06)' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#0D1B4C' }}>Try DocEngine</h3>
          <p style={{ color: '#374151', marginBottom: 12 }}>Generate a commercial invoice with AI in seconds.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            <input placeholder="Product name" style={{ padding: '0.65rem 0.8rem', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <input placeholder="Buyer" style={{ padding: '0.65rem 0.8rem', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Qty" style={{ padding: '0.65rem 0.8rem', borderRadius: 8, border: '1px solid #e5e7eb', flex: 1 }} />
              <input placeholder="Country" style={{ padding: '0.65rem 0.8rem', borderRadius: 8, border: '1px solid #e5e7eb', flex: 1 }} />
            </div>
            <Link to="/documents/new" style={{ display: 'inline-block', textAlign: 'center', padding: '0.65rem 0.8rem', borderRadius: 8, background: '#2563EB', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Generate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
