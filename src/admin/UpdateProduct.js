import React, {useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Base from '../core/Base';
import { updateProduct, getCategories, getProduct} from "./helper/adminapicall"
import {isAuthenticated} from "../auth/helper";

// Todo:Rediret back to manage product
const UpdateProduct = ({match}) => {

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
        updatedProduct : "",
        getRedirect : false,
        formData : ""
    });

    const {
      name, 
      description, 
      price, 
      stock, 
      categories, 
      loading,
      error, 
      updatedProduct,
      getRedirect,
      formData
    } = values;

    const preload = (productId) => {
      getProduct(productId).then(data => {
        if(data.error) {
          setValues({
            ...values,
            error : data.error
          });
        }else {
          preloadCategories();
          setValues({
            ...values,
            name : data.name,
            description : data.description,
            price : data.price,
            category : data.category._id,
            stock : data.stock,
            formData : new FormData()
          });
          // console.log("CATE",categories);
        }
      })
    }
    
    const preloadCategories = () => {
      getCategories()
        .then(data => {
            if(data.error) {
                setValues({...values, error : data.error})
            }else{
                setValues({
                    categories : data,
                    formData : new FormData()
                })
            }
        })
    }

    useEffect(()=> {
      preload(match.params.productId);
    },[]);

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

    // TODO:update
    const handleSubmit = (event) => {
      event.preventDefault();
      setValues({...values, error : "", loading : true});
      
      updateProduct(match.params.productId, user._id, token, formData)
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
              getRedirect : true,
              updatedProduct : data.name,
            });
          }
        })
      
    }
    const successMessage = () => {
      return(
        <div className="alert alert-success mt-3"
          style={{display : updatedProduct ? "" : "none"}}
        >
          <h4>{updatedProduct} updated Successfully!</h4>
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

    const loadingMessage = () => {
      return(
          loading && (
              <div className="alert alert-info">
                  <h2>Loading...</h2>
              </div>
          )
      );
    }
    const performRedirect = () => {
      console.log(getRedirect);
      if(getRedirect){
        return <Redirect to="/admin/dashboard" />
      }
    }

    const updateProductForm = () => (
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
            Update Product
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
                {loadingMessage()}
                  {successMessage()}
                  {warningMessage()}
                  {goBack()}
                  {updateProductForm()}
                  {performRedirect()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateProduct;