import CategoryView from "../pages/Category/View/CategoryView";
import Advertisements from "../pages/Advertisements /Advertisements";
import AdvertisementView from "../pages/Advertisements /AdvertisementView/AdvertisementView";
import AdvertisementCreate from "../pages/Advertisements /AdvertisementCreate/AdvertisementCreate";
import CategoryCreate from "../pages/Category/Create/CategoryCreate";
import AdvertisementEdit from "../pages/Advertisements /AdvertisementEdit/AdvertisementEdit";
import NotFound from "../pages/NotFound/NotFound";
import Home from "../pages/Home/Home";
import Categories from "../pages/Categories/Categories";
import SignUp from "../pages/Authorization/SignUp";
import SignIn from "../pages/Authorization/SignIn";

export const publicRoutes = [
    {path: '/', element: <Home/>},
    {path: '/register', element: <SignUp/>},
    {path: '/login', element: <SignIn/>},
    {path: '/categories', element: <Categories/>},

    {path: '/error/notfound', element: <NotFound/>},

    {path: '/categories/:id', element: <CategoryView/>},
    {path: '/categories/create', element: <CategoryCreate/>},
    {path: '/advertisements/:category', element: <Advertisements/>},
    {path: '/advertisements/:category/:id', element: <AdvertisementView/>},
    {path: '/advertisements/:category/:id/edit', element: <AdvertisementEdit/>},
    {path: '/advertisements/:category/create', element: <AdvertisementCreate/>}
];