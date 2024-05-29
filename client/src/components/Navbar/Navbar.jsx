import React, {useContext, useEffect, useState} from 'react';
import styles from './Navbar.module.css';
import {Link} from "react-router-dom";
import {UserDetailsContext} from "../../context/UserDetails";
import { useTranslation } from 'react-i18next';
import useAuth from "../../hooks/useAuth";
import AdminUsers from '../AdminUsers/AdminUsers';

const Navbar = () => {
    const {isAuth} = useContext(UserDetailsContext);
    const {isAdmin} = useAuth();
    const { i18n, t } = useTranslation();
    const [lang, setLang] = useState(localStorage.getItem('language') || 'en');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLanguageChange = (language) => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
        setLang(language);
        window.location.reload();
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className={styles.navbar}>
            <AdminUsers isOpen={isModalOpen} closeModal={closeModal} />
            <div className={styles.navbarBrand}>
                <p>Ads Marketplace</p>
            </div>
            <div className={styles.navbarMain}>
                {/* <Link to={'/'} className={styles.link}>Home</Link> */}
                <Link to={'/'} className={styles.link}>{t('Categories')}</Link>
                <Link className={styles.link}>{t('About us')}</Link>
                {isAuth && <Link to={'/favorite'} className={styles.link}>{t('Favorite')}</Link>}
                <Link to={'/choose'} className={styles.link}>{t('Create advertisement')}</Link>
            </div>
            <div className={styles.navbarRight}>
                {isAdmin() && (
                    <button onClick={openModal} style={{backgroundColor: "#e69b00", marginTop: "6px"}}>{t('Users')}</button>
                )}

                <select
                    className={styles.selectLang}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    value={lang}
                >
                    <option value="en">EN</option>
                    <option value="lv">LV</option>
                </select>
                {isAuth
                ?
                    <>
                        <Link to={'/profile'}><button>{t('Profile')}</button></Link>
                        <Link to={'/logout'}><button>{t('Log out')}</button></Link>
                    </>
                :
                    <Link to={'/register'}><button style={{ width: "150px"}}>{t('Sign Up')}</button></Link>
                }
            </div>
        </div>
    );
};

export default Navbar;