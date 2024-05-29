import React, {useContext, useEffect, useState} from 'react';
import Loader from "../../components/Loader/Loader";
import Navbar from "../../components/Navbar/Navbar";
import {UserDetailsContext} from "../../context/UserDetails";
import styles from './Profile.module.css';
import ChangeModal from "../../components/ChangeModal/ChangeModal";
import AccountService from "../../api/AccountService";
import {useNavigate, useParams} from "react-router-dom";
import AdvertisementService from "../../api/AdvertisementService";
import AdvertisementCard from "../../components/AdvertisementCard/AdvertisementCard";
import ChangePasswordModal from "../../components/Modals/ChangePasswordModal/ChangePasswordModal";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from 'react-i18next';
import ProfileStats from '../../components/ProfileStats/ProfileStats';

const Profile = () => {
    const { t } = useTranslation();
    const {email} = useParams();

    const navigate = useNavigate();
    const {isAdmin} = useAuth();

    const [isLoading] = useState(false);
    const {userDetails} = useContext(UserDetailsContext);
    const [currentProfileEmail, setCurrentProfileEmail] = useState(email ? email : userDetails.email);

    const [advertisements, setAdvertisements] = useState([]);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    useEffect(() => {
        AdvertisementService.getUserAdvertisements(currentProfileEmail)
            .then(response => {
                setAdvertisements(response);
            });
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [secondInputTitle, setSecondInputTitle] = useState('');
    const [action, setAction] = useState(undefined);

    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
    }

    const openStats = () => {
        setIsStatsOpen(true);
    }

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeStats = () => {
        setIsStatsOpen(false);
    };

    return (
        isLoading
            ?
            <Loader/>
            :
            // error
            //     ?
                // <NotFound error={error}/>
                // :
                <div className={"container"}>
                    <div className={"header"}>
                        <Navbar/>
                        <h1>{t('Profile')}</h1>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.userDetails}>
                            <div>
                                <p>{t('Email')}: {currentProfileEmail}</p>
                            </div>
                            {!email &&
                                <>
                                    <div>
                                        <p>{t('Password')}: ●●●●●</p><button onClick={openPasswordModal} className={styles.change}>{t('Change')}</button>
                                    </div>
                                    <div>
                                        <button onClick={openStats}>{t('Profile Stats')}</button>
                                    </div>
                                </>
                            }
                            <ChangeModal isOpen={isModalOpen} closeModal={closeModal} secondInputTitle={secondInputTitle} action={action}/>
                            <ChangePasswordModal isOpen={isPasswordModalOpen} closeModal={closePasswordModal}/>
                            <ProfileStats isOpen={isStatsOpen} closeModal={closeStats} />
                        </div>
                        <div className={styles.advertisements}>
                            {advertisements.length
                                ?
                                advertisements.map(advertisement =>
                                    <AdvertisementCard
                                        advertisement={advertisement}
                                        category={advertisement.category.name}
                                        sellerEmail={currentProfileEmail}
                                        key={advertisement.id}
                                        viewType={'table'}
                                        showViews={!email || isAdmin()}
                                    />
                                )
                                :
                                <p>{t('Advertisements not found')}</p>
                            }
                        </div>
                    </div>
                </div>
    );
};

export default Profile;