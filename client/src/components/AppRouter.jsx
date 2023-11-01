import React, {useContext} from 'react';
import {Route, Routes} from "react-router-dom";
import {adminRoutes, publicRoutes, userRoutes} from "../routes";
import {UserDetailsContext} from "../context/UserDetails";

const AppRouter = () => {
    const {userDetails} = useContext(UserDetailsContext);
    const roles = userDetails.roles;

    return (
        <div>
            <Routes>
                {roles && roles.length
                    ?
                        roles.includes('ROLE_ADMIN')
                            ?
                                adminRoutes.map(route =>
                                    <Route
                                        element={route.element}
                                        path={route.path}
                                        key={route.path}
                                    />
                                )
                            :
                                userRoutes.map(route =>
                                    <Route
                                        element={route.element}
                                        path={route.path}
                                        key={route.path}
                                    />
                                )
                    :
                        publicRoutes.map(route =>
                            <Route
                                element={route.element}
                                path={route.path}
                                key={route.path}
                            />
                        )
                }

            </Routes>
        </div>
    );
};

export default AppRouter;