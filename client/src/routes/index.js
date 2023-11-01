import CategoryView from "../pages/Category/View/CategoryView";
import Advertisements from "../pages/Advertisements /Advertisements";
import AdvertisementView from "../pages/Advertisements /AdvertisementView/AdvertisementView";
import AdvertisementCreate from "../pages/Advertisements /AdvertisementCreate/AdvertisementCreate";
import CategoryCreate from "../pages/Category/Create/CategoryCreate";
import AdvertisementEdit from "../pages/Advertisements /AdvertisementEdit/AdvertisementEdit";
import NotFound from "../pages/NotFound/NotFound";
import Home from "../pages/Home/Home";
import Categories from "../pages/Category/Categories";
import SignUp from "../pages/Authorization/SignUp";
import SignIn from "../pages/Authorization/SignIn";
import Profile from "../pages/Profile/Profile";
import Logout from "../components/Logout";

export const commonRoutes = [
    {path: '/', element: <Home/>},
    {path: '/categories', element: <Categories/>},

    {path: '/error/notfound', element: <NotFound/>},

    {path: '/advertisements/:category', element: <Advertisements/>},
    {path: '/advertisements/:category/:id', element: <AdvertisementView/>},
];


export const publicRoutes = [
    ...commonRoutes,

    {path: '/register', element: <SignUp/>},
    {path: '/login', element: <SignIn/>},
];

export const userRoutes = [
    ...commonRoutes,

    {path: '/advertisements/:category/:id/edit', element: <AdvertisementEdit/>},
    {path: '/advertisements/:category/create', element: <AdvertisementCreate/>},
    {path: '/profile', element: <Profile/>},
    {path: '/logout', element: <Logout/>},
];

export const adminRoutes = [
    ...commonRoutes,
    ...userRoutes,

    {path: '/categories/:id', element: <CategoryView/>},
    {path: '/categories/create', element: <CategoryCreate/>},
]