import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Base from '../core/Base';
import { createProduct, getCategories} from "./helper/adminapicall"
import {isAuthenticated} from "../auth/helper";

// TODO:Assignment:Loading/Redirect

const AddProduct = () => {

  const {user, token} = isAuthenticated();

    const [values, setValues] = useState({
        name : "",
        description : "",
        price : "",
        stock : "",
        photo : "",
        categories : [],
        category : "",
        loading : false,
        error : "",
        createdProduct : "",
        getRedirect : false,
        formData : ""
    });

    const {
      name, 
      description, 
      price, 
      stock, 
      categories, 
      category, 
      photo, 
      loading,
      error, 
      createdProduct,
      getRedirect,
      formData
    } = values;

    const preload = () => {
      getCategories().then(data => {
        if(data.error) {
          setValues({
            ...values,
            error : data.error
          });
        }else {
          setValues({
            ...values,
            categories : data,
            formData : new FormData()
          });
          console.log("CATE",categories);
        }
      })
    }

    useEffect(()=> {
      preload();
    }, []);

    const goBack = () => {
        return(
            <div className="mt-5">
                <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }

    const handleChange = (name) => (event) => {
        const value = name === "photo"  ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name] : value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error : "", loading : true});
        createProduct(user._id, token, formData)
          .then(data => {
            if(data.error) {
              setValues({...values, error : data.error})
            }else{
              setValues({
                ...values,
                name : "",
                description : "",
                price : "",
                stock : "",
                photo : "",
                loading : false,
                createdProduct : data.name,
              });
            }
          })
    }

    const successMessage = () => {
      return(
        <div className="alert alert-success mt-3"
          style={{display : createdProduct ? "" : "none"}}
        >
          <h4>{createProduct} created Successfully!</h4>
        </div>
      )
    }

    const warningMessage = () => {
      if(error) {
        return(
          <div className="alert alert-danger mt-3">
          <h4>{error}!</h4>
        </div>
        )
      }
    }

    const createProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories && 
                categories.map((category, index) => {
                  return (
                    <option key={index} value={category._id}>{category.name}</option>
                  );
                })
              }
            </select>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={handleSubmit} className="btn btn-outline-success mb-3">
            Create Product
          </button>
        </form>
    );

    return(
        <Base 
            title="Add a Product" 
            description="add a new product to the existing products"
            className="container bg-info p-4"
        >
         <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                  {successMessage()}
                  {warningMessage()}
                  {goBack()}
                  {createProductForm()}
                </div>
            </div>
        </Base>
    )
}

export default AddProduct;