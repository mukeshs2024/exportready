export function formatNumber(n){
  return (parseFloat(n)||0).toLocaleString("en-US",{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });
}

export function formatDate(d){
  if(!d) return "";
  return new Date(d).toLocaleDateString("en-GB",{
    day:"2-digit",
    month:"long",
    year:"numeric"
  });
}

export function calculateTotal(f){
  return (parseFloat(f.quantity)||0) *
         (parseFloat(f.unitPrice)||0);
}