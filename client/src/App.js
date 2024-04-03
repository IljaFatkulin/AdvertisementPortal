import './App.css';
import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import './animations.css';
import {useEffect, useState} from "react";
import {UserDetailsContext} from "./context/UserDetails";
import {useCookies} from "react-cookie";
import AccountService from "./api/AccountService";
import Loader from "./components/Loader/Loader";

function App() {
    const [userDetails, setUserDetails] = useState({
        id: "",
        email: "",
        token: "",
        roles: []
    });
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [cookies] = useCookies(['token']);

    useEffect(() => {
        AccountService.test().then(r => console.log(r)).catch(e => console.log(e));
        setTimeout(() => {
            console.log(window.userUniqueId);
        }, 500);
        if(cookies.token) {
            AccountService.verifyWithToken(cookies.token)
                .then(response => {
                    if(response.status === 200) {
                        setIsAuth(true);
                        setUserDetails({
                            id: response.data.id,
                            email: response.data.email,
                            token: cookies.token,
                            roles: response.data.roles.map((role) => role.name)
                        });
                    }
                }).catch(() => {
                    setIsAuth(false);
                    setIsLoading(false);
                }).finally(() => {
                    setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
    isLoading
    ?
        <Loader/>
    :
        <div className="App">
            <UserDetailsContext.Provider value={{
                userDetails, setUserDetails,
                isAuth, setIsAuth
            }}>
                <BrowserRouter>
                    <AppRouter>
                    </AppRouter>
                </BrowserRouter>
            </UserDetailsContext.Provider>
        </div>
    );
}

export default App;
