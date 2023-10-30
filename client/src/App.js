import './App.css';
import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import './animations.css';
import {useState} from "react";
import {UserDetailsContext} from "./context/UserDetails";

function App() {
    const [userDetails, setUserDetails] = useState({
        id: "",
        email: "",
        token: "",
        roles: []
    });
    const [isAuth, setIsAuth] = useState(false);

    return (
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
