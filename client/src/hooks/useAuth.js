import {useContext} from "react";
import {UserDetailsContext} from "../context/UserDetails";

const useAuth = () => {
    const {isAuth, userDetails } = useContext(UserDetailsContext);

    const isAdmin = () => isAuth && userDetails.roles.includes("ROLE_ADMIN");

    return {
        isAuth,
        isAdmin
    };
};

export default useAuth;