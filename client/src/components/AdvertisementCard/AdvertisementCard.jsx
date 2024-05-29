import React from 'react';
import styles from './AdvertisementCard.module.css';
import ImageConverter from "../ImageConverter/ImageConverter";
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AdvertisementCard = ({advertisement, category, sellerEmail, viewType, showViews}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const view = (id) => {
        if(sellerEmail) {
            navigate('/advertisements/' + category + '/' + id + '?seller=' + sellerEmail);
        } else {
            navigate('/advertisements/' + category + '/' + id);
        }
    }

    return (
        <div className={viewType === 'table' ? styles.itemTable : styles.item} onClick={() => view(advertisement.id)}>
            <div className={styles.itemImageContainer}>
                {advertisement.avatar
                    ?
                    <ImageConverter className={styles.itemImage} data={advertisement.avatar} />
                    :
                    <p>{t('No image')}</p>
                }
            </div>
            <div className={styles.itemInfo}>
                <p className={styles.name}>{advertisement.name}</p>
                <p className={styles.price}>€{advertisement.price}</p>
                {viewType === 'table' && <p className={styles.views}>{t('Posted at')}: {new Date(advertisement.createdAt).toLocaleDateString()}</p>}
                {showViews && <p className={styles.views}>{t('Views')}: {advertisement.viewCount}</p>}
            </div>
        </div>
    );
};

export default AdvertisementCard;