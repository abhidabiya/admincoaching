import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {
    ArrowDropDown,
    Visibility,
    Edit,
    Delete,
    ToggleOff,
    School,
    QueryBuilder,
    PersonAdd,
    PersonOutline,
    ErrorOutline,
    Update,
    FollowTheSigns
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';

// Updated columns with new student fields
const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 140, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
    { id: 'user_type', label: 'User Type', minWidth: 130, align: 'center' },
    { id: 'admission_type', label: 'Admission Type', minWidth: 130, align: 'center' },
    { id: 'course_name', label: 'Course', minWidth: 150, align: 'center' },
    { id: 'qualification', label: 'Qualification', minWidth: 130, align: 'center' },
    { id: 'mobile', label: 'Mobile', minWidth: 120, align: 'center' },
    { id: 'parent_contact', label: 'Parent Contact', minWidth: 130, align: 'center' },
    { id: 'total_fees', label: 'Total Fees (₹)', minWidth: 120, align: 'center' },
    { id: 'fees_pending', label: 'Pending Fees (₹)', minWidth: 120, align: 'center' },
    { id: 'student_status', label: 'Status', minWidth: 120, align: 'center' },
    { id: 'date_of_admission', label: 'Admission Date', minWidth: 120, align: 'center' },
    { id: 'createtime', label: 'Created Date', minWidth: 150, align: 'center' }
];

// ===================== STATIC DATA =====================

const STATIC_USER_DATA = [
    {
        user_id: 101,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@email.com',
        user_type: 5,
        admission_type: 0,
        course_name: 'B.Tech Computer Science',
        qualification: '12th Science',
        mobile: '9876543210',
        parent_contact: '9876543211',
        total_fees: 120000,
        fees_pending: 120000,
        student_status: 0,
        date_of_admission: null,
        createtime: '2025-01-15T10:30:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-20',
        last_followup_time: '11:00',
        followup_notes: 'Called, interested in course',
        next_followup_date: '2025-01-27',
        next_followup_time: '14:00',
        followup_status: 3
    },
    {
        user_id: 102,
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        user_type: 6,
        admission_type: 1,
        course_name: 'MBA Marketing',
        qualification: 'B.Com',
        mobile: '9876543220',
        parent_contact: '9876543221',
        total_fees: 180000,
        fees_pending: 45000,
        student_status: 3,
        date_of_admission: '2025-01-10',
        createtime: '2025-01-05T09:00:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-25',
        last_followup_time: '10:00',
        followup_notes: 'Admission confirmed, fees partially paid',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 5
    },
    {
        user_id: 103,
        name: 'Rohit Kumar',
        email: 'rohit.kumar@email.com',
        user_type: 5,
        admission_type: 0,
        course_name: 'B.Tech Mechanical',
        qualification: '12th Science',
        mobile: '9876543230',
        parent_contact: '9876543231',
        total_fees: 95000,
        fees_pending: 95000,
        student_status: 2,
        date_of_admission: null,
        createtime: '2025-01-18T14:20:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-22',
        last_followup_time: '16:00',
        followup_notes: 'Not interested, looking for other colleges',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 4
    },
    {
        user_id: 104,
        name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        user_type: 6,
        admission_type: 1,
        course_name: 'MCA',
        qualification: 'BCA',
        mobile: '9876543240',
        parent_contact: '9876543241',
        total_fees: 150000,
        fees_pending: 0,
        student_status: 4,
        date_of_admission: '2024-06-01',
        createtime: '2024-05-20T11:45:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-10',
        last_followup_time: '09:30',
        followup_notes: 'Course completed successfully',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 5
    },
    {
        user_id: 105,
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        user_type: 5,
        admission_type: 0,
        course_name: 'BBA',
        qualification: '12th Commerce',
        mobile: '9876543250',
        parent_contact: '9876543251',
        total_fees: 75000,
        fees_pending: 75000,
        student_status: 1,
        date_of_admission: '2025-02-01',
        createtime: '2025-01-20T08:15:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-28',
        last_followup_time: '13:00',
        followup_notes: 'Confirmed admission, will pay fees tomorrow',
        next_followup_date: '2025-02-05',
        next_followup_time: '10:00',
        followup_status: 5
    },
    {
        user_id: 106,
        name: 'Ananya Gupta',
        email: 'ananya.gupta@email.com',
        user_type: 6,
        admission_type: 1,
        course_name: 'B.Tech Electronics',
        qualification: '12th Science',
        mobile: '9876543260',
        parent_contact: '9876543261',
        total_fees: 110000,
        fees_pending: 55000,
        student_status: 3,
        date_of_admission: '2025-01-12',
        createtime: '2025-01-08T16:30:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-30',
        last_followup_time: '11:30',
        followup_notes: 'Second installment due next month',
        next_followup_date: '2025-02-15',
        next_followup_time: '12:00',
        followup_status: 1
    },
    {
        user_id: 107,
        name: 'Karthik Nair',
        email: 'karthik.nair@email.com',
        user_type: 5,
        admission_type: 0,
        course_name: 'M.Tech Data Science',
        qualification: 'B.Tech IT',
        mobile: '9876543270',
        parent_contact: '9876543271',
        total_fees: 200000,
        fees_pending: 200000,
        student_status: 0,
        date_of_admission: null,
        createtime: '2025-01-28T10:00:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '',
        last_followup_time: '',
        followup_notes: '',
        next_followup_date: '2025-02-03',
        next_followup_time: '15:00',
        followup_status: 0
    },
    {
        user_id: 108,
        name: 'Meera Joshi',
        email: 'meera.joshi@email.com',
        user_type: 6,
        admission_type: 1,
        course_name: 'B.Sc Nursing',
        qualification: '12th Science (Biology)',
        mobile: '9876543280',
        parent_contact: '9876543281',
        total_fees: 85000,
        fees_pending: 20000,
        student_status: 5,
        date_of_admission: '2024-07-15',
        createtime: '2024-07-10T09:30:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-05',
        last_followup_time: '14:00',
        followup_notes: 'Student discontinued due to medical reasons',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 4
    },
    {
        user_id: 109,
        name: 'Arjun Mehta',
        email: 'arjun.mehta@email.com',
        user_type: 0,
        admission_type: null,
        course_name: 'N/A',
        qualification: 'MBA',
        mobile: '9876543290',
        parent_contact: 'N/A',
        total_fees: null,
        fees_pending: null,
        student_status: null,
        date_of_admission: null,
        createtime: '2024-01-01T00:00:00',
        active_flag: 1,
        user_side: 3,
        parkom_active_flag: 1,
        gatepass_active_flag: 1,
        last_followup_date: '',
        last_followup_time: '',
        followup_notes: '',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 0
    },
    {
        user_id: 110,
        name: 'Deepa Iyer',
        email: 'deepa.iyer@email.com',
        user_type: 1,
        admission_type: null,
        course_name: 'N/A',
        qualification: 'B.A',
        mobile: '9876543300',
        parent_contact: 'N/A',
        total_fees: null,
        fees_pending: null,
        student_status: null,
        date_of_admission: null,
        createtime: '2024-03-15T08:00:00',
        active_flag: 1,
        user_side: 1,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '',
        last_followup_time: '',
        followup_notes: '',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 0
    },
    {
        user_id: 111,
        name: 'Rahul Verma',
        email: 'rahul.verma@email.com',
        user_type: 5,
        admission_type: 0,
        course_name: 'B.Tech Civil',
        qualification: '12th Science',
        mobile: '9876543310',
        parent_contact: '9876543311',
        total_fees: 90000,
        fees_pending: 90000,
        student_status: 0,
        date_of_admission: null,
        createtime: '2025-01-29T17:00:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '',
        last_followup_time: '',
        followup_notes: '',
        next_followup_date: '2025-02-04',
        next_followup_time: '10:30',
        followup_status: 0
    },
    {
        user_id: 112,
        name: 'Pooja Deshmukh',
        email: 'pooja.deshmukh@email.com',
        user_type: 6,
        admission_type: 1,
        course_name: 'MBA Finance',
        qualification: 'B.Com',
        mobile: '9876543320',
        parent_contact: '9876543321',
        total_fees: 175000,
        fees_pending: 87500,
        student_status: 3,
        date_of_admission: '2025-01-08',
        createtime: '2025-01-02T12:00:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-26',
        last_followup_time: '15:30',
        followup_notes: 'Half fees paid, remaining in March',
        next_followup_date: '2025-03-01',
        next_followup_time: '11:00',
        followup_status: 1
    },
    {
        user_id: 113,
        name: 'Sanjay Rao',
        email: 'sanjay.rao@email.com',
        user_type: 2,
        admission_type: null,
        course_name: 'N/A',
        qualification: '12th',
        mobile: '9876543330',
        parent_contact: 'N/A',
        total_fees: null,
        fees_pending: null,
        student_status: null,
        date_of_admission: null,
        createtime: '2024-06-10T07:30:00',
        active_flag: 1,
        user_side: 2,
        parkom_active_flag: 0,
        gatepass_active_flag: 1,
        last_followup_date: '',
        last_followup_time: '',
        followup_notes: '',
        next_followup_date: '',
        next_followup_time: '',
        followup_status: 0
    },
    {
        user_id: 114,
        name: 'Nisha Agarwal',
        email: 'nisha.agarwal@email.com',
        user_type: 5,
        admission_type: 0,
        course_name: 'B.Pharm',
        qualification: '12th Science (PCB)',
        mobile: '9876543340',
        parent_contact: '9876543341',
        total_fees: 130000,
        fees_pending: 130000,
        student_status: 0,
        date_of_admission: null,
        createtime: '2025-01-30T09:45:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-31',
        last_followup_time: '10:00',
        followup_notes: 'Not reachable, will try again',
        next_followup_date: '2025-02-07',
        next_followup_time: '10:00',
        followup_status: 2
    },
    {
        user_id: 115,
        name: 'Amit Tiwari',
        email: 'amit.tiwari@email.com',
        user_type: 6,
        admission_type: 1,
        course_name: 'B.Tech Information Technology',
        qualification: '12th Science',
        mobile: '9876543350',
        parent_contact: '9876543351',
        total_fees: 115000,
        fees_pending: 0,
        student_status: 3,
        date_of_admission: '2025-01-05',
        createtime: '2024-12-28T13:00:00',
        active_flag: 1,
        user_side: null,
        parkom_active_flag: 0,
        gatepass_active_flag: 0,
        last_followup_date: '2025-01-15',
        last_followup_time: '09:00',
        followup_notes: 'Full fees paid, admission active',
        next_followup_date: '2025-06-01',
        next_followup_time: '09:00',
        followup_status: 1
    }
];

