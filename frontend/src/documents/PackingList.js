import {formatNumber} from "../utils/formatUtils";

export function generatePackingList(f){

 return {

  id:"packing_list",
  title:"Packing List",
  icon:"📦",

  sections:[

   {
    title:"EXPORTER",
    rows:[
     ["Company",f.sellerCompany],
     ["Address",f.sellerAddress]
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
    title:"PACKAGING DETAILS",
    rows:[
     ["Packages",f.packageCount],
     ["Gross Weight",(parseFloat(f.grossWeight)||0)+" KG"],
     ["Net Weight",(parseFloat(f.netWeight)||0)+" KG"]
    ]
   },

   {
    title:"PRODUCT",
    rows:[
     ["Product",f.productName],
     ["HS Code",f.hsCode],
     ["Quantity",f.quantity+" "+f.unit]
    ]
   }

  ]

 };

}