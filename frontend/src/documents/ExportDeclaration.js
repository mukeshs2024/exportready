export function generateExportDeclaration(f){

 return {

  id:"export_declaration",
  title:"Export Declaration",
  icon:"🏛️",

  sections:[

   {
    title:"EXPORTER",
    rows:[
     ["IEC",f.sellerIEC],
     ["GST",f.sellerGST]
    ]
   },

   {
    title:"GOODS DECLARATION",
    rows:[
     ["Product",f.productName],
     ["HS Code",f.hsCode],
     ["Quantity",f.quantity+" "+f.unit]
    ]
   },

   {
    title:"DESTINATION",
    rows:[
     ["Country",f.buyerCountry],
     ["Port",f.portOfDischarge]
    ]
   }

  ]

 };

}