import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { APP_PREFIX_PATH } from 'config/constant';
// import AuthResetPassword3 from 'views/pages/authentication/auth-forms/AuthResetPassword';
// import AuthForgotPassword3 from 'views/pages/authentication/auth-forms/AuthForgotPassword'

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication3/Register3')));
const AuthForgotPassword3 = Loadable(lazy(() => import('views/pages/authentication3/Forgotpassword3')));
const AuthResetPassword3 = Loadable(lazy(() => import('views/pages/authentication3/ResetPassword3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: APP_PREFIX_PATH + '/',
            element: <AuthLogin3 />
        },
        {
            path: APP_PREFIX_PATH + '/register',
            element: <AuthRegister3 />
        },
        {
            path: APP_PREFIX_PATH + '/forgotpassword',
            element: <AuthForgotPassword3 />
        },
        {
            path: APP_PREFIX_PATH + '/resetpassword',
            element: <AuthResetPassword3 />
        }
    ]
};

export default AuthenticationRoutes;
