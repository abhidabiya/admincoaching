import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { IconSticker2 , IconChecklist  } from '@tabler/icons-react';
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
    FollowTheSigns,
    Task,
    CheckCircle,
    RadioButtonUnchecked,
    AccessTime,
    Event,
    Notes,
    PriorityHigh,
    LowPriority
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
import { CircularProgress, Alert, AlertTitle, Typography, Chip, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Checkbox, TextField, Select, MenuItem as MuiMenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';

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

// ===================== DAILY TASK PAD STATIC DATA =====================

const STATIC_DAILY_TASKS = [
    {
        task_id: 1,
        title: 'Follow up with Aarav Sharma',
        description: 'Call regarding B.Tech CS admission',
        task_type: 'followup',
        priority: 'high',
        status: 'pending',
        due_date: '2025-02-03',
        due_time: '14:00',
        assigned_to: 'Self',
        related_user_id: 101,
        related_user_name: 'Aarav Sharma',
        completed: false,
        created_at: '2025-02-02T09:00:00'
    },
    {
        task_id: 2,
        title: 'Collect fees from Ananya Gupta',
        description: 'Second installment of ₹55,000',
        task_type: 'fees',
        priority: 'high',
        status: 'pending',
        due_date: '2025-02-15',
        due_time: '12:00',
        assigned_to: 'Self',
        related_user_id: 106,
        related_user_name: 'Ananya Gupta',
        completed: false,
        created_at: '2025-02-01T11:30:00'
    },
    {
        task_id: 3,
        title: 'Send admission confirmation to Vikram Singh',
        description: 'Email admission letter and fee receipt',
        task_type: 'documentation',
        priority: 'medium',
        status: 'completed',
        due_date: '2025-02-01',
        due_time: '10:00',
        assigned_to: 'Self',
        related_user_id: 105,
        related_user_name: 'Vikram Singh',
        completed: true,
        created_at: '2025-01-31T16:00:00'
    },
    {
        task_id: 4,
        title: 'Schedule campus visit for Karthik Nair',
        description: 'M.Tech Data Science program tour',
        task_type: 'followup',
        priority: 'medium',
        status: 'pending',
        due_date: '2025-02-03',
        due_time: '15:00',
        assigned_to: 'Self',
        related_user_id: 107,
        related_user_name: 'Karthik Nair',
        completed: false,
        created_at: '2025-02-02T08:00:00'
    },
    {
        task_id: 5,
        title: 'Update Pooja Deshmukh fee records',
        description: 'Update payment schedule in system',
        task_type: 'fees',
        priority: 'low',
        status: 'pending',
        due_date: '2025-02-05',
        due_time: '11:00',
        assigned_to: 'Self',
        related_user_id: 112,
        related_user_name: 'Pooja Deshmukh',
        completed: false,
        created_at: '2025-02-02T10:00:00'
    },
    {
        task_id: 6,
        title: 'Prepare monthly admission report',
        description: 'January 2025 admission statistics',
        task_type: 'documentation',
        priority: 'low',
        status: 'pending',
        due_date: '2025-02-05',
        due_time: '17:00',
        assigned_to: 'Self',
        related_user_id: null,
        related_user_name: null,
        completed: false,
        created_at: '2025-02-01T09:00:00'
    },
    {
        task_id: 7,
        title: 'Call Nisha Agarwal for follow-up',
        description: 'Was not reachable last time, try again',
        task_type: 'followup',
        priority: 'medium',
        status: 'pending',
        due_date: '2025-02-07',
        due_time: '10:00',
        assigned_to: 'Self',
        related_user_id: 114,
        related_user_name: 'Nisha Agarwal',
        completed: false,
        created_at: '2025-02-02T14:00:00'
    },
    {
        task_id: 8,
        title: 'Verify Amit Tiwari documents',
        description: 'Check all submitted certificates',
        task_type: 'documentation',
        priority: 'high',
        status: 'completed',
        due_date: '2025-01-30',
        due_time: '14:00',
        assigned_to: 'Self',
        related_user_id: 115,
        related_user_name: 'Amit Tiwari',
        completed: true,
        created_at: '2025-01-29T10:00:00'
    }
];

const STATIC_TASK_STATS = {
    total_tasks: 8,
    completed_tasks: 2,
    pending_tasks: 6,
    high_priority_tasks: 3,
    today_tasks: 2,
    overdue_tasks: 0
};

// ===================== STATIC DATA END =====================

const TaskManagement = () => {
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

    // Daily Task Pad States
    const [dailyTasks, setDailyTasks] = useState([]);
    const [taskStats, setTaskStats] = useState({
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        high_priority_tasks: 0,
        today_tasks: 0,
        overdue_tasks: 0
    });
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        task_type: 'followup',
        priority: 'medium',
        due_date: '',
        due_time: '',
        related_user_id: null
    });
    const [taskFilter, setTaskFilter] = useState('all');
    const [taskSearchQuery, setTaskSearchQuery] = useState('');

    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All Users");
    const dropdownRef = useRef(null);

    const menuStyle = {
        padding: "12px 16px",
        cursor: "pointer",
        borderBottom: "1px solid #dad9d9",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#000",
        transition: "all 0.2s ease"
    };

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

    const taskTypeLabels = {
        followup: 'Follow-up Call',
        fees: 'Fees Collection',
        documentation: 'Documentation',
        meeting: 'Meeting',
        other: 'Other'
    };

    const priorityLabels = {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setUserAllData(STATIC_USER_DATA);
            setStats(STATIC_STATS);
            setCourses(STATIC_COURSES);
            setDailyTasks(STATIC_DAILY_TASKS);
            setTaskStats(STATIC_TASK_STATS);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

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

            setStats(prev => ({
                ...prev,
                total_enquiries: Math.max(0, prev.total_enquiries - 1),
                total_admissions: prev.total_admissions + 1,
                active_admissions: prev.active_admissions + 1
            }));

            alert('Enquiry converted to admission successfully!');
        }
    };

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

    const toggleTaskCompletion = (taskId) => {
        setDailyTasks(prev =>
            prev.map(task => {
                if (task.task_id === taskId) {
                    const newCompleted = !task.completed;
                    return {
                        ...task,
                        completed: newCompleted,
                        status: newCompleted ? 'completed' : 'pending'
                    };
                }
                return task;
            })
        );

        setTaskStats(prev => {
            const task = dailyTasks.find(t => t.task_id === taskId);
            if (task) {
                const wasCompleted = task.completed;
                return {
                    ...prev,
                    completed_tasks: wasCompleted ? Math.max(0, prev.completed_tasks - 1) : prev.completed_tasks + 1,
                    pending_tasks: wasCompleted ? prev.pending_tasks + 1 : Math.max(0, prev.pending_tasks - 1)
                };
            }
            return prev;
        });
    };

    const deleteTask = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const taskToDelete = dailyTasks.find(t => t.task_id === taskId);
            setDailyTasks(prev => prev.filter(task => task.task_id !== taskId));

            if (taskToDelete) {
                setTaskStats(prev => ({
                    ...prev,
                    total_tasks: Math.max(0, prev.total_tasks - 1),
                    completed_tasks: taskToDelete.completed ? Math.max(0, prev.completed_tasks - 1) : prev.completed_tasks,
                    pending_tasks: !taskToDelete.completed ? Math.max(0, prev.pending_tasks - 1) : prev.pending_tasks,
                    high_priority_tasks: taskToDelete.priority === 'high' ? Math.max(0, prev.high_priority_tasks - 1) : prev.high_priority_tasks
                }));
            }
        }
    };

    const handleAddTask = () => {
        if (!newTask.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        const relatedUser = newTask.related_user_id 
            ? STATIC_USER_DATA.find(u => u.user_id === newTask.related_user_id)
            : null;

        const taskToAdd = {
            task_id: Date.now(),
            title: newTask.title,
            description: newTask.description,
            task_type: newTask.task_type,
            priority: newTask.priority,
            status: 'pending',
            due_date: newTask.due_date,
            due_time: newTask.due_time,
            assigned_to: 'Self',
            related_user_id: newTask.related_user_id,
            related_user_name: relatedUser ? relatedUser.name : null,
            completed: false,
            created_at: new Date().toISOString()
        };

        setDailyTasks(prev => [taskToAdd, ...prev]);

        setTaskStats(prev => ({
            ...prev,
            total_tasks: prev.total_tasks + 1,
            pending_tasks: prev.pending_tasks + 1,
            high_priority_tasks: newTask.priority === 'high' ? prev.high_priority_tasks + 1 : prev.high_priority_tasks
        }));

        setNewTask({
            title: '',
            description: '',
            task_type: 'followup',
            priority: 'medium',
            due_date: '',
            due_time: '',
            related_user_id: null
        });

        setShowAddTaskModal(false);
        alert('Task added successfully!');
    };

    const getFilteredTasks = () => {
        let filtered = [...dailyTasks];

        if (taskFilter === 'pending') {
            filtered = filtered.filter(t => !t.completed);
        } else if (taskFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (taskFilter === 'high') {
            filtered = filtered.filter(t => t.priority === 'high');
        } else if (taskFilter === 'followup') {
            filtered = filtered.filter(t => t.task_type === 'followup');
        } else if (taskFilter === 'fees') {
            filtered = filtered.filter(t => t.task_type === 'fees');
        } else if (taskFilter === 'documentation') {
            filtered = filtered.filter(t => t.task_type === 'documentation');
        }

        if (taskSearchQuery) {
            const query = taskSearchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(query) ||
                (t.description && t.description.toLowerCase().includes(query)) ||
                (t.related_user_name && t.related_user_name.toLowerCase().includes(query))
            );
        }

        return filtered;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#757575';
        }
    };

    const getTaskTypeIcon = (type) => {
        switch (type) {
            case 'followup': return <FollowTheSigns fontSize="small" />;
            case 'fees': return <Notes fontSize="small" />;
            case 'documentation': return <Update fontSize="small" />;
            case 'meeting': return <Event fontSize="small" />;
            default: return <Task fontSize="small" />;
        }
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
            navigate(`/view-user/${encode_user_id}`);
        } else if (action === 'Edit') {
            let encode_user_id = base64_encode(user.user_id.toString());
            navigate(`/edit-user/${encode_user_id}`);
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

    const filteredUsers = Array.isArray(user_data)
        ? user_data.filter((user) => {
            if (!user) return false;

            const lowercasedTerm = searchQuery.toLowerCase();

            const searchFields = [
                user.name ? user.name.toLowerCase() : '',
                user.email ? user.email.toLowerCase() : '',
                user.mobile ? String(user.mobile).toLowerCase() : '',
                user.parent_contact ? String(user.parent_contact).toLowerCase() : '',
                user.course_name ? user.course_name.toLowerCase() : '',
                user.qualification ? user.qualification.toLowerCase() : '',
                user.createtime ? String(user.createtime).toLowerCase() : '',
                user.user_type ? (userTypeLabels[user.user_type] || '').toLowerCase() : '',
                user.admission_type !== undefined && user.admission_type !== null ? (admissionTypeLabels[user.admission_type] || '').toLowerCase() : '',
                user.student_status !== undefined && user.student_status !== null ? (studentStatusLabels[user.student_status] || '').toLowerCase() : ''
            ];

            return searchFields.some(field => field && field.includes(lowercasedTerm));
        })
        : [];

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 0: return '#FF9800';
            case 1: return '#2196F3';
            case 2: return '#F44336';
            case 3: return '#4CAF50';
            case 4: return '#9C27B0';
            case 5: return '#607D8B';
            default: return '#757575';
        }
    };

    const formatCurrency = (amount) => {
        return amount ? '₹' + parseFloat(amount).toLocaleString('en-IN') : '₹0';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return 'N/A';
        }
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

    const filteredTasks = getFilteredTasks();

    return (
        <>

            {/* Daily Task Pad Section - Same Format as Statistics */}
            <div className="col-xl-12" style={{ borderRadius: '12px', padding: '10px', marginBottom: '20px'  }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' , backgroundColor: '#ffffff', padding: '10px 15px', borderRadius: '8px' }}>
                    <div>
                        <p style={{ fontSize: '1.25rem', color: '#232323', fontWeight: '600', fontFamily: 'Poppins', lineHeight: '1.167', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconChecklist style={{ color: '#31e5e2' }} />
                            Daily Task Pad
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0' }}>
                            Track and manage your daily tasks and follow-ups
                        </p>
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => setShowAddTaskModal(true)}
                        style={{
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            textTransform: 'none',
                            fontSize: '14px', 
                            backgroundColor: '#3268f1',
                        }}
                    >
                        Add New Task
                    </Button>
                </div>

                {/* Task Statistics Dashboard - Same Format as User Statistics */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    marginTop: '20px',
                }}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#5c6bc0' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#f8eae3' }}>Total Tasks</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#e2e2e2' }}>
                            {taskStats.total_tasks || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#66bb6a' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#f8eae3' }}>Completed</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#e2e2e2' }}>
                            {taskStats.completed_tasks || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#ffa726' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#f8eae3' }}>Pending</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#e2e2e2' }}>
                            {taskStats.pending_tasks || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#ef5350' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#f8eae3' }}>High Priority</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#e2e2e2' }}>
                            {taskStats.high_priority_tasks || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#26a69a' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#f8eae3' }}>Today's Tasks</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#e2e2e2' }}>
                            {taskStats.today_tasks || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#8d6e63' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#f8eae3' }}>Overdue</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#e2e2e2' }}>
                            {taskStats.overdue_tasks || 0}
                        </p>
                    </Paper>
                </div>

                {/* Task Filter and Search */}
                <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res" sx={{ mt: 2, gap: 2, flexWrap: 'wrap' }}>
                    <OutlinedInput
                        sx={{ pr: 1, pl: 2, flex: 1, minWidth: '200px' }}
                        id="input-search-tasks"
                        placeholder="Search tasks..."
                        value={taskSearchQuery}
                        onChange={(e) => setTaskSearchQuery(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[400]} />
                            </InputAdornment>
                        }
                        size="small"
                    />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' , padding: '15px 0' }}>
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'high', label: 'High Priority' },
                            { key: 'fees', label: 'Fees' },
                            { key: 'documentation', label: 'Docs' }
                        ].map((filter) => (
                            <Chip
                                key={filter.key}
                                label={filter.label}
                                onClick={() => setTaskFilter(filter.key)}
                                variant={taskFilter === filter.key ? 'filled' : 'outlined'}
                                size="small"
                                sx={{   
                                    backgroundColor: taskFilter === filter.key ? '#66a0ec' : 'transparent',
                                    color: taskFilter === filter.key ? '#fff' : '#dee0e0',
                                    borderColor: '#2265a0',
                                    '&:hover': {
                                        backgroundColor: taskFilter === filter.key ? '#4273f0fd' : 'rgba(78,158,157,0.1)'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Task List */}
                {filteredTasks.length === 0 ? (
                    <Paper sx={{ mt: 2, p: 3, textAlign: 'center', borderRadius: '8px' }}>
                        <Typography variant="body1" color="text.secondary">
                            No tasks found
                        </Typography>
                    </Paper>
                ) : (
                    <List sx={{ mt: 1 }}>
                        {filteredTasks.map((task) => {
                            if (!task) return null;

                            var isOverdue = false;
                            if (!task.completed && task.due_date) {
                                var todayDate = new Date();
                                todayDate.setHours(0, 0, 0, 0);
                                var dueDate = new Date(task.due_date);
                                dueDate.setHours(0, 0, 0, 0);
                                isOverdue = dueDate < todayDate;
                            }

                            return (
                                <ListItem
                                    key={task.task_id}
                                    sx={{
                                        bgcolor: task.completed ? 'rgba(76, 175, 80, 0.05)' : 'background.paper',
                                        mb: 1,
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: task.completed ? 'rgba(76,175,80,0.3)' : isOverdue ? 'rgba(244,67,54,0.3)' : 'divider',
                                        opacity: task.completed ? 0.7 : 1
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: '40px' }}>
                                        <Checkbox
                                            checked={task.completed || false}
                                            onChange={() => toggleTaskCompletion(task.task_id)}
                                            sx={{
                                                color: getPriorityColor(task.priority),
                                                '&.Mui-checked': { color: '#4caf50' }
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                    fontWeight: 500,
                                                    color: task.completed ? 'text.secondary' : 'text.primary'
                                                }}
                                            >
                                                {task.title || 'Untitled Task'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                                <Chip
                                                    icon={getTaskTypeIcon(task.task_type)}
                                                    label={taskTypeLabels[task.task_type] || task.task_type || 'Other'}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ height: '24px', fontSize: '11px' }}
                                                />
                                                <Chip
                                                    label={priorityLabels[task.priority] || 'Medium'}
                                                    size="small"
                                                    sx={{
                                                        height: '24px',
                                                        fontSize: '11px',
                                                        bgcolor: getPriorityColor(task.priority),
                                                        color: '#fff'
                                                    }}
                                                />
                                                {task.due_date && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <AccessTime sx={{ fontSize: '14px', color: isOverdue ? '#f44336' : 'text.secondary' }} />
                                                        <Typography variant="caption" sx={{ color: isOverdue ? '#f44336' : 'text.secondary' }}>
                                                            {formatDate(task.due_date)}
                                                            {task.due_time ? ' ' + task.due_time : ''}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {task.related_user_name && (
                                                    <Chip
                                                        label={task.related_user_name}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ height: '24px', fontSize: '11px' }}
                                                    />
                                                )}
                                                {task.description && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', width: '100%', mt: 0.5 }}>
                                                        {task.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteTask(task.task_id)}
                                            sx={{ color: '#f44336' }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </div>

            {/* Add Task Modal */}
           <Modal
    show={showAddTaskModal}
    onHide={() => setShowAddTaskModal(false)}
    centered
    size="lg"
>
    <Modal.Header
        closeButton
        style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "20px 24px"
        }}
    >
        <Modal.Title
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
                letterSpacing: "-0.4px"
            }}
        >
            <IconSticker2
                style={{
                    color: "#6366F1",
                    fontSize: "26px"
                }}
            />
            Create New Note
        </Modal.Title>
    </Modal.Header>

    <Modal.Body
        style={{
            padding: "16px 24px", /* Padding kam kiya */
            background: "#ffffff",
            maxHeight: "65vh", /* Height fix karne ke liye */
            overflowY: "auto"
        }}
    >
       {/* Note Title */}
        <div style={{ marginBottom: "12px" }}> {/* Margin kam kiya */}
            <label
                style={{
                    display: "block",
                    marginBottom: "6px", /* Margin kam kiya */
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151"
                }}
            >
                Note Title
            </label>

            <TextField
                fullWidth
                placeholder="Enter note title..."
                value={newTask.title}
                onChange={(e) =>
                    setNewTask((prev) => ({
                        ...prev,
                        title: e.target.value,
                    }))
                }
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px"
                    }
                }}
            />
        </div>

        {/* Write Your Note */}
        <div style={{ marginBottom: "12px" }}> {/* Margin kam kiya */}
            <label
                style={{
                    display: "block",
                    marginBottom: "6px", /* Margin kam kiya */
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151"
                }}
            >
                Write Your Note
            </label>

            <TextField
                fullWidth
                multiline
                rows={4} /* Rows 10 se 4 kar diye */
                placeholder="Start writing here..."
                value={newTask.description}
                onChange={(e) =>
                    setNewTask((prev) => ({
                        ...prev,
                        description: e.target.value,
                    }))
                }
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px"
                    }
                }}
            />
        </div>

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2, /* Gap thoda kam kiya */
                mt: 0 /* Margin top hata diya */
            }}
        >
            {/* Category */}
            <div>
                <label
                    style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}
                >
                    Category
                </label>

                <FormControl fullWidth>
                    <Select
                        value={newTask.task_type}
                        onChange={(e) =>
                            setNewTask((prev) => ({
                                ...prev,
                                task_type: e.target.value,
                            }))
                        }
                        displayEmpty
                        sx={{
                            borderRadius: "10px",
                            background: "#fff"
                        }}
                    >
                        <MuiMenuItem value="">Select Category</MuiMenuItem>
                        <MuiMenuItem value="personal">👤 Personal</MuiMenuItem>
                        <MuiMenuItem value="work">💼 Work</MuiMenuItem>
                        <MuiMenuItem value="study">📚 Study</MuiMenuItem>
                        <MuiMenuItem value="important">⭐ Important</MuiMenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* Pin Note */}
            <div>
                <label
                    style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}
                >
                    Pin Note
                </label>

                <FormControl fullWidth>
                    <Select
                        value={newTask.priority}
                        onChange={(e) =>
                            setNewTask((prev) => ({
                                ...prev,
                                priority: e.target.value,
                            }))
                        }
                        displayEmpty
                        sx={{
                            borderRadius: "10px",
                            background: "#fff"
                        }}
                    >
                        <MuiMenuItem value="">Select Option</MuiMenuItem>
                        <MuiMenuItem value="yes">📌 Yes</MuiMenuItem>
                        <MuiMenuItem value="no">No</MuiMenuItem>
                    </Select>
                </FormControl>
            </div>
        </Box>
    </Modal.Body>

    <Modal.Footer
        style={{
            borderTop: "1px solid #e5e7eb",
            padding: "12px 24px", /* Padding kam kiya */
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            background: "#fafafa"
        }}
    >
        <Button
            variant="outlined"
            onClick={() => setShowAddTaskModal(false)}
            style={{
                borderRadius: "10px",
                padding: "8px 22px",
                textTransform: "none",
                fontWeight: 600
            }}
        >
            Cancel
        </Button>

        <Button
            variant="contained"
            onClick={handleAddTask}
            style={{
                background: "#6366F1",
                color: "#fff",
                borderRadius: "10px",
                padding: "8px 24px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
                
            }}
        >
            Save Note
        </Button>
    </Modal.Footer>
