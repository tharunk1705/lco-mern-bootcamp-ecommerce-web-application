import React, {useState} from 'react';
import Base from "../core/Base";
import { Redirect} from "react-router-dom";

import {signin, authenticate, isAuthenticated} from "../auth/helper"

const Signin = () => {

    const [values, setValues] = useState({
        email : "e@tharun.com",
        password : "12345",
        error : "",
        loading : false,
        didRedirect : false
    });

    const { email, password, error, loading, didRedirect}= values;

    const {user} = isAuthenticated();
    
    const handleChange = name =>  event => {
        setValues({...values, error : false, [name] : event.target.value});
    }

    const handleSubmit = event => {
        event.preventDefault();
        setValues({...values, error : false, loading : true});
        signin({email, password})
            .then(data => {
                if(data.error) {
                    setValues({...values, error : data.error, loading : false});
                }else{
                    authenticate(data, ()=> {
                        setValues({
                            ...values,
                            didRedirect : true
                        });
                    });
                }
            })
            .catch(console.log("Signin request failed"));
    }

    const performRedirect = () => {

        // TODO: do a redirection here
        if(didRedirect) {
            if(user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            } else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if(isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const loadingMessage = () => {
        return(
            loading && (
                <div className="alert alert-info">
                    <h2>Loading...</h2>
                </div>
            )
        );
    }

    const errorMessage = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div 
                        className="alert alert-danger"
                        style={{display : error ? "" : "none"}}
                    >
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const signInForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input 
                                className="form-control" 
                                type="email" 
                                value={email}
                                onChange={handleChange("email")}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input 
                                className="form-control" 
                                type="password" 
                                value={password}
                                onChange={handleChange("password")}
                            />
                        </div>
                        <button 
                            className="btn btn-success btn-block"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return(
        <Base title="Sign in page" description="A page for user to signin">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    );
}

export default Signin;