import React, {useContext, useState} from 'react';
import styles from './Authorization.module.css';
import {Link, useNavigate} from "react-router-dom";
import Validator from "../../util/Validator";
import AccountService from "../../api/AccountService";
import {useCookies} from "react-cookie";
import {UserDetailsContext} from "../../context/UserDetails";
import { useTranslation } from 'react-i18next';

const SignUp = () => {
    const { t } = useTranslation();
    const [cookies, setCookies] = useCookies(['token']);
    const {setUserDetails, setIsAuth} = useContext(UserDetailsContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        errors.length = 0;

        if(!validate()) {
            AccountService.register(form)
                .then(response => {
                    if(response.status === 201) {
                        setUserDetails({
                            id: response.data.account.id,
                            email: form.email,
                            token: response.data.token,
                            roles: response.data.account.roles.map((role) => role.name)
                        });

                        setCookies('token', response.data.token, { path: '/' });

                        setIsAuth(true);

                        navigate('/');
                    }
                }).catch(error => {
                    let errMsg = error.response.data;
                    if(errMsg === "Email already taken") {
                        setErrors([...errors, errMsg]);
                    }
            })
        }
    }

    const validate = () => {
        let hasErrors = false;
        if(!Validator.validateEmail(form.email)) {
            setErrors([...errors, t("Invalid email")]);
            hasErrors = true;
        }
        if(form.password !== form.confirmPassword) {
            setErrors([...errors, t("Password mismatch")]);
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
                <p>{t('Confirm password')}:</p>
                <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword: e.target.value})}
                />
                <button onClick={handleSubmit} className={styles.formSignUp_button}>{t('Sign Up')}</button>
                <div className={styles.separator}>{t('OR')}</div>
                <Link to={'/login'}><button className={styles.formSignUp_button}>{t('Sign In')}</button></Link>
            </form>
        </div>
    );
};

export default SignUp;