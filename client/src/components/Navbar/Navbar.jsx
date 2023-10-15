import React from 'react';
import styles from './Navbar.module.css';
import {Link} from "react-router-dom";

const Navbar = () => {
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
                <button>Sign Up</button>
            </div>
        </div>
    );
};

export default Navbar;