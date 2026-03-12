import {formatNumber,formatDate,calculateTotal} from "../utils/formatUtils";

export function generateCommercialInvoice(f){

 const totalValue = calculateTotal(f);

 return {

  id:"commercial_invoice",
  title:"Commercial Invoice",
  icon:"📄",

  sections:[

   {
    title:"INVOICE INFORMATION",
    rows:[
      ["Invoice Number",f.invoiceNo],
      ["Invoice Date",formatDate(f.shipDate)],
      ["Incoterms",f.incoterms],
      ["Currency",f.currency]
    ]
   },

   {
    title:"EXPORTER",
    rows:[
      ["Company",f.sellerCompany],
      ["Address",f.sellerAddress],
      ["IEC",f.sellerIEC],
      ["GST",f.sellerGST]
    ]
   },

   {
    title:"IMPORTER",
    rows:[
      ["Company",f.buyerCompany],
      ["Contact",f.buyerName],
      ["Country",f.buyerCountry],
      ["Email",f.buyerEmail]
    ]
   },

   {
    title:"PRODUCT DETAILS",
    rows:[
      ["Product",f.productName],
      ["HS Code",f.hsCode],
      ["Quantity",f.quantity+" "+f.unit],
      ["Unit Price",f.currency+" "+formatNumber(f.unitPrice)],
      ["Total Value",f.currency+" "+formatNumber(totalValue)]
    ]
   }

  ]

 };

}