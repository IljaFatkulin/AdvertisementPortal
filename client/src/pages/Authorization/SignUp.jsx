import React, {useState} from 'react';
import styles from './Authorization.module.css';
import {Link} from "react-router-dom";
import Validator from "../../util/Validator";
import AccountService from "../../api/AccountService";

const SignUp = () => {
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
                    console.log(response);
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
            setErrors([...errors, "Invalid email"]);
            hasErrors = true;
        }
        if(form.password !== form.confirmPassword) {
            setErrors([...errors, "Password mismatch"]);
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
                <p>Confirm password:</p>
                <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword: e.target.value})}
                />
                <button onClick={handleSubmit} className={styles.formSignUp_button}>Sign Up</button>
                <div className={styles.separator}>OR</div>
                <Link to={'/login'}><button className={styles.formSignUp_button}>Sign In</button></Link>
            </form>
        </div>
    );
};

export default SignUp;