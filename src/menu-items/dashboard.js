import {
    IconDashboard,
    IconUsers,
    IconCategory,
    IconPhone,
    IconBroadcast,
    IconFileText,
    IconReportAnalytics,
    IconReport,
    IconBox,
    IconHome,
    IconHeartHandshake,
    IconTable,
    IconHelpCircle,
    IconCurrencyDollar,
    IconCalendarRepeat,
    IconMessage2Plus ,
    IconBug,
    IconPercentage,
    IconQuestionMark,
    IconBuilding,
    IconDeviceIpadQuestion   ,
    IconUserScan ,
    IconChecklist
} from '@tabler/icons-react';
import { IconBuildingCommunity } from "@tabler/icons-react";
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

import { APP_PREFIX_PATH } from 'config/constant';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

// import { IoHome } from "react-icons/io5";
// constant
const icons = {
    IconDashboard,
    IconMessage2Plus  : IconMessage2Plus,
    IconManageSociety: ApartmentOutlinedIcon,
    // IconManageIssues: ReportProblemOutlinedIcon,
    IconUsers,
    IconCategory,
    IconPhone,
    IconBroadcast,
    IconFileText,
    IconReportAnalytics,
    IconReport,
    IconBox,
    IconHome,
    IconHeartHandshake,
    IconTable,
    LiveHelpOutlinedIcon,
    IconQuestionMark: IconHelpCircle,
    IconCurrencyDollar,
    IconCalendarRepeat,
    IconBug,
    IconPercentage,
    IconDeviceIpadQuestion  ,
    IconUserScan ,
    IconChecklist
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const menuItems = {
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: APP_PREFIX_PATH + '/dashboard',
            icon: icons.IconDashboard
        },

        {
            id: 'manage_guard',
            title: "Admission-Form",
            type: 'item',
            url: APP_PREFIX_PATH + '/admission-form',
            icon: icons.IconMessage2Plus 
        },

        
        
        {
            id: 'inquiry_form',
            title: "Inquiries",
            type: 'item',
            url: APP_PREFIX_PATH + '/inquiry-list',
            icon: icons.IconDeviceIpadQuestion  
        },
        
        {
            id: 'task_management',
            title: "Task Manager",
            type: 'item',
            url: APP_PREFIX_PATH + '/task-management',
            icon: icons.IconChecklist  
        },
        
        {
            id: 'manage-customer',
            title: 'Manage Users',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [{
                    id: 'customer-list',
                    title: 'Student List',
                    type: 'item',
                    url: APP_PREFIX_PATH + '/student-list',
                    icon: icons.IconUsers
                },
                {
                    id: 'deleted-list',
                    title: 'Not Taken Admission',
                    type: 'item',
                    url: APP_PREFIX_PATH + '/enquiry-management',
                    icon: icons.IconUsers
                }
            ]
        },
        {
            id: 'manage_feculty',
            title: "Manage Feculty",
            type: 'item',
            url: APP_PREFIX_PATH + '/manage-feculty',
            icon: icons.IconUserScan 
        },
        {
            id: 'manage_courses',
            title: 'Manage Courses',
            type: 'item',
            url: APP_PREFIX_PATH + '/manage-courses',
            icon: IconBuildingCommunity
        },
        // {
        //     id: 'manage_branches',
        //     title: 'Manage Branches',
        //     type: 'item',
        //     url: APP_PREFIX_PATH + '/manage-branches',
        //     icon: IconBuilding
        // },

        {
            id: 'manage_expenses',
            title: 'Manage Expenses',
            type: 'item',
            url: APP_PREFIX_PATH + '/manage-expenses',
            icon: IconBuilding
        },
       
        // {
        //     id: 'manage_adds',
        //     title: 'Manage Ads',
        //     type: 'item',
        //     icon: icons.IconCategory,
        //     url: APP_PREFIX_PATH + '/manage-ads'
        // },
        {
            id: 'manage_quiz',
            title: 'Manage Quiz',
            type: 'item',
            icon: QuizOutlinedIcon,
            url: APP_PREFIX_PATH + '/manage-quiz'
        },
        {
            id: 'manage_earning',
            title: 'Manage Earning',
            type: 'item',
            icon: AttachMoneyOutlinedIcon,
            url: APP_PREFIX_PATH + '/manage-earning'
        },
       
        {
            id: 'manage_faq',
            title: "Manage FAQ's",
            type: 'item',
            url: APP_PREFIX_PATH + '/manage-FAQ',
            icon: IconQuestionMark
        },

        {
            id: 'manage_banner',
            title: 'Manage Banners',
            type: 'item',
            url: APP_PREFIX_PATH + '/manage-banner',
            icon: IconCalendarRepeat
        },
      
        {
            id: 'manage_contact',
            title: 'Manage Contact Us',
            type: 'item',
            icon: icons.IconPhone,
            url: APP_PREFIX_PATH + '/manage-contact'
        },
        {
            id: 'manage_content',
            title: 'Manage Content',
            type: 'item',
            icon: icons.IconFileText,
            url: APP_PREFIX_PATH + '/manage-content'
        },
        {
            id: 'manage_broadcast',
            title: 'Manage Broadcast',
            type: 'item',
            icon: icons.IconBroadcast,
            url: APP_PREFIX_PATH + '/manage-broadcast'
        },
        {
            id: 'tabular_report',
            title: 'Tabular Report',
            type: 'collapse',
            icon: icons.IconReport,
            children: [{
                    id: 'customer_tabular_report',
                    title: 'User Tabular Report',
                    type: 'item',
                    url: APP_PREFIX_PATH + '/user-tabular-report',
                    icon: icons.IconTable,
                    breadcrumbs: true
                }
                // {
                //     id: 'guard_tabular_report',
                //     title: 'Guard Tabular Report',
                //     type: 'item',
                //     url: APP_PREFIX_PATH + '/guard-tabular-report',
                //     icon: icons.IconGuard,
                //     breadcrumbs: true
                // },
              
            ]
        },
        {
            id: 'analytics_report',
            title: 'Analytical Report',
            type: 'collapse',
            icon: icons.IconReportAnalytics,
            children: [{
                    id: 'customer_ana_report',
                    title: 'User Analytics Report',
                    type: 'item',
                    url: APP_PREFIX_PATH + '/user-ana-report',
                    icon: icons.IconReportAnalytics,
                    breadcrumbs: true
                },
                // {
                //     id: 'guard_ana_report',
                //     title: 'Guard Analytics Report',
                //     type: 'item',
                //     url: APP_PREFIX_PATH + '/guard-ana-report',
                //     icon: icons.IconGuard,
                //     breadcrumbs: true
                // },
               
            ]
        },
        {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: APP_PREFIX_PATH + '/profile',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            hidden: true
        },
        {
            id: 'cuestomer',
            title: 'view-customer',
            type: 'item',
            url: APP_PREFIX_PATH + '/view-user/:user_id',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            hidden: true
        }
    ]
};

export default menuItems;