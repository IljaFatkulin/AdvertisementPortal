import React from 'react';
// import './Loader.css';
import styles from './Loader.module.css';

const Loader = ({ size = 150 }) => {
    const loaderStyle = {
        width: size,
        height: size,
    };

    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loader} style={loaderStyle}></div>
        </div>
    );
};

export default Loader;