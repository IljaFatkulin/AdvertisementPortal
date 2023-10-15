import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import AdvertisementService from "../../../api/AdvertisementService";
import Loader from "../../../components/Loader/Loader";
import NotFound from "../../NotFound/NotFound";
import Navbar from "../../../components/Navbar/Navbar";
import styles from './AdvertisementView.module.css';
import ImageConverter from "../../../components/ImageConverter/ImageConverter";

const AdvertisementView = () => {
    const {category, id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisement, setAdvertisement] = useState();
    const navigate = useNavigate();
    const [error, setError] = useState();

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        AdvertisementService.getById(id)
            .then(response => {
                setAdvertisement(response);
                setImageUrl(`data:image/png;base64, ${response.avatar}`);

                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                setError(e.response.data);
            })
    }, []);

    function deleteAdvertisement(id) {
        AdvertisementService.deleteById(id)
            .then(response => {
                navigate("/advertisements/" + category);
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
                        <h1>Details</h1>
                        <div className={"return"}>
                            <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                            <Link to={'/advertisements/' + category} id={"return"}><p className={"return-link"}>{category}</p></Link>
                            <p>Details</p>
                        </div>
                    </div>
                    <div className={styles.advertisement}>
                        <div className={styles.adminButtons}>
                            <Link to={'/advertisements/' + category + '/' + id + '/edit'}><button><p>Edit</p></button></Link>
                            <button onClick={() => deleteAdvertisement(id)}><p>Delete</p></button>
                        </div>
                        <div className={styles.advertisementMain}>
                            <div className={styles.advertisementImgContainer}>
                                {/*style={{ backgroundImage: `url("${imageUrl}")` }}*/}
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
                    </div>
                </div>
    );
};

export default AdvertisementView;