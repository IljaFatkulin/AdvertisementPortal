import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import jsPDF from 'jspdf';
import ProductViewService from '../../api/ProductViewService';
import AdvertisementService from "../../api/AdvertisementService";
import 'jspdf-autotable';
import Modal from "react-modal";
import Loader from '../Loader/Loader';
import styles2 from './../Modals/ChangePasswordModal/ChangePasswordModal.module.css';
import styles from './../ImageModal/ImageModal.module.css';
import { useTranslation } from 'react-i18next';
import PDFStats from '../PDFStats/PDFStats';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import translate from '../../util/translate';

const PDFGenerator = ({isOpen, closeModal}) => {
    const { t } = useTranslation();
    const {category, id} = useParams();
    const [advertisement, setAdvertisement] = useState({});
    const [views, setViews] = useState(0);
    const [authViews, setAuthViews] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        ProductViewService.getFavoriteCount(id)
            .then(r => {
                setFavoriteCount(r.data);
                console.log(r.data);
            }).catch(e => {
                console.log(e);
            });

        ProductViewService.getAllViews(id)
            .then(r => {
                setViews(r.data);
                console.log(r.data);
            }).catch(e => {
                console.log(e);
            });

        ProductViewService.getAuthorizedViews(id)
        .then(r => {
            setAuthViews(r.data);
            console.log(r.data);
        }).catch(e => {
           console.log(e);
        });

        AdvertisementService.getById(id)
            .then(response => {
                const ads = response;
                ads.imagesBytes = response.imagesBytes.map(image => {
                    return {id: image.id, image: image.image};
                });
                console.log(ads);
                setAdvertisement(ads);
                setIsLoading(false);
            })
            .catch(e => {
                console.log(e.response.data);
            });
    }, []);

    const generatePDF = async () => {
        const translatedDescription = await translate(advertisement.description, localStorage.getItem('language'));
        const blob = await pdf(<PDFStats favoriteCount={favoriteCount} name={advertisement.name} price={advertisement.price} description={translatedDescription} seller={advertisement.seller.email} createdAt={new Date(advertisement.createdAt).toLocaleDateString()} totalViews={views} authorized={authViews} guest={views - authViews} />).toBlob();
        saveAs(blob, 'document.pdf');
    };

    const handleBackgroundClick = e => {
        // Ensure that only clicks on the modal background will close the modal
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    if (!isOpen) return null;

    if(isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <div className={styles.modal} onClick={handleBackgroundClick    }>
        {/* <Modal
            className={styles.changeModal}
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Details"
        > */}
    {/* <div className={styles.modalContent}> */}
    <div className={styles2.changeModal}>
        {/* <Link to={`/advertisements/${category}/${id}`}><button>Back</button></Link> */}
        {/* <br /> */}
        <button style={{height: '80px', background: "#DD9901"}} onClick={closeModal}>{t('Close')}</button>
        <table id="my-table">
        <tbody>
            <tr>
                <td>{t('Name')}</td>
                <td>{advertisement.name}</td>
            </tr>
            <tr>
                <td>{t('Price')}</td>
                <td>€{advertisement.price}</td>
            </tr>
            <tr>
                <td>{t('Description')}</td>
                <td>{advertisement.description}</td>
            </tr>
            <tr>
                <td>{t('Seller')}</td>
                <td>{advertisement.seller.email}</td>
            </tr>
            <tr>
                <td>{t('Created at')}</td>
                <td>{new Date(advertisement.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
                <td>{t('Total views')}:</td>
                <td>{views}</td>
            </tr>
            <tr>
                <td>{t('Authorized users views')}:</td>
                <td>{authViews}</td>
            </tr>
            <tr>
                <td>{t('Guests views')}:</td>
                <td>{views - authViews}</td>
            </tr>
            <tr>
                <td>{t('Users count saved ads to favorite')}:</td>
                <td>{favoriteCount}</td>
            </tr>
        </tbody>
        </table>
        <button style={{height: '80px'}} onClick={generatePDF}>{t('Download PDF')}</button>

    </div>
    {/* </Modal> */}
    </div>
    );
};

export default PDFGenerator;
