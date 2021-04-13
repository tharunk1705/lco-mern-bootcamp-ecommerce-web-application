import React,{useState, useEffect} from 'react';
import "../styles.css";
import Base from "./Base";
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import StripeCheckout from './StripeCheckout';



const Cart = () => {

    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(()=> {
        setProducts(loadCart());
    }, [reload])
    
    const loadAllProducts = (products) => {
        return(
            <div>
                {products.map((product, index) => (
                    <Card 
                        key={index} 
                        product={product}
                        addtoCart ={false}
                        removeFromCart = {true}
                        setReload={setReload}
                        reload={reload}
                    />
                ))}
            </div>
        )
    }

    return (
        <Base title="Cart Page" description="Welcome to your cart">
            <div className="row text-center">
                <div className="col-6">{products.length > 0 ? loadAllProducts(products) :(
                    <h3 className="text-white">Cart is Empty!</h3>
                )}</div>
                <div className="col-6">
                    <StripeCheckout 
                        products={products}
                        setReload={setReload}
                    />
                </div>
            </div>
        </Base>
    );
}

export default Cart;