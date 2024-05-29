import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import AdvertisementService from "../../../api/AdvertisementService";
import Loader from "../../../components/Loader/Loader";
import NotFound from "../../NotFound/NotFound";
import Navbar from "../../../components/Navbar/Navbar";
import styles from './AdvertisementView.module.css';
import ImageConverter from "../../../components/ImageConverter/ImageConverter";
import {UserDetailsContext} from "../../../context/UserDetails";
import useAuth from "../../../hooks/useAuth";
import ImageModal from "../../../components/ImageModal/ImageModal";
import ProductViewService from '../../../api/ProductViewService';
import PDFGenerator from '../../../components/PDFGenerator/PDFGenerator';
import AccountService from '../../../api/AccountService';
import { useTranslation } from 'react-i18next';
import translate from '../../../util/translate';

const AdvertisementView = () => {
    // Get sellerId from url params
    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sellerEmail = queryParams.get('seller');


    const {isAdmin, isAuth} = useAuth();
    const {userDetails} = useContext(UserDetailsContext);

    const {category, id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisement, setAdvertisement] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [isAlreadyFavorite, setIsAlreadyFavorite] = useState(false);

    const [views, setViews] = useState(0);

    const registerView = () => {
        if (userDetails.id) {
            ProductViewService.register(userDetails.id, true, id);
        } else {
            const {
                userUniqueId
            } = window;

            ProductViewService.register(userUniqueId, false, id);
        }
    };

    useEffect(() => {
        translate('Hello, how are you?', 'fr');
    }, [])

    const fetchIsFavorite = () => {
        AccountService.isFavorite(userDetails, id)
        .then(response => {
            console.log(response.data);
            setIsAlreadyFavorite(response.data);
        }).catch(e => {
            console.log(e);
        });
    }

    useEffect(() => {
        registerView();
        ProductViewService.getAllViews(id)
            .then(r => {
                setViews(r.data);
                console.log(r.data);
            }).catch(e => {
                console.log(e);
            });

        AdvertisementService.getById(id)
            .then(async response => {
                const ads = response;
                ads.imagesBytes = response.imagesBytes.map(image => {
                    return {id: image.id, image: image.image};
                });
                console.log(ads)

                const translateAttributeName = async (name) => {
                    if (typeof name === 'string' && isNaN(name))
                        return await translate(name, localStorage.getItem('language') || 'en');
                    else
                        return name;
                };

                const formattedAttributes = ads.attributes.map(async attribute => {
                    return {
                        attribute: { id: attribute.attribute.id, name: await translateAttributeName(attribute.attribute.name) },
                        value: await translateAttributeName(attribute.value),
                    };
                });

                ads.attributes = await Promise.all(formattedAttributes);
                setAdvertisement(ads);

                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                setError(e.response.data);
            });

        if (isAuth) {
            fetchIsFavorite();
        }
    }, []);

    function deleteAdvertisement(id) {
        AdvertisementService.deleteById(id, userDetails)
            .then(() => {
                navigate("/advertisements/" + category);
            });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const increaseImage = (id) => {
        const targetImage = advertisement.imagesBytes.find(image => image.id === id);
        if(targetImage) {
            setSelectedImage(targetImage.image);
            setIsModalOpen(true);
        }
    }

    const handleAddFavorite = () => {
        AccountService.addFavorite(userDetails, id)
            .then((r) => {
                fetchIsFavorite();
                console.log(r)
            }).catch(e => {
                console.log(e);
            });
    }

    const handleDeleteFromFavorite = () => {
        AccountService.deleteFavorite(userDetails, id)
            .then((r) => {
                fetchIsFavorite();
                console.log(r)
            }).catch(e => {
                console.log(e);
            });
    }

    return (
        isLoading
        ?
            <Loader/>
        :
            error
            ?
                <NotFound error={error}/>
            :
                <div className={"container"}>
                    <div className={"header"}>
                        <Navbar/>
                        <h1>{t('Details')}</h1>
                        <div className={"return"}>
                            {sellerEmail
                                ?
                                <Link to={'/profile'} id={"return"}><p className={"return-link"}>{sellerEmail}</p></Link>
                                :
                                <div style={{ display: 'flex' }}>
                                    <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                                    {category !== 'undefined' && <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>}
                                </div>
                            }
                            <p>{t('Details')}</p>
                        </div>
                    </div>
                    <div className={styles.advertisement}>
                        <div>
                            {isAuth && (
                                isAlreadyFavorite ? (
                                    <button style={{backgroundColor: "#ff5328"}} onClick={handleDeleteFromFavorite}>{t('Remove from favorite')}</button>
                                ) : (
                                    <button style={{backgroundColor: "#DD9901"}} onClick={handleAddFavorite}>{t('Save to favorite')}</button>
                                )
                            )}
                        </div>
                        {(isAdmin() || (advertisement.seller && advertisement.seller.id === userDetails.id)) &&
                            <div className={styles.adminButtons}>
                                <Link to={'/advertisements/' + category + '/' + id + '/edit'}><button><p>{t('Edit')}</p></button></Link>
                                <button onClick={() => deleteAdvertisement(id)}><p>{t('Delete')}</p></button>
                            </div>
                        }
                        <div className={styles.advertisementMain}>
                            <div className={styles.advertisementImgContainer}>
                                {advertisement.avatar
                                ?
                                    <ImageConverter className={styles.advertisementImg} data={advertisement.avatar}/>
                                :
                                    <p>{t('No image')}</p>
                                }
                            </div>
                            <div className={styles.advertisementMainInfo}>
                                <p className={"name"}>{advertisement.name}</p>
                                <p className={"price"}>€{advertisement.price}</p>
                                <p className={"description"}>{advertisement.description}</p>
                                <p className={"seller"}>{t('Seller')}: {advertisement.seller && <Link to={'/profile/' + advertisement.seller.email}>{advertisement.seller.email}</Link>}</p>
                                <p>{t('Posted at')}: {new Date(advertisement.createdAt).toLocaleDateString()}</p>
                                {(sellerEmail === userDetails.email || isAdmin())&& <p>{t('Views')}: {views}</p>}
                                {/* {(sellerEmail === userDetails.email || isAdmin())&& <Link to={'/statistics/' + category + '/' + id}>Open statistics</Link>} */}
                                {(sellerEmail === userDetails.email || isAdmin())&& <button onClick={() => setIsDetailsOpen(true)}>{t('Open statistics')}</button>}
                            </div>
                        </div>
                        {advertisement.attributes.length
                        ?
                            <div className={styles.advertisementAttributes}>
                                <table>
                                    <tbody>
                                        {advertisement.attributes.map(attribute =>
                                            <tr key={attribute.attribute.id}>
                                                <td className={styles.tdName}>{attribute.attribute.name}:</td><td>{attribute.value}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        :
                            <p></p>
                        }
                        {advertisement.imagesBytes.length > 0 &&
                            <div className={styles.images}>
                                {advertisement.imagesBytes.map(image =>
                                    <div key={image.id} className={styles.imageContainer} onClick={() => increaseImage(image.id)}>
                                        <ImageConverter className={styles.advertisementImg} data={image.image}/>
                                    </div>
                                )}
                            </div>
                        }
                    </div>

                    <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} image={selectedImage}/>
                    <PDFGenerator isOpen={isDetailsOpen} closeModal={() => setIsDetailsOpen(false)}/>
                </div>
    );
};

export default AdvertisementView;