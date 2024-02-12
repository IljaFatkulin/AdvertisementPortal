import React, {useContext, useEffect, useState} from 'react';
import AdvertisementService from "../../../api/AdvertisementService";
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import Navbar from "../../../components/Navbar/Navbar";
import styles from '../AdvertisementCreate/AdvertisementCreate.module.css';
import {UserDetailsContext} from "../../../context/UserDetails";
import ImageConverter from "../../../components/ImageConverter/ImageConverter";

const AdvertisementEdit = () => {
    const {userDetails} = useContext(UserDetailsContext);

    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState();
    const [attributes, setAttributes] = useState([]);
    const {category, id} = useParams();
    const navigate = useNavigate();


    const [images, setImages] = useState([]);
    const [editedImages, setEditedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        AdvertisementService.getById(id)
            .then(response => {
                let attrs = [];
                response.attributes.forEach(attribute => {
                    attrs = [...attrs, {id: attrs.length, value: attribute.value, attribute: {name: attribute.attribute.name}}];
                });
                setAttributes(attrs);

                delete response.avatar

                // setImages(response.imagesBytes);
                // console.log(response.imagesBytes)

                const images = response.imagesBytes.map(image => {

                    return {
                        id: image.id,
                        image: image.image,
                        type: "bytes"
                    };
                });

                setImages(images);


                delete response.imagesBytes;
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

        console.log(editedImages);
        AdvertisementService.edit(product, attributes, id, editedImages, newImages, imagesToDelete, userDetails)
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

    const handleAvatarChange = (event) => {
        const selectedImage = event.target.files[0];
        setProduct({ ...product, avatar: selectedImage });
    };

    const handleImageChange = (e, id) => {
        // setImages([...images, {id: id, image: e.target.files[0]}]);
    
        const updatedImages = images.filter(image => image.id !== id);
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        console.log(url);

        setImages([...updatedImages, { id: id, image: url, type: "url" }]);
        setEditedImages([...editedImages, {id: id, image: file}]);
    }

    const handleAddImage = (e) => {
        e.preventDefault();
        setNewImages([...newImages, {id: newImages.length, image: null}]);
    }

    const handleImageAdd = (e, id) => {
        e.preventDefault();
        const updatedImages = newImages.map(image => {
            if(image.id === id) {
                image.image = e.target.files[0];
            }
            return image;
        });
        setNewImages(updatedImages);
    }

    const handleDeleteImage = (id) => {
        setImagesToDelete([...imagesToDelete, id]);
        const updatedImages = images.filter(image => image.id !== id);
        setImages(updatedImages);
    }

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

                    <p>Avatar:</p>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleAvatarChange}
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
                    <div className={styles.editImages}>
                        {images.length > 0 &&
                            images.map(image =>
                                <div key={image.id}>
                                    <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
                                    <div onClick={() => handleDeleteImage(image.id)} className={styles.closeButton} style={{alignSelf: "start", position:"absolute"}}>X</div>
                                        <label htmlFor={`imageInput${image.id}`}>
                                            {image.type === "bytes"
                                            ?
                                                <ImageConverter data={image.image} className={styles.imageEdit}/>
                                            :
                                                <img src={image.image} alt={`Image ${image.id}`} className={styles.imageEdit} />
                                            }
                                        </label>
                                        <input
                                            id={`imageInput${image.id}`}
                                            type="file"
                                            name={`avatar${image.id}`}
                                            accept="image/jpeg, image/png, image/jpg"
                                            onChange={(e) => handleImageChange(e, image.id)}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <div>
                        <p>Images:</p>
                        {newImages.length > 0 &&
                            newImages.map(image =>
                                <input
                                    key={image.id}
                                    type="file"
                                    name={"image" + image.id}
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={(e) => handleImageAdd(e, image.id)}
                                />
                            )
                        }
                        <button onClick={handleAddImage}>Add image</button>
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