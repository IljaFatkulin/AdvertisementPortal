import React, {useContext} from 'react';
import styles from './Navbar.module.css';
import {Link} from "react-router-dom";
import {UserDetailsContext} from "../../context/UserDetails";
import {useCookies} from "react-cookie";

const Navbar = () => {
    const [cookie, setCookie, removeCookie] = useCookies(['token']);
    const {isAuth, setIsAuth, setUserDetails} = useContext(UserDetailsContext);

    function logout() {
        removeCookie('token');
        setUserDetails({});
        setIsAuth(false);

    }

    return (
        <div className={styles.navbar}>
            <div className={styles.navbarBrand}>
                <p>Ads Marketplace</p>
            </div>
            <div className={styles.navbarMain}>
                <Link to={'/'} className={styles.link}>Home</Link>
                <Link className={styles.link}>About us</Link>
                <Link to={'/categories'} className={styles.link}>Categories</Link>
                <Link className={styles.link}>Create advertisement</Link>
            </div>
            <div className={styles.navbarRight}>
                {isAuth
                ?
                    <Link to={''}><button onClick={logout}>Profile</button></Link>
                :
                    <Link to={'/register'}><button>Sign Up</button></Link>
                }
            </div>
        </div>
    );
};

export default Navbar;