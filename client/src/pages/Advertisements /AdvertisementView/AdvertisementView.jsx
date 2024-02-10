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

const AdvertisementView = () => {
    // Get sellerId from url params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sellerEmail = queryParams.get('seller');


    const {isAdmin} = useAuth();
    const {userDetails} = useContext(UserDetailsContext);

    const {category, id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisement, setAdvertisement] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState();

    useEffect(() => {
        AdvertisementService.getById(id)
            .then(response => {
                const ads = response;
                ads.imagesBytes = response.imagesBytes.map(image => {
                    return {id: image.id, image: image.image};
                });

                setAdvertisement(ads);

                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                setError(e.response.data);
            })
    }, []);

    function deleteAdvertisement(id) {
        AdvertisementService.deleteById(id, userDetails)
            .then(() => {
                navigate("/advertisements/" + category);
            });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const increaseImage = (id) => {
        const targetImage = advertisement.imagesBytes.find(image => image.id === id);
        if(targetImage) {
            setSelectedImage(targetImage.image);
            setIsModalOpen(true);
        }
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
                        <h1>Details</h1>
                        <div className={"return"}>
                            {sellerEmail
                                ?
                                <Link to={'/profile'} id={"return"}><p className={"return-link"}>{sellerEmail}</p></Link>
                                :
                                <div style={{ display: 'flex' }}>
                                    <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                                    <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>
                                </div>
                            }
                            <p>Details</p>
                        </div>
                    </div>
                    <div className={styles.advertisement}>
                        {(isAdmin() || (advertisement.seller && advertisement.seller.id === userDetails.id)) &&
                            <div className={styles.adminButtons}>
                                <Link to={'/advertisements/' + category + '/' + id + '/edit'}><button><p>Edit</p></button></Link>
                                <button onClick={() => deleteAdvertisement(id)}><p>Delete</p></button>
                            </div>
                        }
                        <div className={styles.advertisementMain}>
                            <div className={styles.advertisementImgContainer}>
                                {advertisement.avatar
                                ?
                                    <ImageConverter className={styles.advertisementImg} data={advertisement.avatar}/>
                                :
                                    <p>No image</p>
                                }
                            </div>
                            <div className={styles.advertisementMainInfo}>
                                <p className={"name"}>{advertisement.name}</p>
                                <p className={"price"}>€{advertisement.price}</p>
                                <p className={"description"}>{advertisement.description}</p>
                                <p className={"seller"}>Seller: {advertisement.seller && <Link to={'/profile/' + advertisement.seller.email}>{advertisement.seller.email}</Link>}</p>
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
                </div>
    );
};

export default AdvertisementView;