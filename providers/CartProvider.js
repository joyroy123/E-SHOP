"use client";

import { CartContextProvider } from "@/hooks/useCart";

const CartProvider = ({children}) => {
    return ( 
        <CartContextProvider>
            {children}
        </CartContextProvider>
     );
}
 
export default CartProvider;