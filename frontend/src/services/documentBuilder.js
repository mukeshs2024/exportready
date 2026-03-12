
import {generateCommercialInvoice} from "../documents/CommercialInvoice";
import {generatePackingList} from "../documents/PackingList";
import {generateCertificateOrigin} from "../documents/CertificateOrigin";
import {generateShippingInstructions} from "../documents/ShippingInstructions";
import {generateExportDeclaration} from "../documents/ExportDeclaration";
import {generateComplianceChecklist} from "../documents/ComplianceChecklist";

export function buildAllDocs(form){

 return [

  generateCommercialInvoice(form),
  generatePackingList(form),
  generateCertificateOrigin(form),
  generateShippingInstructions(form),
  generateExportDeclaration(form),
  generateComplianceChecklist(form)

 ];

}