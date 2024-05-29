import React, {useState} from 'react';
import Modal from 'react-modal';
import styles from './ChangeModal.module.css';
import { useTranslation } from 'react-i18next';

const ChangeModal = ({isOpen, closeModal, secondInputTitle, action}) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [secondInputValue, setSecondInputValue] = useState('');

    const handleSubmit = () => {
        typeof action === 'function' && action(password, secondInputValue);
        setPassword('');
        setSecondInputValue('');
        closeModal();
    }

    return (
        <Modal
            className={styles.changeModal}
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel={t('Change')}

        >
            <p>Enter password:</p>
            <input
                type="text"
                placeholder={t('Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <p>{t('Enter')} {secondInputTitle.toLowerCase()}:</p>
            <input
                type="text"
                placeholder={secondInputTitle}
                value={secondInputValue}
                onChange={(e) => setSecondInputValue(e.target.value)}
            />

            <button onClick={handleSubmit}>{t('Change')}</button>
        </Modal>
    );
};

export default ChangeModal;