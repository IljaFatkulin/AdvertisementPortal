import React, {useContext, useEffect, useState} from 'react';
import AdvertisementService from "../../../api/AdvertisementService";
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import Navbar from "../../../components/Navbar/Navbar";
import styles from '../AdvertisementCreate/AdvertisementCreate.module.css';
import {UserDetailsContext} from "../../../context/UserDetails";
import ImageConverter from "../../../components/ImageConverter/ImageConverter";
import { useTranslation } from 'react-i18next';
import translate from '../../../util/translate';

const AdvertisementEdit = () => {
    const { t } = useTranslation();
    const {userDetails} = useContext(UserDetailsContext);
    const lang = localStorage.getItem('language');

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
            .then(async response => {
                if (lang.lang !== 'en') {
                    const promises = response.attributes.map(async (attribute, index) => {
                        const translatedValue = await translate(attribute.value, lang);
                        const translatedName = await translate(attribute.attribute.name, lang);

                        return {
                            id: index,
                            value: translatedValue,
                            value_original: attribute.value,
                            attribute: {
                                name: translatedName,
                                name_original: attribute.attribute.name
                            }
                        };
                    });

                    const translatedAttrs = await Promise.all(promises);
                    setAttributes(translatedAttrs);
                } else {
                    let attrs = [];
                    response.attributes.forEach(attribute => {
                        attrs = [...attrs, {id: attrs.length, value: attribute.value, attribute: {name: attribute.attribute.name}}];
                    });
                    setAttributes(attrs);
                }

                delete response.avatar;

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

    async function handleSubmit(e) {
        e.preventDefault();

        const promises = attributes.map(async attribute => {
            const attributeValue = attribute.value === attribute.value_original ? attribute.value : await translate(attribute.value, 'en');

            console.log(attribute)

            return {
                ...attribute,
                value: attributeValue,
                attribute: {
                    ...attribute.attribute,
                    name: await translate(attribute.attribute.name, 'en'),
                },
            }
        });

        const updatedAttributes = lang !== 'en' ? await Promise.all(promises) : attributes;
        console.log(updatedAttributes)
        AdvertisementService.edit(product, updatedAttributes, id, editedImages, newImages, imagesToDelete, userDetails)
            .then(response => {
                if(response.data === 'OK') {
                    navigate('/advertisements/' + category + '/' + id);
                }
            }).catch(err => {
                console.log(err)
            })
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

            console.log({updatedAttributes})

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
                <h1>{t('Edit')}</h1>
                <div className={"return"}>
                    <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                    <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>
                    <Link to={'/advertisements/' + category + '/' + id} id={"return"}><p className={"return-link"}>{t('Details')}</p></Link>
                    <p>{t('Edit')}</p>
                </div>
            </div>
            <div className={styles.formCreate}>
                <form>
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
                                        placeholder={t('Name')}
                                        type="text"
                                        name="name"
                                        value={attribute.attribute.name}
                                        onChange={(e) => handleAttributeChange(e, index)}
                                    />

                                    <input
                                        placeholder={t('Value')}
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
                        <p>{t('Images')}:</p>
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
                        <button onClick={handleAddImage}>{t('Add image')}</button>
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={addAttribute}>{t('Add attribute')}</button>
                        <button onClick={handleSubmit} className={styles.save}>{t('Save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdvertisementEdit;