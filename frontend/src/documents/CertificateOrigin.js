export function generateCertificateOrigin(f){

 return {

  id:"certificate_origin",
  title:"Certificate of Origin",
  icon:"🌐",

  sections:[

   {
    title:"EXPORTER",
    rows:[
     ["Company",f.sellerCompany],
     ["Country","India"]
    ]
   },

   {
    title:"IMPORTER",
    rows:[
     ["Company",f.buyerCompany],
     ["Destination",f.buyerCountry]
    ]
   },

   {
    title:"GOODS",
    rows:[
     ["Product",f.productName],
     ["HS Code",f.hsCode],
     ["Origin","India"]
    ]
   }

  ]

 };

}