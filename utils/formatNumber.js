export const formatNumber = (digit)=>{
    return new Intl.NumberFormat("en-US").format(digit);
}