import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Loader from '../Loader/Loader';
import Modal from 'react-modal';
import styles from './../ChangeModal/ChangeModal.module.css';
import ProductViewService from '../../api/ProductViewService';
import {useContext} from "react";
import {UserDetailsContext} from "../../context/UserDetails";
import { saveAs } from 'file-saver';
import ProfilePDF from './ProfilePDF';
import { pdf } from '@react-pdf/renderer';
import translate from '../../util/translate';

const CategoryStats = ({isOpen, closeModal, category}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const {userDetails} = useContext(UserDetailsContext);

    useEffect(() => {
        ProductViewService.getCategoryStats(category)
            .then(response => {
                console.log(response.data)
                setData(response.data)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    const generatePDF = async () => {
        const translatedCategory = await translate(category, localStorage.getItem('language') || 'en');

        const blob = await pdf(<ProfilePDF data={data} title={translatedCategory} type='category' />).toBlob();
        saveAs(blob, `${category.replace(" ", "_")}_stats.pdf`);
    };


    if (!isOpen) return null;

    const renderContent = () => {
        if(isLoading) {
            return (
                <Loader />
            )
        }

        return (
            <div style={{fontSize: 20}}>
                <h2>{t('Category statistics')}</h2>
                <p>{t('Active advertisements')}: <b>{data.activeAds}</b></p>
                <p>{t('Total views')}: <b>{data.viewCount}</b></p>
                <p>{t('Authorized users views')}: <b>{data.authViewCount}</b></p>
                <p>{t('Guests views')}: <b>{data.viewCount - data.authViewCount}</b></p>
                <p>{t('Users count saved ads to favorite')}: <b>{data.favoriteCount}</b></p>
                <p>{t('Views in last month')}: <b>{data.viewCountLastMonth}</b></p>
                <p>{t('Authorized views in last month')}: <b>{data.authViewCountLastMonth}</b></p>
                <p>{t('Guests views in last month')}: <b>{data.viewCountLastMonth - data.authViewCountLastMonth}</b></p>

                <button style={{paddingInline: "20px", height: "40px"}} onClick={generatePDF}>{t('Download PDF')}</button>
            </div>
        );
    }

    return (
        <Modal
            className={styles.changeModal2}
            style={{ height: '100px'}}
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel={t('Change')}
        >
            { renderContent() }
        </Modal>
    );
};

export default CategoryStats;
