import React, {useEffect} from 'react';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, onClose, image }) => {
    const handleBackgroundClick = e => {
        // Ensure that only clicks on the modal background will close the modal
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={handleBackgroundClick    }>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose} style={{backgroundColor:"indianred", width: "20px", height: "25px", textAlign: "center"}}>&times;</span>
                {/*<ImageConverter src={image} />*/}
                <img src={`data:image/png;base64,${image}`} alt="Enlarged" />
            </div>
        </div>
    );
};

export default ImageModal;