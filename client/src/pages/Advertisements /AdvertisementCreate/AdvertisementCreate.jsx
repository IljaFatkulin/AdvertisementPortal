import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import AdvertisementService from "../../../api/AdvertisementService";
import Navbar from "../../../components/Navbar/Navbar";
import styles from './AdvertisementCreate.module.css';

const AdvertisementCreate = () => {
    const {category} = useParams();
    const [product, setProduct] = useState({
        name: "",
        price: 0.00,
        description: "",
        image: null
    });

    const [attributes, setAttributes] = useState([]);
    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);

        if(!product.image) {
            setErrors([...errors, "Image is required"]);
            return;
        }

        AdvertisementService.create(product, attributes, category)
            .then(response => {
                if(response.status === 201) {
                    navigate('/advertisements/' + category);
                } else if(response.status === 400) {

                    let e = response.data.errors;

                    for(const key in e) {
                        setErrors(prevErrors => [...prevErrors, e[key]])
                    }
                }
            });
    }

    const handleAttributeChange = (e, index) => {
        const { name, value } = e.target;
        setAttributes((prevAttributes) => {
            const updatedAttributes = [...prevAttributes];
            if(name === "name") {
                updatedAttributes[index] = { ...updatedAttributes[index], attribute: { ...updatedAttributes[index].attribute, name: value } };
            } else if(name === "value") {
                updatedAttributes[index] = { ...updatedAttributes[index], value: value };
            }

            return updatedAttributes;
        });
    };

    function addAttribute(e) {
        e.preventDefault();

        setAttributes([...attributes, {id: attributes.length, value: "", attribute: {name: ""}}]);
    }

    function removeAttribute(index) {
        setAttributes((prevAttributes) => {
            const updatedAttributes = [...prevAttributes];
            updatedAttributes.splice(index, 1);
            return updatedAttributes;
        });
    }

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setProduct({ ...product, image: selectedImage });
    };

    return (
        <div className={"container"}>
            <div className={"header"}>
                <Navbar/>
                <h1>Create</h1>
                <div className={"return"}>
                    <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                    <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>
                    <p>Create</p>
                </div>
            </div>
            <div className={styles.formCreate}>
                <div>
                    {errors.map(error =>
                        <p key={error} style={{color: "red"}}>{error}</p>
                    )}
                </div>
                <form encType={"multipart/form-data"}>
                    <p>Name: </p>
                    <input
                        type="text"
                        value={product.name}
                        onChange={e => setProduct({...product, name: e.target.value})}
                    />

                    <p>Price: </p>
                    <input
                        type="number"
                        value={product.price}
                        onChange={e => setProduct({...product, price: e.target.value})}
                    />

                    <p>Description: </p>
                    <input
                        type="text"
                        value={product.description}
                        onChange={e => setProduct({...product, description: e.target.value})}
                    />

                    <p>Image:</p>
                    <input
                        type="file"
                        name="image"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                    />

                    <div>
                        {attributes.length
                        ?
                            attributes.map((attribute, index) => (
                                <div key={attribute.id}>
                                    <p>Attribute:</p>
                                    <input
                                        placeholder="Name"
                                        type="text"
                                        name="name"
                                        value={attribute.attribute.name}
                                        onChange={(e) => handleAttributeChange(e, index)}
                                    />

                                    <input
                                        placeholder="Value"
                                        type="text"
                                        name="value"
                                        value={attribute.value}
                                        onChange={(e) => handleAttributeChange(e, index)}
                                    />

                                    <button onClick={() => removeAttribute(index)}>Remove</button>
                                </div>
                            ))
                        :
                            <p></p>
                        }
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={addAttribute}>Add attribute</button>
                        <button onClick={handleSubmit}>Create</button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default AdvertisementCreate;