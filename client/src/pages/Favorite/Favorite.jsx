import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {Link, useParams} from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import {UserDetailsContext} from "../../context/UserDetails";
import {useContext} from "react";
import AdvertisementService from "../../api/AdvertisementService";
import styles from './Favorite.module.css';
import AdvertisementCard from "../../components/AdvertisementCard/AdvertisementCard";
import { useTranslation } from 'react-i18next';

const ViewType = {
    CARD: 'card',
    TABLE: 'table',
};

const Favorite = () => {
    const { t } = useTranslation();
    const [advertisements, setAdvertisements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {userDetails} = useContext(UserDetailsContext);
    const [viewType, setViewType] = useState(ViewType.CARD);


    useEffect(() => {
        AdvertisementService.getFavorites(userDetails)
            .then(r => {
                setAdvertisements(r.data);
                setIsLoading(false);
                console.log(r.data);
            }).catch(e => {
                console.log(e);
            })
    }, []);

    return (
        isLoading
        ?
            <Loader/>
        :
            <div className={"container"}>
                <div className={"header"}>
                    <Navbar/>
                    <h1>{t('Favorite')}</h1>
                    <div className={"return"}>
                        <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                        <p>{t('Favorite')}</p>
                    </div>
                </div>

                <div className={viewType === ViewType.CARD ? styles.products : styles.productsTable}>
                {/* <div className={styles.products}> */}
                    {advertisements.length
                    ?
                        advertisements.map(advertisement =>
                            <AdvertisementCard
                                key={advertisement.id}
                                advertisement={advertisement}
                            />
                        )
                    :
                        <p>{t('Advertisements not found')}</p>
                    }
                </div>
            </div>
    );
};

export default Favorite;