</Modal>

            {/* Activate/Deactivate Modal */}
            <Modal
                show={showActiveModal}
                onHide={() => setShowActiveModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Activate / Deactivate User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {activemodalUserid.user_side === 3 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Parkom Status:</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant={parkomStatus === 1 ? 'contained' : 'outlined'}
                                    color="success"
                                    onClick={() => setParkomStatus(1)}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={parkomStatus === 0 ? 'contained' : 'outlined'}
                                    color="error"
                                    onClick={() => setParkomStatus(0)}
                                >
                                    Inactive
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {activemodalUserid.user_side === 3 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Gatepass Status:</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant={gatepassStatus === 1 ? 'contained' : 'outlined'}
                                    color="success"
                                    onClick={() => setGatepassStatus(1)}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={gatepassStatus === 0 ? 'contained' : 'outlined'}
                                    color="error"
                                    onClick={() => setGatepassStatus(0)}
                                >
                                    Inactive
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {(activemodalUserid.user_side === 1 || activemodalUserid.user_side === 2) && (
                        <Alert severity="info">
                            {msg === 1 ? 'This will activate the user.' : 'This will deactivate the user.'}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outlined" onClick={() => setShowActiveModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleActivateDeactivate}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert severity="warning">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Alert>
                    <TextField
                        label="Reason for deletion"
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        sx={{ mt: 2 }}
                        required
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Follow-up Modal */}
            <Modal
                show={showFollowupModal}
                onHide={() => setShowFollowupModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Follow-up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Follow-up Date"
                                type="date"
                                value={followupDetails.followup_date}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, followup_date: e.target.value })}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Follow-up Time"
                                type="time"
                                value={followupDetails.followup_time}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, followup_time: e.target.value })}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <TextField
                            label="Notes"
                            value={followupDetails.notes}
                            onChange={(e) => setFollowupDetails({ ...followupDetails, notes: e.target.value })}
                            fullWidth
                            size="small"
                            multiline
                            rows={3}
                        />
                        <FormControl size="small" fullWidth>
                            <InputLabel>Follow-up Status</InputLabel>
                            <Select
                                value={followupDetails.status}
                                label="Follow-up Status"
                                onChange={(e) => setFollowupDetails({ ...followupDetails, status: Number(e.target.value) })}
                            >
                                <MuiMenuItem value={0}>Pending</MuiMenuItem>
                                <MuiMenuItem value={1}>Contacted</MuiMenuItem>
                                <MuiMenuItem value={2}>Not Reachable</MuiMenuItem>
                                <MuiMenuItem value={3}>Interested</MuiMenuItem>
                                <MuiMenuItem value={4}>Not Interested</MuiMenuItem>
                                <MuiMenuItem value={5}>Converted</MuiMenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Next Follow-up Date"
                                type="date"
                                value={followupDetails.next_followup_date}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, next_followup_date: e.target.value })}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Next Follow-up Time"
                                type="time"
                                value={followupDetails.next_followup_time}
                                onChange={(e) => setFollowupDetails({ ...followupDetails, next_followup_time: e.target.value })}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outlined" onClick={() => setShowFollowupModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdateFollowup}>
                        Update Follow-up
                    </Button>
                </Modal.Footer>
            </Modal>
                    
        </>
    );
};

export default TaskManagement;