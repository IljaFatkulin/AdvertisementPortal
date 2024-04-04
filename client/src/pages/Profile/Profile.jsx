import React, {useContext, useEffect, useState} from 'react';
import Loader from "../../components/Loader/Loader";
// import NotFound from "../NotFound/NotFound";
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

const Profile = () => {
    const {email} = useParams();

    const navigate = useNavigate();
    const {isAdmin} = useAuth();

    const [isLoading] = useState(false);
    const {userDetails} = useContext(UserDetailsContext);
    const [currentProfileEmail, setCurrentProfileEmail] = useState(email ? email : userDetails.email);

    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        AdvertisementService.getUserAdvertisements(currentProfileEmail)
            .then(response => {
                setAdvertisements(response);
            });
    }, []);

    // For modal to change password
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [secondInputTitle, setSecondInputTitle] = useState('');
    const [action, setAction] = useState(undefined);

    // const openModal = (title, act) => {
    //     setSecondInputTitle(title);
    //     setIsModalOpen(true);
    //     setAction(() => act);
    // };

    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
    }

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    }

    // const changeEmail = (password, newEmail) => {
    //     AccountService.changeEmail(password, newEmail, userDetails)
    //         .then(response => {
    //             console.log(response.data);
    //             navigate('/logout');
    //         }).catch(error => {
    //             console.error(error);
    //     })
    // }

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
                                <p>Email: {currentProfileEmail}</p>
                                {/*{!email &&*/}
                                {/*    <button onClick={() => openModal('Email', changeEmail)} className={styles.change}>Change</button>*/}
                                {/*}*/}
                            </div>
                            {!email &&
                                <div>
                                    {/*<p>Password: ●●●●●</p><button onClick={() => openModal('New password', changePassword)} className={styles.change}>Change</button>*/}
                                    <p>Password: ●●●●●</p><button onClick={openPasswordModal} className={styles.change}>Change</button>
                                </div>
                            }
                            <ChangeModal isOpen={isModalOpen} closeModal={closeModal} secondInputTitle={secondInputTitle} action={action}/>
                            <ChangePasswordModal isOpen={isPasswordModalOpen} closeModal={closePasswordModal}/>
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
                                <p>Advertisements not found</p>
                            }
                        </div>
                    </div>
                </div>
    );
};

export default Profile;