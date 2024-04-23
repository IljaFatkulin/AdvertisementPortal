import React, {useContext} from 'react';
import styles from './Navbar.module.css';
import {Link} from "react-router-dom";
import {UserDetailsContext} from "../../context/UserDetails";

const Navbar = () => {
    const {isAuth, setIsAuth, setUserDetails} = useContext(UserDetailsContext);

    return (
        <div className={styles.navbar}>
            <div className={styles.navbarBrand}>
                <p>Ads Marketplace</p>
            </div>
            <div className={styles.navbarMain}>
                {/* <Link to={'/'} className={styles.link}>Home</Link> */}
                <Link to={'/'} className={styles.link}>Categories</Link>
                <Link className={styles.link}>About us</Link>
                {isAuth && <Link to={'/favorite'} className={styles.link}>Favorite</Link>}
                <Link to={'/choose'} className={styles.link}>Create advertisement</Link>
            </div>
            <div className={styles.navbarRight}>
                {isAuth
                ?
                    <div>
                        <Link to={'/profile'}><button>Profile</button></Link>
                        <Link to={'/logout'}><button>Log out</button></Link>
                    </div>
                :
                    <Link to={'/register'}><button>Sign Up</button></Link>
                }
            </div>
        </div>
    );
};

export default Navbar;