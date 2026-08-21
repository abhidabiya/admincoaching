import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { decode as base64_decode } from 'base-64';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
    Alert,
    AlertTitle,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Divider,
    IconButton
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    LocationOn as LocationIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';

const EditStudentUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [courses, setCourses] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        // Basic Information
        name: '',
        email: '',
        mobile: '',
        alternate_mobile: '',
        parent_name: '',
        parent_contact: '',
        date_of_birth: '',
        gender: '',
        
        // Address Information
        address: '',
        city: '',
        state: '',
        pincode: '',
        
        // Educational Information
        qualification: '',
        course_id: '',
        specialization: '',
        previous_institute: '',
        year_of_passing: '',
        
        // Admission Information
        admission_type: 0,
        student_status: 0,
        date_of_admission: '',
        total_fees: '',
        fees_paid: '',
        fees_pending: '',
        
        // Follow-up Information
        followup_status: 0,
        followup_date: '',
        followup_time: '',
        followup_notes: '',
        next_followup_date: '',
        next_followup_time: '',
        
        // Source Information
        source: '',
        reference_name: '',
        reference_contact: '',
        
        // Additional Information
        remarks: ''
    });

    const [originalData, setOriginalData] = useState({});

    // Status options
    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
    ];

    const admissionTypeOptions = [
        { value: 0, label: 'Enquiry' },
        { value: 1, label: 'Admission' }
    ];

    const studentStatusOptions = [
        { value: 0, label: 'Enquiry Pending' },
        { value: 1, label: 'Enquiry Converted' },
        { value: 2, label: 'Enquiry Rejected' },
        { value: 3, label: 'Admission Active' },
        { value: 4, label: 'Admission Completed' },
        { value: 5, label: 'Admission Discontinued' }
    ];

    const followupStatusOptions = [
        { value: 0, label: 'Pending' },
        { value: 1, label: 'Contacted' },
        { value: 2, label: 'Not Reachable' },
        { value: 3, label: 'Interested' },
        { value: 4, label: 'Not Interested' },
        { value: 5, label: 'Converted' }
    ];

    const sourceOptions = [
        { value: 1, label: 'Website' },
        { value: 2, label: 'Walk-in' },
        { value: 3, label: 'Reference' },
        { value: 4, label: 'Phone Call' },
        { value: 5, label: 'Social Media' },
        { value: 6, label: 'Advertisement' },
        { value: 7, label: 'Other' }
    ];

    const steps = ['Basic Information', 'Educational Details', 'Admission & Fees', 'Follow-up Details'];

    // Decode user ID from URL
    const getUserId = () => {
        try {
            return base64_decode(id);
        } catch (error) {
            console.error('Error decoding user ID:', error);
            return null;
        }
    };

    // Fetch user data by ID
    const fetchUserData = async () => {
        const userId = getUserId();
        if (!userId) {
            setError('Invalid user ID');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Fetch user details
            const userResponse = await axios.get(`${API_URL}get_student/${userId}`);
            
            if (userResponse.data && userResponse.data.success) {
                const userData = userResponse.data.data || userResponse.data.user;
                setOriginalData(userData);
                
                // Map API response to form data
                setFormData({
                    // Basic Information
                    name: userData.name || '',
                    email: userData.email || '',
                    mobile: userData.mobile || '',
                    alternate_mobile: userData.alternate_mobile || '',
                    parent_name: userData.parent_name || '',
                    parent_contact: userData.parent_contact || '',
                    date_of_birth: userData.date_of_birth?.split('T')[0] || '',
                    gender: userData.gender || '',
                    
                    // Address Information
                    address: userData.address || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    pincode: userData.pincode || '',
                    
                    // Educational Information
                    qualification: userData.qualification || '',
                    course_id: userData.course_id || '',
                    specialization: userData.specialization || '',
                    previous_institute: userData.previous_institute || '',
                    year_of_passing: userData.year_of_passing || '',
                    
                    // Admission Information
                    admission_type: userData.admission_type || 0,
                    student_status: userData.student_status || 0,
                    date_of_admission: userData.date_of_admission?.split('T')[0] || '',
                    total_fees: userData.total_fees || '',
                    fees_paid: userData.fees_paid || '',
                    fees_pending: userData.fees_pending || '',
                    
                    // Follow-up Information
                    followup_status: userData.followup_status || 0,
                    followup_date: userData.followup_date?.split('T')[0] || '',
                    followup_time: userData.followup_time || '',
                    followup_notes: userData.followup_notes || '',
                    next_followup_date: userData.next_followup_date?.split('T')[0] || '',
                    next_followup_time: userData.next_followup_time || '',
                    
                    // Source Information
                    source: userData.source || '',
                    reference_name: userData.reference_name || '',
                    reference_contact: userData.reference_contact || '',
                    
                    // Additional Information
                    remarks: userData.remarks || ''
                });
            } else {
                setError('Failed to load user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error loading user data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses list
    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}course_list`);
            if (response.data && response.data.success) {
                setCourses(response.data.data || response.data.courses || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchCourses();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userId = getUserId();
        if (!userId) {
            setError('Invalid user ID');
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(`${API_URL}update_student/${userId}`, formData);
            
            if (response.data.success) {
                setSuccess(response.data.message || 'Students updated successfully!');
                // Update original data
                setOriginalData({ ...originalData, ...formData });
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate(`${APP_PREFIX_PATH}/student-management`);
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to update Students');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Error updating user. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`${APP_PREFIX_PATH}/student-management`);
    };

    const handleConvertToAdmission = async () => {
        if (window.confirm('Are you sure you want to convert this enquiry to admission? This cannot be undone.')) {
            const userId = getUserId();
            if (!userId) return;

            try {
                const response = await axios.put(`${API_URL}convert_enquiry/${userId}`);
                if (response.data.success) {
                    alert(response.data.message || 'Enquiry converted to admission successfully!');
                    fetchUserData(); // Refresh data
                } else {
                    alert(response.data.message || 'Conversion failed');
                }
            } catch (error) {
                console.error('Error converting enquiry:', error);
                alert('Error converting enquiry to admission');
            }
        }
    };

    const handleUpdateFollowup = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const followupData = {
                followup_date: formData.followup_date,
                followup_time: formData.followup_time,
                notes: formData.followup_notes,
                next_followup_date: formData.next_followup_date,
                next_followup_time: formData.next_followup_time,
                status: formData.followup_status
            };

            const response = await axios.put(`${API_URL}update_followup/${userId}`, followupData);
            if (response.data.success) {
                alert(response.data.message || 'Follow-up updated successfully!');
                fetchUserData(); // Refresh data
            } else {
                alert(response.data.message || 'Failed to update follow-up');
            }
        } catch (error) {
            console.error('Error updating follow-up:', error);
            alert('Error updating follow-up details');
        }
    };

    // Check if form has changes
    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        Loading user data...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error && !loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
                <Button variant="contained" onClick={fetchUserData}>
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleCancel} color="primary">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Edit Student/Enquiry
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {formData.admission_type === 0 && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<SchoolIcon />}
                                onClick={handleConvertToAdmission}
                                sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}
                            >
                                Convert to Admission
                            </Button>
                        )}
                        
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={saving || !hasChanges()}
                            sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>

                {/* User Info Summary */}
                <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                                <Typography variant="body1" fontWeight="medium">{formData.name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">Mobile</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                    {formData.mobile}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                    {formData.email || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    <Box 
                                        component="span" 
                                        sx={{ 
                                            px: 1.5, 
                                            py: 0.5, 
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            bgcolor: formData.admission_type === 1 ? '#d1e7dd' : '#fff3cd',
                                            color: formData.admission_type === 1 ? '#0f5132' : '#856404'
                                        }}
                                    >
                                        {formData.admission_type === 1 ? 'Admission' : 'Enquiry'}
                                    </Box>
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Success/Error Messages */}
                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        <AlertTitle>Success</AlertTitle>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}

                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Information */}
                    {activeStep === 0 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                Basic Information
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Mobile Number"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Alternate Mobile"
                                        name="alternate_mobile"
                                        value={formData.alternate_mobile}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Parent/Guardian Name"
                                        name="parent_name"
                                        value={formData.parent_name}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Parent Contact"
                                        name="parent_contact"
                                        value={formData.parent_contact}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            label="Gender"
                                        >
                                            <MenuItem value=""><em>Select Gender</em></MenuItem>
                                            {genderOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 6 }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Step 2: Educational Details */}
                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <SchoolIcon sx={{ mr: 1 }} />
                                Educational Details
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Qualification"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Course</InputLabel>
                                        <Select
                                            name="course_id"
                                            value={formData.course_id}
                                            onChange={handleInputChange}
                                            label="Course"
                                        >
                                            <MenuItem value=""><em>Select Course</em></MenuItem>
                                            {courses.map((course) => (
                                                <MenuItem key={course.course_id || course.id} value={course.course_id || course.id}>
                                                    {course.course_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Specialization"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Previous Institute"
                                        name="previous_institute"
                                        value={formData.previous_institute}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Year of Passing"
                                        name="year_of_passing"
                                        value={formData.year_of_passing}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 4 }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <DescriptionIcon sx={{ mr: 1 }} />
                                        Additional Information
                                    </Typography>
                                    
                                    <TextField
                                        fullWidth
                                        label="Remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Step 3: Admission & Fees */}
                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <MoneyIcon sx={{ mr: 1 }} />
                                Admission & Fees Information
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Admission Type</InputLabel>
                                        <Select
                                            name="admission_type"
                                            value={formData.admission_type}
                                            onChange={handleInputChange}
                                            label="Admission Type"
                                        >
                                            {admissionTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Student Status</InputLabel>
                                        <Select
                                            name="student_status"
                                            value={formData.student_status}
                                            onChange={handleInputChange}
                                            label="Student Status"
                                        >
                                            {studentStatusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                {formData.admission_type === 1 && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Admission Date"
                                                name="date_of_admission"
                                                type="date"
                                                value={formData.date_of_admission}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Total Fees (₹)"
                                                name="total_fees"
                                                type="number"
                                                value={formData.total_fees}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                InputProps={{ startAdornment: '₹' }}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Fees Paid (₹)"
                                                name="fees_paid"
                                                type="number"
                                                value={formData.fees_paid}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                InputProps={{ startAdornment: '₹' }}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Fees Pending (₹)"
                                                name="fees_pending"
                                                type="number"
                                                value={formData.fees_pending}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                InputProps={{ startAdornment: '₹' }}
                                                InputLabelProps={{ shrink: true }}
                                                disabled
                                            />
                                        </Grid>
                                    </>
                                )}
                                
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationIcon sx={{ mr: 1 }} />
                                        Source Information
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel>Source</InputLabel>
                                                <Select
                                                    name="source"
                                                    value={formData.source}
                                                    onChange={handleInputChange}
                                                    label="Source"
                                                >
                                                    <MenuItem value=""><em>Select Source</em></MenuItem>
                                                    {sourceOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Reference Name"
                                                name="reference_name"
                                                value={formData.reference_name}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Reference Contact"
                                                name="reference_contact"
                                                value={formData.reference_contact}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                inputProps={{ maxLength: 10 }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Step 4: Follow-up Details */}
                    {activeStep === 3 && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <CalendarIcon sx={{ mr: 1 }} />
                                Follow-up Details
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Follow-up Status</InputLabel>
                                        <Select
                                            name="followup_status"
                                            value={formData.followup_status}
                                            onChange={handleInputChange}
                                            label="Follow-up Status"
                                        >
                                            {followupStatusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateFollowup}
                                        sx={{ mt: 1 }}
                                    >
                                        Update Follow-up
                                    </Button>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Follow-up Date"
                                        name="followup_date"
                                        type="date"
                                        value={formData.followup_date}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Follow-up Time"
                                        name="followup_time"
                                        type="time"
                                        value={formData.followup_time}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Next Follow-up Date"
                                        name="next_followup_date"
                                        type="date"
                                        value={formData.next_followup_date}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Next Follow-up Time"
                                        name="next_followup_time"
                                        type="time"
                                        value={formData.next_followup_time}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Follow-up Notes"
                                        name="followup_notes"
                                        value={formData.followup_notes}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        
                        <Box>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={saving || !hasChanges()}
                                    startIcon={<SaveIcon />}
                                    sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}
                                >
                                    {saving ? 'Saving...' : 'Save All Changes'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default EditStudentUser;