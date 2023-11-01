import React, {useContext, useEffect} from 'react';
import {useCookies} from "react-cookie";
import {UserDetailsContext} from "../context/UserDetails";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const [cookie, setCookie, removeCookie] = useCookies(['token']);
    const {isAuth, setIsAuth, setUserDetails} = useContext(UserDetailsContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuth(false);
        removeCookie('token');
        setUserDetails({});
        navigate('/');
    }, []);

    return (
        <div>

        </div>
    );
};

export default Logout;