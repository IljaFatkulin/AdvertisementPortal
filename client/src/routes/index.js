import CategoryView from "../pages/Category/View/CategoryView";
import Advertisements from "../pages/Advertisements /Advertisements";
import AdvertisementView from "../pages/Advertisements /AdvertisementView/AdvertisementView";
import AdvertisementCreate from "../pages/Advertisements /AdvertisementCreate/AdvertisementCreate";
import SectionCreate from "../pages/Category/Create/SectionCreate";
import AdvertisementEdit from "../pages/Advertisements /AdvertisementEdit/AdvertisementEdit";
import NotFound from "../pages/NotFound/NotFound";
import Categories from "../pages/Category/Categories";
import SignUp from "../pages/Authorization/SignUp";
import Favorite from "../pages/Favorite/Favorite";
import SignIn from "../pages/Authorization/SignIn";
import Profile from "../pages/Profile/Profile";
import Logout from "../components/Logout";
import SectionView from "../pages/Category/View/SectionView";
import PDFGenerator from "../components/PDFGenerator/PDFGenerator";
import PDF from "../pages/PDF/PDF";

export const commonRoutes = [
    {path: '/statistics/:category/:id', element: <PDFGenerator/>},
    {path: '/', element: <Categories/>},

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

    {path: '/choose', element: <Categories create={true}/>},
    {path: '/advertisements/:category/:id/edit', element: <AdvertisementEdit/>},
    {path: '/advertisements/:category/create', element: <AdvertisementCreate/>},
    {path: '/profile/:email?', element: <Profile/>},
    {path: '/favorite', element: <Favorite/>},
    {path: '/logout', element: <Logout/>},
    {path: '/pdf', element: <PDF/>},
];

export const adminRoutes = [
    ...commonRoutes,
    ...userRoutes,

    {path: '/:id', element: <CategoryView/>},
    {path: '/sections/:id', element: <SectionView/>},
    {path: '/create', element: <SectionCreate/>},
]