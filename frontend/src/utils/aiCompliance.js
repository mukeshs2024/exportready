/**
 * AI-powered compliance checking utility.
 * Rule-based checks for export documentation completeness.
 */

const REQUIRED_FIELDS = {
  buyer: ["buyerName", "buyerCountry", "buyerAddress"],
  order: ["productName", "quantity", "unitPrice"],
  shipment: ["portOfLoading", "portOfDischarge", "shippingMethod"],
};

const COUNTRY_RESTRICTIONS = {
  sanctions: ["North Korea", "Iran", "Syria", "Cuba"],
};

const CATEGORY_CERTIFICATIONS = {
  agricultural: ["Phytosanitary Certificate", "APEDA Registration"],
  food: ["FSSAI License", "Health Certificate"],
  electronics: ["BIS Certification", "CE Marking (for EU)"],
  pharmaceuticals: ["Drug License", "WHO-GMP Certificate"],
  textiles: ["Textile Committee Certificate"],
};

export function runComplianceCheck({ buyer, order, shipment, category }) {
  const issues = [];
  const warnings = [];
  const passed = [];

  // --- Required field checks ---
  for (const [section, fields] of Object.entries(REQUIRED_FIELDS)) {
    const data = { buyer, order, shipment }[section] || {};
    for (const field of fields) {
      if (!data[field] || String(data[field]).trim() === "") {
        issues.push(`Missing ${section} field: ${field}`);
      } else {
        passed.push(`${section}.${field} provided`);
      }
    }
  }

  // --- Country sanction check ---
  if (buyer?.buyerCountry) {
    const country = buyer.buyerCountry.trim();
    if (COUNTRY_RESTRICTIONS.sanctions.some((s) => s.toLowerCase() === country.toLowerCase())) {
      issues.push(`Export to ${country} may be restricted — check sanctions list`);
    } else {
      passed.push(`Destination country (${country}) not on sanctions list`);
    }
  }

  // --- Category-specific certifications ---
  const cat = (category || "").toLowerCase();
  const certs = CATEGORY_CERTIFICATIONS[cat];
  if (certs) {
    warnings.push(`Recommended certifications for ${category}: ${certs.join(", ")}`);
  }

  // --- Basic value checks ---
  if (order?.quantity && order.quantity <= 0) {
    issues.push("Order quantity must be greater than zero");
  }
  if (order?.unitPrice && order.unitPrice <= 0) {
    issues.push("Unit price must be greater than zero");
  }

  const score = Math.max(
    0,
    Math.round((passed.length / (passed.length + issues.length)) * 100) || 0
  );

  return { score, issues, warnings, passed };
}
