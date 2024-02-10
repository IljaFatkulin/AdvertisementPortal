import React from 'react';
import styles from './AdvertisementCard.module.css';
import ImageConverter from "../ImageConverter/ImageConverter";
import {useNavigate} from "react-router-dom";

const AdvertisementCard = ({advertisement, category, sellerEmail}) => {
    const navigate = useNavigate();

    const view = (id) => {
        if(sellerEmail) {
            navigate('/advertisements/' + category + '/' + id + '?seller=' + sellerEmail);
        } else {
            navigate('/advertisements/' + category + '/' + id);
        }
    }

    return (
        <div className={styles.item} onClick={() => view(advertisement.id)}>
            <div className={styles.itemImageContainer}>
                {advertisement.avatar
                    ?
                    <ImageConverter className={styles.itemImage} data={advertisement.avatar} />
                    :
                    <p>No image</p>
                }
                {/*<img style={{maxWidth: '100%', maxHeight: '300px', objectFit: "contain"}} src={img} alt="1"/>*/}
            </div>
            <div className={styles.itemInfo}>
                <p className={styles.name}>{advertisement.name}</p>
                <p className={styles.price}>€{advertisement.price}</p>
            </div>
        </div>
    );
};

export default AdvertisementCard;