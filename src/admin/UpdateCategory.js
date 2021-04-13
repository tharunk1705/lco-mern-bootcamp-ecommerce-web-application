import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Base from '../core/Base';
import { updateCategory,  getCategory} from "./helper/adminapicall";
import {isAuthenticated} from "../auth/helper";


const UpdateCategory = ({match}) => {

    
    const {user, token} = isAuthenticated();
    const [category, setCategory] = useState({
        name : "",
        error : ""
    });

    const {name, error} = category;

    const preload = categoryId => {
        getCategory(categoryId)
        .then(data => {
            if(data.error) {
                console.log(data.error);
            }else{
                setCategory({name : data.name})
            }
        })
    }

    useEffect(()=> {
        preload(match.params.categoryId);
    }, []);
  
    const goBack = () => {
        return(
            <div className="mt-5">
                <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }


    const handleChange = (event) => {
        setCategory({name : event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // backend request fired
        console.log({name});
        updateCategory(match.params.categoryId, user._id, token, category)
            .then(data => {
                if(data.error) {
                    setCategory({
                        ...category,
                        error : data.error
                    })
                }else{
                    setCategory({name : ""});
                }
            })
    }

    const successMessage = () => {
        if(!name)  {
            return (
                <h4 className="text-success">Category Updated Successfully</h4>
            )
        }
    }

    const warningMessage = () => {
        if(error) {
            return(
                <h4 className="text-danger"> Failed to update category</h4>
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
                    Update Category
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

export default UpdateCategory;