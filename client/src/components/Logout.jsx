import React, {useContext, useEffect} from 'react';
import {UserDetailsContext} from "../context/UserDetails";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const {isAuth, setIsAuth, setUserDetails} = useContext(UserDetailsContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuth(false);

        localStorage.removeItem('token');
        setUserDetails({});
        navigate('/');
    }, []);

    return (
        <div>

        </div>
    );
};

export default Logout;