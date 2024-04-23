import React, {useContext, useState} from 'react';
import styles from './Authorization.module.css';
import {Link, useNavigate} from "react-router-dom";
import AccountService from "../../api/AccountService";
import {UserDetailsContext} from "../../context/UserDetails";

const SignIn = () => {
    const {setUserDetails, setIsAuth} = useContext(UserDetailsContext);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

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
                }).catch(error => {
                    if(error.response && error.response.status === 401) {
                        setErrors([...errors, error.response.data]);
                    }
            })
        }
    }

    const validate = () => {
        let hasErrors = false;
        if(form.email.length < 1) {
            setErrors([...errors, "Email is required"]);
            hasErrors = true;
        }
        if(form.password.length < 1) {
            setErrors([...errors, "Password is required"]);
            hasErrors = true;
        }
        return hasErrors;
    }

    return (
        <div className={styles.container}>
            <Link to={"/"}><button style={{width: "150px"}} className={styles.formSignUp_button}>Home</button></Link>
            <form className={styles.formSignUp}>
                <div>
                    {errors.map(error =>
                        <p key={error} style={{color: "red"}}>{error}</p>
                    )}
                </div>
                <p>Email: </p>
                <input
                    type="text"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                />
                <p>Password:</p>
                <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                />
                <button onClick={handleSubmit} className={styles.formSignUp_button}>Sign In</button>
                <div className={styles.separator}>OR</div>
                <Link to={'/register'}><button className={styles.formSignUp_button}>Sign Up</button></Link>
            </form>
        </div>
    );
};

export default SignIn;