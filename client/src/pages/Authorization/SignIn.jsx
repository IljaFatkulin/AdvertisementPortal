import React, {useContext, useState} from 'react';
import styles from './Authorization.module.css';
import {Link, useNavigate} from "react-router-dom";
import AccountService from "../../api/AccountService";
import {UserDetailsContext} from "../../context/UserDetails";
import { useTranslation } from 'react-i18next';
import translate from '../../util/translate';

const SignIn = () => {
    const { t } = useTranslation();
    const {setUserDetails, setIsAuth} = useContext(UserDetailsContext);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const lang = localStorage.getItem("language");

    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        errors.length = 0;

        if(!validate()) {
            AccountService.authenticate(form)
                .then(response => {
                    if(response.status === 200) {
                        setUserDetails({
                            id: response.data.account.id,
                            email: form.email,
                            token: response.data.token,
                            roles: response.data.account.roles.map((role) => role.name)
                        });

                        localStorage.setItem("token", response.data.token);

                        setIsAuth(true);

                        navigate('/');
                    }
                }).catch(async error => {
                    if(error.response && error.response.status === 401) {
                        if (lang === "en") {
                            setErrors([...errors, error.response.data]);
                            return
                        }

                        const errMsg = await translate(error.response.data, lang);
                        setErrors([...errors, errMsg]);
                    }
            })
        }
    }

    const validate = () => {
        let hasErrors = false;
        if(form.email.length < 1) {
            setErrors([...errors, t("Email is required")]);
            hasErrors = true;
        }
        if(form.password.length < 1) {
            setErrors([...errors, t("Password is required")]);
            hasErrors = true;
        }
        return hasErrors;
    }

    return (
        <div className={styles.container}>
            <Link to={"/"}><button style={{width: "150px"}} className={styles.formSignUp_button}>{t('Home')}</button></Link>
            <form className={styles.formSignUp}>
                <div>
                    {errors.map(error =>
                        <p key={error} style={{color: "red"}}>{error}</p>
                    )}
                </div>
                <p>{t('Email')}: </p>
                <input
                    type="text"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                />
                <p>{t('Password')}:</p>
                <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                />
                <button onClick={handleSubmit} className={styles.formSignUp_button}>{t('Sign In')}</button>
                <div className={styles.separator}>{t('OR')}</div>
                <Link to={'/register'}><button className={styles.formSignUp_button}>{t('Sign Up')}</button></Link>
            </form>
        </div>
    );
};

export default SignIn;