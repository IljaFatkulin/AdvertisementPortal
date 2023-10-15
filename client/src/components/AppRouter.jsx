import React from 'react';
import {Route, Routes} from "react-router-dom";
import {publicRoutes} from "../routes";

const AppRouter = () => {
    return (
        <div>
            <Routes>
                {publicRoutes.map(route =>
                    <Route
                        element={route.element}
                        path={route.path}
                        key={route.path}
                    />
                )}
            </Routes>
        </div>
    );
};

export default AppRouter;