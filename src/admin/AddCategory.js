import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import {createCategory} from "./helper/adminapicall"

const AddCategory = () => {
    
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);


    const {user, token} = isAuthenticated();

    const goBack = () => {
        return(
            <div className="mt-5">
                <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }

    const handleChange = (event) => {
        setError("");
        setName(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess(false);

        // backend request fired
        createCategory(user._id, token, {name})
            .then(data => {
                if(data.error) {
                    setError(true);
                }else{
                    setError(false);
                    setSuccess(true);
                    setName("");
                }
            })
    }

    const successMessage = () => {
        if(success)  {
            return (
                <h4 className="text-success">Category Created Successfully</h4>
            )
        }
    }

    const warningMessage = () => {
        if(error) {
            return(
                <h4 className="text-danger">Failed to create category</h4>
            )
        }

    }

    const myCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Enter the category</p>
                <input 
                    type="text"  
                    className="form-control my-3"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                    placeholder="For Eg. Summer Collection"
                />
                <button 
                    className="btn btn-outline-info"
                    onClick={handleSubmit}
                >
                    Create Category
                </button>
            </div>
        </form>
    )

    return(
        <Base 
            title="Add a category"
            description="add a new category to the existing categories"
            className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory;