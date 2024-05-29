import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader/Loader';
import Modal from 'react-modal';
import styles from './../ChangeModal/ChangeModal.module.css';
import ProductViewService from '../../api/ProductViewService';
import { saveAs } from 'file-saver';
import ProfilePDF from './ProfilePDF';
import { pdf } from '@react-pdf/renderer';
import translate from '../../util/translate';

const SectionStats = ({isOpen, closeModal, section}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        ProductViewService.getSectionStats(section)
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
        const translatedSection = await translate(section, localStorage.getItem('language') || 'en');
        const blob = await pdf(<ProfilePDF data={data} title={translatedSection} type='section' />).toBlob();
        saveAs(blob, 'document.pdf');
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
                <h2>{t('Section statistics')}</h2>
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

export default SectionStats;
