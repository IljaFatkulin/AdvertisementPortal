import React, {useContext, useEffect, useState} from 'react';
import Loader from "../../components/Loader/Loader";
// import NotFound from "../NotFound/NotFound";
import Navbar from "../../components/Navbar/Navbar";
import {UserDetailsContext} from "../../context/UserDetails";
import styles from './Profile.module.css';
import ChangeModal from "../../components/ChangeModal/ChangeModal";
import AccountService from "../../api/AccountService";
import {useNavigate} from "react-router-dom";
import AdvertisementService from "../../api/AdvertisementService";
import AdvertisementCard from "../../components/AdvertisementCard/AdvertisementCard";

const Profile = () => {
    const navigate = useNavigate();

    const [isLoading] = useState(false);
    const {userDetails} = useContext(UserDetailsContext);

    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        AdvertisementService.getUserAdvertisements(userDetails.email)
            .then(response => {
                console.log(response)
                setAdvertisements(response);
            });
    }, []);

    // For modal to change password
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [secondInputTitle, setSecondInputTitle] = useState('');
    const [action, setAction] = useState(undefined);

    const openModal = (title, act) => {
        setSecondInputTitle(title);
        setIsModalOpen(true);
        setAction(() => act);
    };

    const changePassword = (oldPassword, newPassword) => {
        AccountService.changePassword(oldPassword, newPassword, userDetails)
            .then(response => {
                console.log(response.data);
                navigate('/logout');
            }).catch(error => {
                console.error(error);
        })
    }

    const changeEmail = (password, newEmail) => {
        AccountService.changeEmail(password, newEmail, userDetails)
            .then(response => {
                console.log(response.data);
                navigate('/logout');
            }).catch(error => {
                console.error(error);
        })
    }

    const closeModal = () => {
        setIsModalOpen(false);
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
                        <h1>Profile</h1>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.userDetails}>
                            <div>
                                <p>Email: {userDetails.email}</p><button onClick={() => openModal('Email', changeEmail)} className={styles.change}>Change</button>
                            </div>
                            <div>
                                <p>Password: ●●●●●</p><button onClick={() => openModal('New password', changePassword)} className={styles.change}>Change</button>
                            </div>
                            <ChangeModal isOpen={isModalOpen} closeModal={closeModal} secondInputTitle={secondInputTitle} action={action}/>
                        </div>
                        <div className={styles.advertisements}>
                            {advertisements.length
                                ?
                                advertisements.map(advertisement =>
                                    <AdvertisementCard
                                        advertisement={advertisement}
                                        category={advertisement.category.name}
                                        key={advertisement.id}
                                    />
                                )
                                :
                                <p>Advertisements not found</p>
                            }
                        </div>
                    </div>
                </div>
    );
};

export default Profile;