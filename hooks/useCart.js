import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {toast} from "react-hot-toast";

export const CartContext = createContext(null);

export const CartContextProvider = (props) =>{

    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartTotalAmount, setCartTotalAmount] = useState(0);
    const [cartProducts, setCartProducts] = useState(null);
    const [paymentIntent, setPaymentIntent] = useState(null);

    useEffect(() =>{
        const cartItems = localStorage.getItem("eShopCartItems");
        const cProducts = JSON.parse(cartItems);
        const eShopPaymentIntent = localStorage.getItem("eShopPaymentIntent");
        const paymentIntent = JSON.parse(eShopPaymentIntent);

        setCartProducts(cProducts);
        setPaymentIntent(paymentIntent);
    }, []);

    useEffect(()=> {
        const getTotals = ()=> {
            if(cartProducts) {
                const {total, qty} = cartProducts?.reduce((acc, item)=> {
                    const itemTotal = item.price * item.quantity;
        
                    acc.total = acc.total + itemTotal;
                    acc.qty = acc.qty + item.quantity;
        
                    return acc;
                    }, {
                        total: 0,
                        qty: 0,
                    }
                );

                setCartTotalQty(qty);
                setCartTotalAmount(total);
            };
        };

        getTotals();
    },[cartProducts]);

    const handleAddProductToCart = useCallback((product) => {
        setCartProducts((prev) =>{
            let updatedCart;

            if(prev){
                updatedCart = [...prev, product];
            }else{
                updatedCart = [product];
            }

            toast.success("Product added to cart");
            localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    }, []);

    const handleRemoveProductFromCart = useCallback((product)=> {
        if(cartProducts){
            const filteredProducts = cartProducts.filter((item) => {
                return item.id !== product.id
            });

            setCartProducts(filteredProducts);
            toast.success("Product removed");
            localStorage.setItem("eShopCartItems", JSON.stringify(filteredProducts));
        }
    }, [cartProducts]);

    const handleCartQtyIncrease = useCallback((product)=>{
        let updatedCart;

        if(product.quantity === 99){
            return toast.error("Oops! Maximum reached");
        }

        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if(existingIndex > -1){
                updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity + 1;
            }

            setCartProducts(updatedCart);
            localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
        }
    },[cartProducts]);

    const handleCartQtyDecrease = useCallback((product)=>{
        let updatedCart;

        if(product.quantity === 1){
            return toast.error("Oops! Minimum reached");
        }

        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if(existingIndex > -1){
                updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity - 1;
            }

            setCartProducts(updatedCart);
            localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
        }
    },[cartProducts]);

    const handleClearCart = useCallback(()=>{
        setCartProducts(null);
        setCartTotalQty(0);
        localStorage.setItem("eShopCartItems", JSON.stringify(null));
    },[cartProducts]);


    const handleSetPaymentIntent = useCallback((val) => {
        setPaymentIntent(val);
        localStorage.setItem("eShopPaymentIntent", JSON.stringify(val));
    }, [paymentIntent]);


    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        paymentIntent,
        handleSetPaymentIntent,
    };

    return <CartContext.Provider value={value} {...props} />
};

export const useCart = () =>{
    const context = useContext(CartContext);

    if(context === null){
        throw new Error("useCart must be used within a CartContextProvider");
    }

    return context;
}