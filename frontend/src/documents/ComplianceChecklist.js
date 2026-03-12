export function generateComplianceChecklist(f){

 return {

  id:"compliance_checklist",
  title:"Export Compliance Checklist",
  icon:"✅",

  sections:[

   {
    title:"MANDATORY DOCUMENTS",
    rows:[
     ["Import Export Code","DGFT"],
     ["GST Registration","GST Portal"],
     ["Commercial Invoice","Exporter"],
     ["Packing List","Exporter"],
     ["Shipping Bill","ICEGATE"],
     ["Certificate of Origin","Chamber of Commerce"]
    ]
   },

   {
    title:"FINANCIAL DOCUMENTS",
    rows:[
     ["Letter of Credit","Buyer Bank"],
     ["Foreign Remittance Certificate","Exporter Bank"],
     ["Bank Realization Certificate","Exporter Bank"]
    ]
   }

  ]

 };

}