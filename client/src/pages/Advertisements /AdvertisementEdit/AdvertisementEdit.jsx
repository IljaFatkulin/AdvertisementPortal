import React, {useContext, useEffect, useState} from 'react';
import AdvertisementService from "../../../api/AdvertisementService";
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import Navbar from "../../../components/Navbar/Navbar";
import styles from '../AdvertisementCreate/AdvertisementCreate.module.css';
import {UserDetailsContext} from "../../../context/UserDetails";

const AdvertisementEdit = () => {
    const {userDetails} = useContext(UserDetailsContext);

    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState();
    const [attributes, setAttributes] = useState([]);
    const {category, id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        AdvertisementService.getById(id)
            .then(response => {
                let attrs = [];
                response.attributes.forEach(attribute => {
                    attrs = [...attrs, {id: attrs.length, value: attribute.value, attribute: {name: attribute.attribute.name}}];
                });
                setAttributes(attrs);

                delete response.attributes;
                setProduct(response);

                setIsLoading(false);
            });
    }, []);

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

    function handleSubmit(e) {
        e.preventDefault();

        AdvertisementService.edit(product, attributes, id, userDetails)
            .then(response => {
                if(response.data === 'OK') {
                    navigate('/advertisements/' + category + '/' + id);
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

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setProduct({ ...product, image: selectedImage });
    };


    return (
        isLoading
        ?
        <Loader/>
        :
        <div className={"container"}>
            <div className={"header"}>
                <Navbar/>
                <h1>Edit</h1>
                <div className={"return"}>
                    <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                    <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>
                    <Link to={'/advertisements/' + category + '/' + id} id={"return"}><p className={"return-link"}>Details</p></Link>
                    <p>Edit</p>
                </div>
            </div>
            <div className={styles.formCreate}>
                <form>
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
                        <button onClick={handleSubmit} className={styles.save}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdvertisementEdit;