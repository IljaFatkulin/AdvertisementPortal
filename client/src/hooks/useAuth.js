import {useContext} from "react";
import {UserDetailsContext} from "../context/UserDetails";

const useAuth = () => {
    const {isAuth, userDetails } = useContext(UserDetailsContext);
    console.log(userDetails)

    const isAdmin = () => isAuth && userDetails.roles.includes("ROLE_ADMIN");

    return {
        isAuth,
        isAdmin
    };
};

export default useAuth;