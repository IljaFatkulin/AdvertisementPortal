import React, {useContext, useState} from 'react';
import styles from './ChangePasswordModal.module.css';
import Modal from "react-modal";
import AccountService from "../../../api/AccountService";
import {useNavigate} from "react-router-dom";
import {UserDetailsContext} from "../../../context/UserDetails";
import Loader from "../../Loader/Loader";
import { useTranslation } from 'react-i18next';

const ChangePasswordModal = ({isOpen, closeModal}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const {userDetails} = useContext(UserDetailsContext);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [code, setCode] = useState('');

    const navigate = useNavigate();

    const [showCodeInput, setShowCodeInput] = useState(false);

    const [errors, setErrors] = useState([]);

    const changePasswordSubmit = () => {
        setIsLoading(true);
        AccountService.changePasswordSubmit(newPassword, code, userDetails)
            .then(response => {
                if(response.status === 200) {
                    navigate('/logout');
                }
            }).catch(error => {
                if(error.response.status === 401) {
                    setErrors([...errors, t('Incorrect code')]);
                }
            }).finally(() => {
                setIsLoading(false);
        })
    }

    const changePassword = () => {
        setIsLoading(true);
        AccountService.changePassword(oldPassword, userDetails)
            .then(response => {
                if(response.status === 200) {
                    setErrors([]);
                    setShowCodeInput(true);
                }
            }).catch(error => {
                if(error.response.status === 401) {
                    setErrors([...errors, t('Incorrect old password')]);
                }
            }).finally(() => {
                setIsLoading(false);
        });
    }

    return (
        <Modal
            className={styles.changeModal}
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel={t('Change')}

        >
            {isLoading
            ?
                <Loader/>
            :
                <div>
                    <div className={styles.errors}>
                        {errors.length > 0 && errors.map(error =>
                            <p key={error}>{error}</p>
                            )}
                    </div>
                    {showCodeInput
                        ?
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <input
                                type="text"
                                placeholder={t('Code')}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />

                            <button onClick={changePasswordSubmit}>{t('Submit')}</button>
                        </div>
                        :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <p>{t('Enter old password')}:</p>
                            <input
                                type="text"
                                placeholder={t('Old password')}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />

                            <p>{t('Enter new password')}:</p>
                            <input
                                type="text"
                                placeholder={t('New password')}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <button onClick={changePassword}>{t('Change')}</button>
                        </div>
                    }
                </div>
            }
        </Modal>
    );
};

export default ChangePasswordModal;