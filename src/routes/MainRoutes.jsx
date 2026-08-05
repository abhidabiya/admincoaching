import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import DeletedCustomer from '../views/pages/DeletdCustomer';
import ManageQuestion from '../views/pages/ManageQuestion';
import ManageContact from '../views/pages/ManageContact';
import ManageBroadcast from '../views/pages/ManageBroadcast';
import ManageContent from 'views/pages/MangeContent';
import UserAnaReport from 'views/pages/AnalyticsReport';
import ViewCustomer from 'views/pages/ViewCustomer';
import Profile from 'views/pages/Profile';
import ManageCenter from 'views/pages/ManageCenter';
import { APP_PREFIX_PATH } from 'config/constant';
import CustomerReportedList from 'views/pages/CustomerReportedList';
import ManageFaq from 'views/pages/ManageFaq';
import ViewSubscription from 'views/pages/ViewSubscription';
import ViewCusQuestions from 'views/pages/ViewCusQuestion';
import BusinessReportedList from 'views/pages/BusinessReport';
import BusinessAnaReport from 'views/pages/BusinessAnalyticsReport';
import ManageUserSubscription from 'views/pages/ManageUserSubscription';
import BusinessClaimReportedList from 'views/pages/ManageClaimBusinessTabulsr';
import BusinessClaimAnaReport from 'views/pages/BusinessAnalyticsClaim';
import SubscriptionReportedList from 'views/pages/SubscriptionTabular';
import SubscriptionAnayliticReportedList from 'views/pages/SubscriptionAnalytics';
import ViewDeletedCusQuestions from 'views/pages/DeletedClaimsDetails';
import ManageAds from '../views/pages/ManageAds';
import ViewAds from 'views/pages/ViewAds';
import ManageBanner from 'views/pages/ManageBanner';
import ManageFeculty from 'views/pages/ManageFeculty';
import ManageCourses from 'views/pages/ManageCourses';
import ManageBranches from 'views/pages/ManageBranches';
import ManageIssues from 'views/pages/ManageIssues';
import AddNewGuard from 'views/pages/AddNewGuard';
import AddNewSociety from 'views/pages/AddNewCourses';
import AddNewWing from 'views/pages/AddNewWing';
import EditGuard from 'views/pages/EditGuard';
import ViewGuardDetails from 'views/pages/ViewGuardDetails';
import ManageQuiz from 'views/pages/ManageQuiz';
import GuardTabularReport from 'views/pages/GuardTabularReport';
import ManageEarning from 'views/pages/ManageEarning';
import ViewSociety from 'views/pages/ViewSociety';

import ManageExpenses from 'views/pages/ManageExpenses';


import AdmissionForm from 'views/pages/AdmissionForm.jsx';
import StudentUserList from 'views/pages/StudentUserList.jsx';
import EnquiryManagement from 'views/pages/EnquiryManagement.jsx';
import EditStudentUser from 'views/pages/EditStudentUser.jsx';
import InquaryData from 'views/pages/InquaryData';
import TaskManagement from 'views/pages/TaskManagement.jsx';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const CustomerList = Loadable(lazy(() => import('views/pages/CustomerList')));

const MainRoutes = {
    path: APP_PREFIX_PATH + '/',
    element: <MainLayout />,
    children: [
        {
            path: APP_PREFIX_PATH + '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '',
            children: [
                {
                    path: APP_PREFIX_PATH + '/dashboard',
                    element: <DashboardDefault />
                },

                {
                    path: APP_PREFIX_PATH + '/admission-form',
                    element: <AdmissionForm />
                },
                {
                    path: APP_PREFIX_PATH + '/student-list',
                    element: <StudentUserList />

                },
                {
                    path: APP_PREFIX_PATH + '/inquiry-list',
                    element: <InquaryData />

                },
                {
                    path: APP_PREFIX_PATH + '/task-management',
                    element: <TaskManagement />
                },
              

                {
                    path: APP_PREFIX_PATH + '/enquiry-management',
                    element: <EnquiryManagement />
                },
              
                {
                    path: APP_PREFIX_PATH + '/edit-user/:user_id',
                    element: <EditStudentUser />
                },
                {
                    path: APP_PREFIX_PATH + '/view-ads/:ads_id',
                    element: <ViewAds />
                },
                {
                    path: APP_PREFIX_PATH + '/add-new-guard',
                    element: <AddNewGuard />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-question',
                    element: <ManageQuestion />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-FAQ',
                    element: <ManageFaq />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-quiz',
                    element: <ManageQuiz />
                },
              
                {
                    path: APP_PREFIX_PATH + '/manage-courses',
                    element: <ManageCourses />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-feculty',
                    element: <ManageFeculty />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-expenses',
                    element: <ManageExpenses />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-branches',
                    element: <ManageBranches />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-banner',
                    element: <ManageBanner />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-user-subscription',
                    element: <ManageUserSubscription />
                },
                {
                    path: APP_PREFIX_PATH + '/view-subscription/:subscription_id',
                    breadcrumbs: false,
                    element: <ViewSubscription />
                },
                {
                    path: APP_PREFIX_PATH + '/edit-guard/:user_id',
                    breadcrumbs: false,
                    element: < EditGuard />
                },
                {
                    path: APP_PREFIX_PATH + '/view-society/:user_id',
                    breadcrumbs: false,
                    element: <ViewSociety />
                },
                {
                    path: APP_PREFIX_PATH + '/add-wing',
                    // breadcrumbs: false,
                    element: < AddNewWing />
                },
                {
                    path: APP_PREFIX_PATH + '/view-question/:customer_id',
                    breadcrumbs: false,
                    element: <ViewCusQuestions />
                },
                {
                    path: APP_PREFIX_PATH + '/view-deleted-question/:customer_id',
                    breadcrumbs: false,
                    element: <ViewDeletedCusQuestions />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-center',
                    element: <ManageCenter />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-contact',
                    element: <ManageContact />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-issues',
                    element: <ManageIssues />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-broadcast',
                    element: <ManageBroadcast />
                },
                {
                    path: APP_PREFIX_PATH + '/manage-content',
                    element: <ManageContent />
                },
                {
                    path: APP_PREFIX_PATH + '/user-tabular-report',
                    element: <CustomerReportedList />
                },
                {
                    path: APP_PREFIX_PATH + '/guard-tabular-report',
                    element: <GuardTabularReport />
                },
                {
                    path: APP_PREFIX_PATH + '/business-ana-report',
                    element: <BusinessAnaReport />
                },
                {
                    path: APP_PREFIX_PATH + '/business-claim-ana-report',
                    element: <BusinessClaimAnaReport />
                },
                {
                    path: APP_PREFIX_PATH + '/customer-claim-tabular-report',
                    element: <BusinessClaimReportedList />
                },
                {
                    path: APP_PREFIX_PATH + '/business-tabular-report',
                    element: <BusinessReportedList />
                },
                {
                    path: APP_PREFIX_PATH + '/subscription-tabular-report',
                    element: <SubscriptionReportedList />
                },
                {
                    path: APP_PREFIX_PATH + '/subscription-ana-report',
                    element: <SubscriptionAnayliticReportedList />
                },
                {
                    path: APP_PREFIX_PATH + '/user-ana-report',
                    element: <UserAnaReport />
                },
               
                {
                    path: APP_PREFIX_PATH + '/manage-earning',
                    element: <ManageEarning/>
                },
                {
                    path: APP_PREFIX_PATH + '/view-user/:user_id',
                    breadcrumbs: false,
                    element: <ViewCustomer />
                },
                {
                    path: APP_PREFIX_PATH + '/view-guard/:user_id',
                    breadcrumbs: false,
                    element: <ViewGuardDetails />
                },
                {
                    path: APP_PREFIX_PATH + '/profile',
                    breadcrumbs: false,
                    element: <Profile />
                },
                {
                    path: APP_PREFIX_PATH + '/add-courses',
                    // breadcrumbs: false,
                    element: <AddNewSociety />
                },
            ]
        }
    ]
};

export default MainRoutes;
