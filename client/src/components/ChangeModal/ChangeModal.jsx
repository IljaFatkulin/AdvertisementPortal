import React, {useState} from 'react';
import Modal from 'react-modal';
import styles from './ChangeModal.module.css';

const ChangeModal = ({isOpen, closeModal, secondInputTitle, action}) => {
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
            contentLabel="Change"

        >
            <p>Enter password:</p>
            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <p>Enter {secondInputTitle.toLowerCase()}:</p>
            <input
                type="text"
                placeholder={secondInputTitle}
                value={secondInputValue}
                onChange={(e) => setSecondInputValue(e.target.value)}
            />

            <button onClick={handleSubmit}>Change</button>
        </Modal>
    );
};

export default ChangeModal;