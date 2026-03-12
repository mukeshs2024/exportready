export function generateShippingInstructions(f){

 return {

  id:"shipping_instruction",
  title:"Shipping Instructions",
  icon:"🚢",

  sections:[

   {
    title:"SHIPPER",
    rows:[
     ["Company",f.sellerCompany]
    ]
   },

   {
    title:"CONSIGNEE",
    rows:[
     ["Company",f.buyerCompany],
     ["Country",f.buyerCountry]
    ]
   },

   {
    title:"ROUTE",
    rows:[
     ["Port of Loading",f.portOfLoading],
     ["Port of Discharge",f.portOfDischarge],
     ["Transport Mode",f.shipMode]
    ]
   }

  ]

 };

}