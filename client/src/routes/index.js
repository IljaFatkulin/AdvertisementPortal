import CategoryView from "../pages/Category/View/CategoryView";
import Advertisements from "../pages/Advertisements /Advertisements";
import AdvertisementView from "../pages/Advertisements /AdvertisementView/AdvertisementView";
import AdvertisementCreate from "../pages/Advertisements /AdvertisementCreate/AdvertisementCreate";
import SectionCreate from "../pages/Category/Create/SectionCreate";
import AdvertisementEdit from "../pages/Advertisements /AdvertisementEdit/AdvertisementEdit";
import NotFound from "../pages/NotFound/NotFound";
import Home from "../pages/Home/Home";
import Categories from "../pages/Category/Categories";
import SignUp from "../pages/Authorization/SignUp";
import SignIn from "../pages/Authorization/SignIn";
import Profile from "../pages/Profile/Profile";
import Logout from "../components/Logout";
import SectionView from "../pages/Category/View/SectionView";

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
    {path: '*', element: <SignUp/>},
];

export const userRoutes = [
    ...commonRoutes,

    {path: '/categories/choose', element: <Categories create={true}/>},
    {path: '/advertisements/:category/:id/edit', element: <AdvertisementEdit/>},
    {path: '/advertisements/:category/create', element: <AdvertisementCreate/>},
    {path: '/profile/:email?', element: <Profile/>},
    {path: '/logout', element: <Logout/>}, 
];

export const adminRoutes = [
    ...commonRoutes,
    ...userRoutes,

    {path: '/categories/:id', element: <CategoryView/>},
    {path: '/sections/:id', element: <SectionView/>},
    {path: '/categories/create', element: <SectionCreate/>},
]