const STATIC_STATS = {
    total_enquiries: 7,
    total_admissions: 6,
    active_admissions: 4,
    completed_admissions: 1,
    total_fees_collected: 470000,
    total_fees_pending: 227500
};

const STATIC_COURSES = [
    { course_id: 1, course_name: 'B.Tech Computer Science' },
    { course_id: 2, course_name: 'B.Tech Mechanical' },
    { course_id: 3, course_name: 'B.Tech Electronics' },
    { course_id: 4, course_name: 'B.Tech Civil' },
    { course_id: 5, course_name: 'B.Tech Information Technology' },
    { course_id: 6, course_name: 'MBA Marketing' },
    { course_id: 7, course_name: 'MBA Finance' },
    { course_id: 8, course_name: 'MCA' },
    { course_id: 9, course_name: 'M.Tech Data Science' },
    { course_id: 10, course_name: 'BBA' },
    { course_id: 11, course_name: 'B.Sc Nursing' },
    { course_id: 12, course_name: 'B.Pharm' }
];

// ===================== STATIC DATA END =====================

const InquaryData = () => {
    const [parkomStatus, setParkomStatus] = useState(null);
    const [gatepassStatus, setGatepassStatus] = useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(50);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [user_data, setUserAllData] = React.useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showActiveModal, setShowActiveModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showFollowupModal, setShowFollowupModal] = React.useState(false);
    const [activemodalUserid, setactivemodalUserid] = React.useState({});
    const [deleteModalUserid, setDeleteModalUserid] = React.useState(null);
    const [followupModalUserId, setFollowupModalUserId] = React.useState(null);
    const [deleteReason, setDeleteReason] = React.useState('');
    const [followupDetails, setFollowupDetails] = React.useState({
        followup_date: '',
        followup_time: '',
        notes: '',
        next_followup_date: '',
        next_followup_time: '',
        status: 0
    });
    const [msg, setmsg] = React.useState('');
    const [courses, setCourses] = React.useState([]);
    const [stats, setStats] = React.useState({
        total_enquiries: 0,
        total_admissions: 0,
        active_admissions: 0,
        completed_admissions: 0,
        total_fees_collected: 0,
        total_fees_pending: 0
    });
    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All Users");
    const dropdownRef = useRef(null);

    const userTypeLabels = {
        0: 'Admin',
        1: 'User',
        2: 'Guard',
        3: 'Society Admin',
        4: 'Society Sub Admin',
        5: 'Student Enquiry',
        6: 'Student Admitted'
    };

    const admissionTypeLabels = {
        0: 'Enquiry',
        1: 'Admission'
    };

    const studentStatusLabels = {
        0: 'Enquiry Pending',
        1: 'Enquiry Converted',
        2: 'Enquiry Rejected',
        3: 'Admission Active',
        4: 'Admission Completed',
        5: 'Admission Discontinued'
    };

    const followupStatusLabels = {
        0: 'Pending',
        1: 'Contacted',
        2: 'Not Reachable',
        3: 'Interested',
        4: 'Not Interested',
        5: 'Converted'
    };

    useEffect(() => {
        // Simulate API loading with static data
        const timer = setTimeout(() => {
            setUserAllData(STATIC_USER_DATA);
            setStats(STATIC_STATS);
            setCourses(STATIC_COURSES);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleSelect = (option, data) => {
        setSelectedOption(option);
        setOpen(false);
        if (data !== undefined) {
            setUserAllData(data);
        }
    };

    const fetchAllUsers = () => {
        setUserAllData(STATIC_USER_DATA);
        setSelectedOption("All Users");
    };

    const fetchStudents = () => {
        const students = STATIC_USER_DATA.filter(user =>
            user && (user.user_type === 5 || user.user_type === 6)
        );
        setUserAllData(students);
        setSelectedOption("Students");
    };

    const fetchEnquiries = () => {
        const enquiries = STATIC_USER_DATA.filter(user =>
            user && user.user_type === 5
        );
        setUserAllData(enquiries);
        setSelectedOption("Enquiries");
    };

    const fetchAdmissions = () => {
        const admissions = STATIC_USER_DATA.filter(user =>
            user && user.user_type === 6
        );
        setUserAllData(admissions);
        setSelectedOption("Admissions");
    };

    // Static simulation: convert enquiry to admission
    const convertEnquiryToAdmission = (id) => {
        if (window.confirm('Are you sure you want to convert this enquiry to admission?')) {
            setUserAllData(prev =>
                prev.map(user => {
                    if (user.user_id === id) {
                        return {
                            ...user,
                            user_type: 6,
                            admission_type: 1,
                            student_status: 3,
                            date_of_admission: new Date().toISOString().split('T')[0],
                            followup_status: 5
                        };
                    }
                    return user;
                })
            );

            // Update stats
            setStats(prev => ({
                ...prev,
                total_enquiries: Math.max(0, prev.total_enquiries - 1),
                total_admissions: prev.total_admissions + 1,
                active_admissions: prev.active_admissions + 1
            }));

            alert('Enquiry converted to admission successfully!');
        }
    };

    // Static simulation: delete user
    const deleteStudent = (id, reason) => {
        setUserAllData(prev => prev.filter(user => user.user_id !== id));

        const deletedUser = STATIC_USER_DATA.find(u => u.user_id === id);
        if (deletedUser && (deletedUser.user_type === 5 || deletedUser.user_type === 6)) {
            setStats(prev => {
                const updated = { ...prev };
                if (deletedUser.user_type === 5) {
                    updated.total_enquiries = Math.max(0, updated.total_enquiries - 1);
                } else {
                    updated.total_admissions = Math.max(0, updated.total_admissions - 1);
                    if (deletedUser.student_status === 3) {
                        updated.active_admissions = Math.max(0, updated.active_admissions - 1);
                    }
                    if (deletedUser.student_status === 4) {
                        updated.completed_admissions = Math.max(0, updated.completed_admissions - 1);
                    }
                    if (deletedUser.fees_pending) {
                        updated.total_fees_pending = Math.max(0, updated.total_fees_pending - deletedUser.fees_pending);
                    }
                }
                return updated;
            });
        }

        alert('User deleted successfully');
    };

    // Static simulation: update user status
    const updateUserStatus = (userId, statusData) => {
        setUserAllData(prev =>
            prev.map(user => {
                if (user.user_id === userId) {
                    const updated = { ...user };
                    if (statusData.parkomStatus !== null) {
                        updated.parkom_active_flag = statusData.parkomStatus;
                    }
                    if (statusData.gatepassStatus !== null) {
                        updated.gatepass_active_flag = statusData.gatepassStatus;
                    }
                    return updated;
                }
                return user;
            })
        );
        alert('Status updated successfully!');
    };

    // Static simulation: update follow-up
    const updateFollowup = (id, followupData) => {
        setUserAllData(prev =>
            prev.map(user => {
                if (user.user_id === id) {
                    return {
                        ...user,
                        last_followup_date: followupData.followup_date,
                        last_followup_time: followupData.followup_time,
                        followup_notes: followupData.notes,
                        next_followup_date: followupData.next_followup_date,
                        next_followup_time: followupData.next_followup_time,
                        followup_status: followupData.status
                    };
                }
                return user;
            })
        );
        alert('Follow-up updated successfully!');
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleAction = (action, user) => {
        if (!user || !user.user_id) {
            console.error('Invalid user data:', user);
            return;
        }

        if (action === 'View') {
            let encode_user_id = base64_encode(user.user_id.toString());
            navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);
        } else if (action === 'Edit') {
            let encode_user_id = base64_encode(user.user_id.toString());
            navigate(APP_PREFIX_PATH + `/edit-user/${encode_user_id}`);
        } else if (action === 'Activate/Deactivate') {
            setShowActiveModal(true);
            setactivemodalUserid({
                user_id: user.user_id,
                status: user.active_flag,
                user_side: user.user_side,
                parkom_active_flag: user.parkom_active_flag,
                gatepass_active_flag: user.gatepass_active_flag
            });

            if (user.user_side === 1) {
                setmsg(user.parkom_active_flag == 0 ? 1 : 0);
                setParkomStatus(user.parkom_active_flag == 0 ? 1 : 0);
            } else if (user.user_side === 2) {
                setmsg(user.gatepass_active_flag == 0 ? 1 : 0);
                setGatepassStatus(user.gatepass_active_flag == 0 ? 1 : 0);
            } else if (user.user_side === 3) {
                setParkomStatus(user.parkom_active_flag);
                setGatepassStatus(user.gatepass_active_flag);
            }
        } else if (action === 'Delete') {
            setDeleteModalUserid(user.user_id);
            setDeleteReason('');
            setShowDeleteModal(true);
        } else if (action === 'Convert to Admission') {
            convertEnquiryToAdmission(user.user_id);
        } else if (action === 'Update Follow-up') {
            setFollowupModalUserId(user.user_id);
            setFollowupDetails({
                followup_date: user.last_followup_date || '',
                followup_time: user.last_followup_time || '',
                notes: user.followup_notes || '',
                next_followup_date: user.next_followup_date || '',
                next_followup_time: user.next_followup_time || '',
                status: user.followup_status || 0
            });
            setShowFollowupModal(true);
        }
        handleClose();
    };

    const handleActivateDeactivate = () => {
        if (activemodalUserid && activemodalUserid.user_id) {
            const { user_id, user_side } = activemodalUserid;

            const newParkomStatus = user_side === 1 || user_side === 3 ? parkomStatus : null;
            const newGatepassStatus = user_side === 2 || user_side === 3 ? gatepassStatus : null;

            updateUserStatus(user_id, {
                parkomStatus: newParkomStatus,
                gatepassStatus: newGatepassStatus,
            });

            setShowActiveModal(false);
        }
    };

    const handleDeleteUser = () => {
        if (!deleteReason.trim()) {
            alert('Please provide a reason for deletion');
            return;
        }

        if (deleteModalUserid) {
            deleteStudent(deleteModalUserid, deleteReason);
            setShowDeleteModal(false);
            setDeleteReason('');
        }
    };

    const handleUpdateFollowup = () => {
        if (followupModalUserId) {
            updateFollowup(followupModalUserId, followupDetails);
            setShowFollowupModal(false);
            setFollowupModalUserId(null);
            setFollowupDetails({
                followup_date: '',
                followup_time: '',
                notes: '',
                next_followup_date: '',
                next_followup_time: '',
                status: 0
            });
        }
    };

    // Safe array check before filtering
    const filteredUsers = Array.isArray(user_data)
        ? user_data.filter((user) => {
            if (!user) return false;

            const lowercasedTerm = searchQuery.toLowerCase();

            const searchFields = [
                user.name?.toLowerCase() || '',
                user.email?.toLowerCase() || '',
                user.mobile ? String(user.mobile).toLowerCase() : '',
                user.parent_contact ? String(user.parent_contact).toLowerCase() : '',
                user.course_name?.toLowerCase() || '',
                user.qualification?.toLowerCase() || '',
                user.createtime ? String(user.createtime).toLowerCase() : '',
                user.user_type ? userTypeLabels[user.user_type]?.toLowerCase() || '' : '',
                user.admission_type !== undefined && user.admission_type !== null ? admissionTypeLabels[user.admission_type]?.toLowerCase() || '' : '',
                user.student_status !== undefined && user.student_status !== null ? studentStatusLabels[user.student_status]?.toLowerCase() || '' : ''
            ];

            return searchFields.some(field => field && field.includes(lowercasedTerm));
        })
        : [];

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 0: return '#FF9800'; // Enquiry Pending - Orange
            case 1: return '#2196F3'; // Enquiry Converted - Blue
            case 2: return '#F44336'; // Enquiry Rejected - Red
            case 3: return '#4CAF50'; // Admission Active - Green
            case 4: return '#9C27B0'; // Admission Completed - Purple
            case 5: return '#607D8B'; // Admission Discontinued - Grey
            default: return '#757575';
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : '₹0';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <span style={{ marginLeft: '16px' }}>Loading user data...</span>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
                <Button
                    variant="contained"
                    onClick={fetchAllUsers}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

const menuStyle = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #f0f0f0",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#ffffff",
  transition: "all 0.3s ease"
};

const optionIcons = {
  "All Users": <PersonOutline fontSize="small" />,
  "Students": <School fontSize="small" />,
  "Enquiries": <QueryBuilder fontSize="small" />,
  "Admissions": <PersonAdd fontSize="small" />,
};



    return (
        <>
            <div className="col-xl-12" style={{  borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins', lineHeight: '1.167', marginBottom: '5px' }}>
                    Manage Users & Students
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0' }}>
                    View and manage all users including students, enquiries, and admissions
                </p>
                </div>

                {/* Statistics Dashboard */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginTop: '20px',
                }}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f0f9ff' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#0284c7' }}>Total Enquiries</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#0369a1' }}>
                            {stats.total_enquiries || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#16a34a' }}>Total Admissions</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#15803d' }}>
                            {stats.total_admissions || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#fff7ed' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#ea580c' }}>Fees Collected</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#c2410c' }}>
                            {formatCurrency(stats.total_fees_collected)}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#fef2f2' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#dc2626' }}>Fees Pending</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#b91c1c' }}>
                            {formatCurrency(stats.total_fees_pending)}
                        </p>
                    </Paper>
                </div>
            </div>

            <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2, flex: 1 }}
                    id="input-search-profile"
                    placeholder="Search by name, mobile, course, qualification..."
                    onChange={handleSearch}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                />
                
                <div style={{ position: "relative", display: "inline-block", marginLeft: "20px" }} ref={dropdownRef}>
                    <button
                        className="btn "
                        onClick={handleToggle}
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            // background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                            background: '#1d2d46',
                            color: "#ffffff",
                            border: 'none'
                        }}
                    >
                         {optionIcons[selectedOption]}
                           {selectedOption}
                               <ArrowDropDown />
                    </button>
                    {open && (
                        <div style={{
                            position: "absolute",
                            top: "45px",
                            left: "-8px",
                            background: "#0f172a",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                            borderRadius: "10px",
                            width: "170px",
                            zIndex: 10,
                            overflow: 'hidden'
                        }}>
                            <ul style={{ listStyle: "none", padding: "0", margin: 0 }}>
                               <li
                               style={menuStyle}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#060e82b3";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.paddingLeft = "22px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "#82b2f9";
                                  e.currentTarget.style.paddingLeft = "16px";
                                }}
                                onClick={() => fetchAllUsers()}
                              >
                            <PersonOutline fontSize="small" />
                                   All Users
                             </li>
                               <li
                               style={menuStyle}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#060e82b3";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.paddingLeft = "22px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "#82b2f9";
                                  e.currentTarget.style.paddingLeft = "16px";
                                }}
                                onClick={() => fetchStudents()}
                              >
                            <School fontSize="small" /> Students
                                </li>
                                <li
                               style={menuStyle}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#060e82b3";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.paddingLeft = "22px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "#82b2f9";
                                  e.currentTarget.style.paddingLeft = "16px";
                                }}
                                onClick={() => fetchEnquiries()}
                              >
                            <QueryBuilder fontSize="small" /> Enquiries
                                </li>
                                <li
                               style={menuStyle}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#060e82b3";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.paddingLeft = "22px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "#82b2f9";
                                  e.currentTarget.style.paddingLeft = "16px";
                                }}
                                onClick={() => fetchAdmissions() }
                              >
                                    <PersonAdd fontSize="small" /> Admissions
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </Box>

            {filteredUsers.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                // backgroundColor: '#f8fafc',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                color: '#ffffffbb',
                                                borderBottom: '1px solid #e5e7eb'
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.user_id || index}
                                        style={{
                                          
                                        }}
                                    >
                                        <TableCell style={{ textAlign: 'center', color: '#ffffff' }}>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button
                                                className="btn btn-primary"
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index)}
                                                style={{
                                                    width: '100px',
                                                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                                    border: 'none',
                                                    fontSize: '13px',
                                                    padding: '6px 12px',
                                                    
                                                }}
                                            >
                                                Actions <ArrowDropDown />
                                            </Button>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: 300,
                                                        width: '200px',
                                                    },
                                                }}
                                            >
                                                <MenuItem
                                                    onClick={() => handleAction('View', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <Visibility style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    View Details
                                                </MenuItem>

                                                {row.user_type === 5 && (
                                                    <MenuItem
                                                        onClick={() => handleAction('Convert to Admission', row)}
                                                        className="menu-icons"
                                                        style={{ fontSize: '14px', color: '#4CAF50' }}
                                                    >
                                                        <PersonAdd style={{ marginRight: '8px', fontSize: '18px' }} />
                                                        Convert to Admission
                                                    </MenuItem>
                                                )}

                                                {(row.user_type === 5 || row.user_type === 6) && (
                                                    <MenuItem
                                                        onClick={() => handleAction('Update Follow-up', row)}
                                                        className="menu-icons"
                                                        style={{ fontSize: '14px', color: '#FF9800' }}
                                                    >
                                                        <FollowTheSigns style={{ marginRight: '8px', fontSize: '18px' }} />
                                                        Update Follow-up
                                                    </MenuItem>
                                                )}

                                                <MenuItem
                                                    onClick={() => handleAction('Edit', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <Edit style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Edit
                                                </MenuItem>

                                                {row.user_type !== 5 && row.user_type !== 6 && (
                                                    <MenuItem
                                                        onClick={() => handleAction('Activate/Deactivate', row)}
                                                        className="menu-icons"
                                                        style={{ fontSize: '14px' }}
                                                    >
                                                        <ToggleOff style={{ marginRight: '8px', fontSize: '18px' }} />
                                                        Active/Deactive
                                                    </MenuItem>
                                                )}

                                                <MenuItem
                                                    onClick={() => handleAction('Delete', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px', color: '#f44336' }}
                                                >
                                                    <Delete style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', fontWeight: '500' }}>
                                            {row.name || 'N/A'}
                                        </TableCell>

                                       <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '15px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: row.user_type === 5 || row.user_type === 6 ? '#cde0ee' : '#f3e8ff',
                                                    color: row.user_type === 5 || row.user_type === 6 ? '#1976d2' : '#7c3aed'
                                                }}>
                                                    {userTypeLabels[row.user_type] || 'Unknown'}
                                                </span>
                                            </div>
                                        </TableCell> 
                                            
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.admission_type !== undefined && row.admission_type !== null ? (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: row.admission_type === 0 ? '#f3e9b7f4' : '#2e6c4c',
                                                    color: row.admission_type === 0 ? '#856404' : '#7bd3b7'
                                                }}>
                                                    {admissionTypeLabels[row.admission_type] || 'N/A'}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#d3d4d6' }}>
                                            {row.course_name || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#d3d4d6' }}>
                                            {row.qualification || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', fontWeight: '500' }}>
                                            {row.mobile || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.parent_contact || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', fontWeight: '600', color: '#059669' }}>
                                            {row.total_fees ? `₹${parseFloat(row.total_fees).toLocaleString('en-IN')}` : 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', fontWeight: '600' }}>
                                            {row.fees_pending ? (
                                                <span style={{
                                                    color: parseFloat(row.fees_pending) > 0 ? '#dc2626' : '#059669'
                                                }}>
                                                    ₹{parseFloat(row.fees_pending).toLocaleString('en-IN')}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>

                                        <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                {row.student_status !== undefined && row.student_status !== null ? (
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        backgroundColor: getStatusBadgeColor(row.student_status) + '20',
                                                        color: getStatusBadgeColor(row.student_status)
                                                    }}>
                                                        {studentStatusLabels[row.student_status] || 'N/A'}
                                                    </span>
                                                ) : 'N/A'}
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#898e97' }}>
                                            {row.date_of_admission ? new Date(row.date_of_admission).toLocaleDateString('en-IN') : 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#898e97', fontSize: '13px' }}>
                                            {row.createtime ? new Date(row.createtime).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 24px',
                        // backgroundColor: '#f9fafb',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{ margin: 0, color: '#cfcfcf', fontSize: '14px' }}>
                            {`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}
                        </p>
                        <div>
                            <button
                                onClick={() => handleChangePage(null, page - 1)}
                                disabled={page === 0}
                                style={{ marginRight: '8px' , border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' , backgroundColor : 'transparent' }}
                            >
                                {'<'}
                            </button>
                            <button
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                                style={{ marginRight: '8px' , border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: (page + 1) * rowsPerPage >= filteredUsers.length ? 'not-allowed' : 'pointer' , backgroundColor : 'transparent' }}
                            >
                                {'>'}
                            </button>
                        </div>
                            
                    </div>
                </Paper>
            ) : (
                <Paper sx={{ width: '100%', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
                    <div style={{ color: '#9ca3af', fontSize: '16px' }}>
                        <ErrorOutline style={{ fontSize: '48px', marginBottom: '16px', color: '#d1d5db' }} />
                        <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '500' }}>No Data Available</p>
                        <p>No users found. Try changing your search or filter criteria.</p>
                    </div>
                </Paper>
            )}

            {/* ==================== ACTIVATE/DEACTIVATE MODAL ==================== */}
            <Modal show={showActiveModal} onHide={() => setShowActiveModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Modal.Title style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                        <ToggleOff style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Activate / Deactivate User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '24px' }}>
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        Toggle the status for this user below:
                    </p>

                    {(activemodalUserid.user_side === 1 || activemodalUserid.user_side === 3) && (
                        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                            <span style={{ fontWeight: '500', color: '#374151' }}>Parkom Status</span>
                            <select
                                value={parkomStatus ?? 0}
                                onChange={(e) => setParkomStatus(parseInt(e.target.value))}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    minWidth: '140px'
                                }}
                            >
                                <option value={0}>Deactivated</option>
                                <option value={1}>Activated</option>
                            </select>
                        </div>
                    )}

                    {(activemodalUserid.user_side === 2 || activemodalUserid.user_side === 3) && (
                        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                            <span style={{ fontWeight: '500', color: '#374151' }}>Gatepass Status</span>
                            <select
                                value={gatepassStatus ?? 0}
                                onChange={(e) => setGatepassStatus(parseInt(e.target.value))}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    minWidth: '140px'
                                }}
                            >
                                <option value={0}>Deactivated</option>
                                <option value={1}>Activated</option>
                            </select>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px' }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowActiveModal(false)}
                        style={{ marginRight: '8px', borderRadius: '6px', textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleActivateDeactivate}
                        style={{
                            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            textTransform: 'none',
                            padding: '8px 24px'
                        }}
                    >
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ==================== DELETE MODAL ==================== */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Modal.Title style={{ fontSize: '18px', fontWeight: '600', color: '#dc2626' }}>
                        <Delete style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Delete User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '24px' }}>
                    <Alert severity="warning" style={{ marginBottom: '16px' }}>
                        <AlertTitle>Warning</AlertTitle>
                        This action cannot be undone. The user will be permanently removed from the system.
                    </Alert>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                            Reason for Deletion <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <textarea
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Please provide a reason for deleting this user..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    {!deleteReason.trim() && (
                        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                            * Reason is required
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px' }}>
                    <Button
                        variant="outlined"
                        onClick={() => { setShowDeleteModal(false); setDeleteReason(''); }}
                        style={{ marginRight: '8px', borderRadius: '6px', textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDeleteUser}
                        style={{
                            background: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            textTransform: 'none',
                            padding: '8px 24px'
                        }}
                    >
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ==================== FOLLOW-UP MODAL ==================== */}
            <Modal show={showFollowupModal} onHide={() => setShowFollowupModal(false)} centered size="lg">
                <Modal.Header closeButton style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Modal.Title style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                        <FollowTheSigns style={{ marginRight: '8px', verticalAlign: 'middle', color: '#FF9800' }} />
                        Update Follow-up Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                                Last Follow-up Date
                            </label>
                            <input
                                type="date"
                                value={followupDetails.followup_date}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, followup_date: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                                Last Follow-up Time
                            </label>
                            <input
                                type="time"
                                value={followupDetails.followup_time}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, followup_time: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                                Follow-up Notes
                            </label>
                            <textarea
                                value={followupDetails.notes}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, notes: e.target.value })}
                                placeholder="Enter follow-up notes..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                                Next Follow-up Date
                            </label>
                            <input
                                type="date"
                                value={followupDetails.next_followup_date}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, next_followup_date: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                                Next Follow-up Time
                            </label>
                            <input
                                type="time"
                                value={followupDetails.next_followup_time}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, next_followup_time: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
                                Follow-up Status
                            </label>
                            <select
                                value={followupDetails.status}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, status: parseInt(e.target.value) })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {Object.entries(followupStatusLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px' }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setShowFollowupModal(false);
                            setFollowupModalUserId(null);
                            setFollowupDetails({
                                followup_date: '',
                                followup_time: '',
                                notes: '',
                                next_followup_date: '',
                                next_followup_time: '',
                                status: 0
                            });
                        }}
                        style={{ marginRight: '8px', borderRadius: '6px', textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateFollowup}
                        style={{
                            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            textTransform: 'none',
                            padding: '8px 24px'
                        }}
                    >
                        <Update style={{ marginRight: '6px', fontSize: '16px' }} />
                        Update Follow-up
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default InquaryData;