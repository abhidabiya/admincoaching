
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import { APP_PREFIX_PATH } from 'config/constant';


// function Authentication() {
//     const navigate = useNavigate();
//     console.log('auth page enter');
     
//     useEffect(() => {
//         const path = window.location.pathname;
//         const protectedPaths = [
//             '/dashboard',
//             APP_PREFIX_PATH + '/manage-category',
//             APP_PREFIX_PATH + '/user_list',
//             APP_PREFIX_PATH + '/deleted_user',
//             APP_PREFIX_PATH + '/manage-category',
//             APP_PREFIX_PATH + '/manage-banner',
//             APP_PREFIX_PATH + '/view-homes',
//             APP_PREFIX_PATH + '/manage-user-subscription',
//             APP_PREFIX_PATH + '/manage-question',
//             APP_PREFIX_PATH + '/manage-FAQ',
//             APP_PREFIX_PATH + '/manage-contact',
//             APP_PREFIX_PATH + '/manage-content',
//             APP_PREFIX_PATH + '/manage-broadcast',
//             APP_PREFIX_PATH + '/user-tabular-report',
//             APP_PREFIX_PATH + '/business-tabular-report',
//             APP_PREFIX_PATH + '/user-ana-report',
//             APP_PREFIX_PATH + '/business-ana-report',
//             APP_PREFIX_PATH + '/profile',
//             APP_PREFIX_PATH + '/manage-center',
//             APP_PREFIX_PATH + '/view-user/:user_id',
//             APP_PREFIX_PATH + '/view-question/:user_id'
//         ];

//         const token = sessionStorage.getItem('token');
//         const userType = sessionStorage.getItem('user_type');

//         console.log('Current Path:', path);
//         console.log('Token:', token);

//         // Case 1: No token - Redirect to login page for any protected route
//         if (!token) {
//             if (
//                 ![APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/forgotpassword', APP_PREFIX_PATH + '/resetpassword'].includes(path)
//             ) {
//                 console.log('Navigating to /');
//                 navigate(APP_PREFIX_PATH + '/');
//             }
//         } else {
//             // Case 2: Token is present
//             if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/resetpassword', APP_PREFIX_PATH + '/forgotpassword'].includes(path)) {
//                 // Redirect to dashboard if accessing login/reset/forgot-password while logged in
//                 console.log('Navigating to dashboard since token is present');
//                 navigate(APP_PREFIX_PATH + '/dashboard');
//             }

//             // Check for protected paths and user type validity
//             if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
//                 console.log('Protected path');
//                 if (userType !== '0') {
//                     navigate(APP_PREFIX_PATH + '/');
//                 }
//             }
//         }
//     }, [navigate]);

//     return null;
// }

// export default Authentication;












// OLD Code


import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_PREFIX_PATH } from 'config/constant';

function Authentication() {
    const navigate = useNavigate();
    console.log('auth page enter');
     
    useEffect(() => {
        const path = window.location.pathname;
        const protectedPaths = [
            '/dashboard',
            APP_PREFIX_PATH + '/manage-category',
            APP_PREFIX_PATH + '/user_list',
            APP_PREFIX_PATH + '/deleted_user',
            APP_PREFIX_PATH + '/manage-category',
            APP_PREFIX_PATH + '/manage-banner',
            APP_PREFIX_PATH + '/view-homes',
            APP_PREFIX_PATH + '/manage-user-subscription',
            APP_PREFIX_PATH + '/manage-question',
            APP_PREFIX_PATH + '/manage-FAQ',
            APP_PREFIX_PATH + '/manage-contact',
            APP_PREFIX_PATH + '/manage-content',
            APP_PREFIX_PATH + '/manage-broadcast',
            APP_PREFIX_PATH + '/user-tabular-report',
            APP_PREFIX_PATH + '/business-tabular-report',
            APP_PREFIX_PATH + '/user-ana-report',
            APP_PREFIX_PATH + '/business-ana-report',
            APP_PREFIX_PATH + '/profile',
            APP_PREFIX_PATH + '/manage-center',
            APP_PREFIX_PATH + '/view-user/:user_id',
            APP_PREFIX_PATH + '/view-question/:user_id'
        ];

        const token = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('user_type');

        console.log('Current Path:', path);
        console.log('Token:', token);

        // TEMPORARY: For frontend testing, allow access if token exists or if it's a demo token
        // Remove this when API is ready
        const isDemoToken = token && token.startsWith('demo-token-');
        
        if (!token && !isDemoToken) {
            // Case 1: No token and not demo token
            if (
                ![APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/forgotpassword', APP_PREFIX_PATH + '/resetpassword'].includes(path)
            ) {
                console.log('Navigating to /');
                navigate(APP_PREFIX_PATH + '/');
            }
        } else { 
            
            // Case 2: Token is present (real or demo)
            if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/resetpassword', APP_PREFIX_PATH + '/forgotpassword'].includes(path)) {
                // Redirect to dashboard if accessing login/reset/forgot-password while logged in
                console.log('Navigating to dashboard since token is present');
                navigate(APP_PREFIX_PATH + '/dashboard');
            }

            // Check for protected paths and user type validity
            if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
                console.log('Protected path');
                // For demo, accept any user_type or set to '0'
                if (!userType) {
                    sessionStorage.setItem('user_type', '0');
                }
            }
        }
    }, [navigate]);

    return null;
}

export default Authentication;