import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import AdvertisementService from "../../../api/AdvertisementService";
import Navbar from "../../../components/Navbar/Navbar";
import styles from './AdvertisementCreate.module.css';
import {UserDetailsContext} from "../../../context/UserDetails";
import Loader from "../../../components/Loader/Loader";
import CategoryService from "../../../api/CategoryService";
import { useTranslation } from 'react-i18next';
import translate from '../../../util/translate';

const AdvertisementCreate = () => {
    const { t } = useTranslation();
    const {userDetails} = useContext(UserDetailsContext);
    const lang = localStorage.getItem('language');

    const [isLoading, setIsLoading] = useState(true);

    const {category} = useParams();
    const [product, setProduct] = useState({
        name: "",
        price: 0.00,
        description: "",
        avatar: null
    });

    const [images, setImages] = useState([]);

    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        CategoryService.getCategoryAttributes(category)
            .then(async response => {
                if (lang.lang !== 'en') {
                    console.log(response)
                    const promises = response.map(async attribute => {
                        const translatedName = await translate(attribute.name, lang);

                        return {
                            id: attribute.id,
                            value: '',
                            attribute: {
                                name: translatedName,
                                name_original: attribute.name
                            }
                        };
                    });

                    const translatedAttrs = await Promise.all(promises);
                    setIsLoading(false);

                    console.log(translatedAttrs);
                    setAttributes(translatedAttrs);
                } else {
                    setAttributes(response.map(attribute => ({
                        id: attribute.id,
                        attribute: {
                            name: attribute.name,
                        },
                        value: ''
                    })));
                    setIsLoading(false);
                }
            })
    }, []);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);

        if(!product.avatar) {
            setErrors([...errors, "Image is required"]);
            return;
        }
        AdvertisementService.create(product, attributes, category, images, userDetails)
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

        const newAttributeId = attributes.length > 0 ? Math.max(...attributes.map(attr => attr.id)) + 1 : 0;

        setAttributes([...attributes, {id: newAttributeId, value: "", attribute: {name: ""}}]);
    }

    function removeAttribute(index) {
        setAttributes((prevAttributes) => {
            const updatedAttributes = [...prevAttributes];
            updatedAttributes.splice(index, 1);
            return updatedAttributes;
        });
    }

    const handleAvatarChange = (event) => {
        const selectedAvatar = event.target.files[0];
        setProduct({ ...product, avatar: selectedAvatar });
    };

    const handleAddImage = (e) => {
        e.preventDefault();
        setImages([...images, {id: images.length, image: null}]);
    }

    const handleImageChange = (e, id) => {
        e.preventDefault();
        const updatedImages = images.map(image => {
            if(image.id === id) {
                image.image = e.target.files[0];
            }
            return image;
        });
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
                <h1>{t('Create')}</h1>
                <div className={"return"}>
                    <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                    <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>
                    <p>{t('Create')}</p>
                </div>
            </div>
            <div className={styles.formCreate}>
                <div>
                    {errors.map(error =>
                        <p key={error} style={{color: "red"}}>{error}</p>
                    )}
                </div>
                <form encType={"multipart/form-data"}>
                    <p>{t('Name')}: </p>
                    <input
                        type="text"
                        value={product.name}
                        onChange={e => setProduct({...product, name: e.target.value})}
                    />

                    <p>{t('Price')}: </p>
                    <input
                        type="number"
                        value={product.price}
                        onChange={e => setProduct({...product, price: e.target.value})}
                    />

                    <p>{t('Description')}: </p>
                    <input
                        type="text"
                        value={product.description}
                        onChange={e => setProduct({...product, description: e.target.value})}
                    />

                    <p>{t('Avatar')}:</p>
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
                                    <p>{t('Attribute')}:</p>
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

                                    <button onClick={() => removeAttribute(index)}>{t('Remove')}</button>
                                </div>
                            ))
                        :
                            <p></p>
                        }
                        <button onClick={addAttribute}>{t('Add attribute')}</button>
                    </div>

                    <div>
                        <p>{t('Images')}:</p>
                        {images.length > 0 &&
                            images.map(image =>
                                <input
                                    key={image.id}
                                    type="file"
                                    name={"image" + image.id}
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={(e) => handleImageChange(e, image.id)}
                                />
                            )
                        }
                        <button onClick={handleAddImage}>{t('Add image')}</button>
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={handleSubmit}>{t('Create')}</button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default AdvertisementCreate;