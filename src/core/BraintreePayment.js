import React,{ useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { getMeToken, processPayment } from './helper/paymentHelper';
import {createOrder} from "./helper/orderHelper";
import { isAuthenticated } from '../auth/helper';
import DropIn from 'braintree-web-drop-in-react';



const BraintreePayment = ({products, setReload = f => f, reload = undefined}) => {
   
    const [info, setInfo] = useState({
        loading : false,
        success : false,
        clientToken : null,
        error : "",
        instance : {}
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getMeToken(userId, token)
            .then(info => {
                // console.log("INFORMATION",info);
                if(info.error) {
                    setInfo({...info, error : info.error})
                }else{
                    const clientToken = info.clientToken;
                    console.log(clientToken);
                    setInfo({clientToken : clientToken});
                }
            })
    }
    
    const showBtDropIn = () => {
        return(
            <div>
                {info.clientToken != null && products.length > 0 ? (
                    <div>
                        <DropIn
                        options={{ authorization: info.clientToken }}
                        onInstance={(instance) => (info.instance = instance)}
                        />
                        <button className="btn btn-success btn-block" onClick={onPurchase}>Buy</button>
                  </div>
                ) : (
                    <h3>PLease login or Add Something to cart</h3>
                )}
            </div>
        )
    }


    useEffect(()=> {
        getToken(userId, token);
    }, [])

    const onPurchase = () => {
        setInfo({loading : true});
        let nonce;
        let {getNonce} =info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce;
                const paymentData = {
                    paymentMethodNonce : nonce,
                    amount : getAmount()
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({...info, success : response.success, loading : false})
                        console.log("PAYMENT SUCCESS");
                        // TODO: empty the cart
                        // TODO: force Reload
                        setReload(!reload);
                    })
            })
            .catch(error => {
                setInfo({loading : false, success : false, error: error})
                console.log("PAYMENT SUCCESS");
            })
    }

    const getAmount = () => {
        let amount = 0;
        products.map(product => {
            amount = amount + product.price;
        } )
        return amount;
    }

    return(
        <div>
            <h3>Your Totoal is ${getAmount()}</h3>
            {showBtDropIn()}
        </div> 
    )
}

export default BraintreePayment;