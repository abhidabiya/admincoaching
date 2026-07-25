import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Divider,
    Alert,
    Switch,
    FormControlLabel,
    Paper,
    Snackbar,
    CircularProgress,
    FormHelperText,
    Stepper,
    Step,
    StepLabel,
    Container
} from '@mui/material';
import {
    Person as PersonIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    School as SchoolIcon,
    Payment as PaymentIcon,
    Info as InfoIcon,
    Email as EmailIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from 'config/constant';

// Form Type Toggle Component
const FormTypeToggle = ({ isAdmissionForm, handleFormTypeChange, submitting }) => (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, width: '100%', maxWidth: 500 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ 
                    color: isAdmissionForm ? '#1976d2' : '#9c27b0',
                    fontWeight: 'bold'
                }}>
                    {isAdmissionForm ? '🎓 Admission Portal' : '📝 Enquiry Portal'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {isAdmissionForm 
                        ? 'Complete the form below to enroll as a student' 
                        : 'Fill the enquiry form to get more information'}
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ color: !isAdmissionForm ? '#9c27b0' : 'text.secondary', fontWeight: !isAdmissionForm ? 'bold' : 'normal' }}>
                    Enquiry
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isAdmissionForm}
                            onChange={handleFormTypeChange}
                            color="primary"
                            size="medium"
                            disabled={submitting}
                        />
                    }
                    label=""
                />
                <Typography variant="body1" sx={{ color: isAdmissionForm ? '#1976d2' : 'text.secondary', fontWeight: isAdmissionForm ? 'bold' : 'normal' }}>
                    Admission
                </Typography>
            </Box>
        </Paper>
    </Box>
);

// Personal Details Section
const PersonalDetailsSection = ({ formData, errors, handleChange, isAdmissionForm, submitting }) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    Personal Information
                </Typography>
            </Box>
            
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        fullWidth
                        label="Student Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                        disabled={submitting}
                        placeholder="Enter full name"
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        placeholder="student@example.com"
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={submitting}
                        InputProps={{
                            startAdornment: <EmailIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
                    <TextField
                        required={isAdmissionForm}
                        fullWidth
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date_of_birth}
                        helperText={errors.date_of_birth}
                        disabled={submitting}
                        InputProps={{
                            startAdornment: <CalendarIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
                        }}
                    />
                </Grid>
                
                {isAdmissionForm && (
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            fullWidth
                            label="Admission Date"
                            name="date_of_admission"
                            type="date"
                            value={formData.date_of_admission}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.date_of_admission}
                            helperText={errors.date_of_admission}
                            disabled={submitting}
                        />
                    </Grid>
                )}
                
                <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
                    <FormControl fullWidth size="small" error={!!errors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            label="Gender"
                            disabled={submitting}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="1">Male</MenuItem>
                            <MenuItem value="2">Female</MenuItem>
                            <MenuItem value="3">Other</MenuItem>
                        </Select>
                        {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        fullWidth
                        label="Contact Number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        placeholder="9876543210"
                        error={!!errors.contact_number}
                        helperText={errors.contact_number}
                        disabled={submitting}
                        InputProps={{
                            startAdornment: <PhoneIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        required={isAdmissionForm}
                        fullWidth
                        label="Parent/Guardian Number"
                        name="parent_contact"
                        value={formData.parent_contact}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        placeholder="9876543210"
                        error={!!errors.parent_contact}
                        helperText={errors.parent_contact}
                        disabled={submitting}
                        InputProps={{
                            startAdornment: <PhoneIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
                        }}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Complete Address"
                        name="address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        placeholder="House no, Street, City, State, Pincode"
                        error={!!errors.address}
                        helperText={errors.address}
                        disabled={submitting}
                        InputProps={{
                            startAdornment: <LocationIcon sx={{ mt: -2, mr: 1, color: '#7f8c8d', fontSize: 20 }} />
                        }}
                    />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

// Academic Details Section
const AcademicDetailsSection = ({ 
    formData, 
    errors, 
    handleChange, 
    isAdmissionForm, 
    submitting, 
    courses, 
    loading,
    qualifications,
    enquiryTypes,
    timingSlots 
}) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {isAdmissionForm ? 'Academic Details' : 'Course Details'}
                </Typography>
            </Box>
            
            <Grid container spacing={2.5}>
                {isAdmissionForm ? (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.qualification}>
                            <InputLabel>Highest Qualification</InputLabel>
                            <Select
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                label="Highest Qualification"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {qualifications.map((qual) => (
                                    <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                                ))}
                            </Select>
                            {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                        </FormControl>
                    </Grid>
                ) : (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.enquiry_type}>
                            <InputLabel>Enquiry Purpose</InputLabel>
                            <Select
                                name="enquiry_type"
                                value={formData.enquiry_type}
                                onChange={handleChange}
                                label="Enquiry Purpose"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {enquiryTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                            {errors.enquiry_type && <FormHelperText>{errors.enquiry_type}</FormHelperText>}
                        </FormControl>
                    </Grid>
                )}
                
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading}>
                        <InputLabel>Select Course</InputLabel>
                        <Select
                            name="course_name"
                            value={formData.course_name}
                            onChange={handleChange}
                            label="Select Course"
                        >
                            <MenuItem value="">Select Course</MenuItem>
                            {courses.map((course) => (
                                <MenuItem key={course.course_id || course.id} value={course.course_name}>
                                    {course.course_name} {course.fees ? `(₹${course.fees})` : ''}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.course_name && <FormHelperText>{errors.course_name}</FormHelperText>}
                        {loading && <FormHelperText>Loading courses...</FormHelperText>}
                    </FormControl>
                </Grid>
                
                {!isAdmissionForm && (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Preferred Timing</InputLabel>
                            <Select
                                name="preferred_timing"
                                value={formData.preferred_timing}
                                onChange={handleChange}
                                label="Preferred Timing"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {timingSlots.map((slot) => (
                                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
            </Grid>
        </CardContent>
    </Card>
);

// Fees Details Section
const FeesDetailsSection = ({ 
    formData, 
    errors, 
    handleChange, 
    isAdmissionForm, 
    submitting, 
    showRegistrationFee,
    paymentModes 
}) => (
    (isAdmissionForm || showRegistrationFee) && (
        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PaymentIcon sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {isAdmissionForm ? 'Fees Structure' : 'Registration Fee'}
                    </Typography>
                </Box>
                
                <Grid container spacing={2.5}>
                    {isAdmissionForm ? (
                        <>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Total Course Fees"
                                    name="total_fees"
                                    type="number"
                                    value={formData.total_fees}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    error={!!errors.total_fees}
                                    helperText={errors.total_fees}
                                    disabled={submitting}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Fees Submitted"
                                    name="fees_submitted"
                                    type="number"
                                    value={formData.fees_submitted}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    error={!!errors.fees_submitted}
                                    helperText={errors.fees_submitted}
                                    disabled={submitting}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Fees Pending"
                                    name="fees_pending"
                                    value={formData.fees_pending}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>,
                                        style: { 
                                            fontWeight: 'bold',
                                            color: parseFloat(formData.fees_pending || 0) > 0 ? '#d32f2f' : '#2e7d32'
                                        }
                                    }}
                                    disabled={submitting}
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Registration Fee"
                                    name="registration_fee"
                                    value={formData.registration_fee || 100}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        readOnly: showRegistrationFee,
                                        startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>,
                                        style: { 
                                            fontWeight: 'bold',
                                            color: '#9c27b0'
                                        }
                                    }}
                                    helperText="Mandatory for enquiry processing"
                                    error={!!errors.registration_fee}
                                    disabled={submitting}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Payment Status"
                                    value={parseFloat(formData.fees_pending || 0) === 0 ? "✅ Paid" : "⏳ Pending"}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                        style: { 
                                            fontWeight: 'bold',
                                            color: parseFloat(formData.fees_pending || 0) === 0 ? '#2e7d32' : '#d32f2f'
                                        }
                                    }}
                                    disabled={submitting}
                                />
                            </Grid>
                        </>
                    )}
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Payment Mode</InputLabel>
                            <Select
                                name="payment_mode"
                                value={formData.payment_mode}
                                onChange={handleChange}
                                label="Payment Mode"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {paymentModes.map((mode) => (
                                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Payment Date"
                            name="payment_date"
                            type="date"
                            value={formData.payment_date}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            disabled={submitting}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
);

// Summary Card Component
const SummaryCard = ({ formData, isAdmissionForm }) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    Summary
                </Typography>
            </Box>
            
            <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                        <strong style={{ color: '#555' }}>Student:</strong> {formData.name || 'Not provided'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                        <strong style={{ color: '#555' }}>Contact:</strong> {formData.contact_number || 'Not provided'}
                    </Typography>
                </Grid>
                
                {isAdmissionForm ? (
                    <>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Admission Date:</strong> {formData.date_of_admission || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Course:</strong> {formData.course_name || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Qualification:</strong> {formData.qualification || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                <Typography variant="body2">
                                    <strong style={{ color: '#555' }}>Total:</strong> 
                                    <span style={{ color: '#1976d2', fontWeight: 'bold', marginLeft: 4 }}>
                                        ₹{(parseFloat(formData.total_fees) || 0).toLocaleString()}
                                    </span>
                                </Typography>
                                <Typography variant="body2">
                                    <strong style={{ color: '#555' }}>Submitted:</strong> 
                                    <span style={{ color: '#2e7d32', fontWeight: 'bold', marginLeft: 4 }}>
                                        ₹{(parseFloat(formData.fees_submitted) || 0).toLocaleString()}
                                    </span>
                                </Typography>
                                <Typography variant="body2">
                                    <strong style={{ color: '#555' }}>Pending:</strong> 
                                    <span style={{ 
                                        color: parseFloat(formData.fees_pending || 0) > 0 ? '#d32f2f' : '#2e7d32', 
                                        fontWeight: 'bold', 
                                        marginLeft: 4 
                                    }}>
                                        ₹{(parseFloat(formData.fees_pending) || 0).toLocaleString()}
                                    </span>
                                </Typography>
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Enquiry Type:</strong> {formData.enquiry_type || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Course:</strong> {formData.course_name || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Preferred Timing:</strong> {formData.preferred_timing || 'Not specified'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                <strong style={{ color: '#555' }}>Registration Fee:</strong> 
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    color: parseFloat(formData.registration_fee || 0) > 0 ? '#2e7d32' : '#d32f2f',
                                    marginLeft: 4
                                }}>
                                    ₹{(parseFloat(formData.registration_fee) || 0).toLocaleString()} 
                                    {parseFloat(formData.registration_fee || 0) === 100 ? ' (Required)' : ' (Not Paid)'}
                                </span>
                            </Typography>
                        </Grid>
                    </>
                )}
            </Grid>
        </CardContent>
    </Card>
);

// Main Component
const AdmissionForm = () => {
    // Toggle state for form type
    const [isAdmissionForm, setIsAdmissionForm] = useState(true);
    
    // API states
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    
    // Form state
    const [formData, setFormData] = useState({
        // Personal Details
        name: '',
        address: '',
        contact_number: '',
        parent_contact: '',
        date_of_birth: '',
        email: '',
        gender: '',
        
        // Academic Details
        qualification: '',
        course_name: '',
        
        // Admission Details
        date_of_admission: new Date().toISOString().split('T')[0],
        
        // Fees
        total_fees: '',
        fees_submitted: '',
        fees_pending: '',
        payment_mode: '',
        payment_date: new Date().toISOString().split('T')[0],
        
        // Enquiry specific
        enquiry_type: '',
        preferred_timing: '',
        registration_fee: '',
        
        // Additional fields for API
        admission_type: 1,
        student_status: 3,
        admission_step: 0
    });

    // Form errors
    const [errors, setErrors] = useState({});
    const [showRegistrationFee, setShowRegistrationFee] = useState(false);

    // Static data
    const qualifications = [
        '10th Pass',
        '12th Pass',
        'Graduate',
        'Post Graduate',
        'Diploma',
        'Other'
    ];

    const enquiryTypes = [
        'Course Information',
        'Fee Structure',
        'Batch Timings',
        'Faculty Details',
        'Infrastructure',
        'Scholarship',
        'Other'
    ];

    const timingSlots = [
        'Morning (7 AM - 10 AM)',
        'Afternoon (2 PM - 5 PM)',
        'Evening (5 PM - 8 PM)',
        'Weekend Batch',
        'Flexible Timing'
    ];

    const paymentModes = [
        'Cash',
        'Cheque',
        'Online Transfer',
        'UPI',
        'Card',
        'Bank Transfer'
    ];

    // Fetch courses from API
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_courses`, {
                params: {
                    page: 1,
                    limit: 100,
                    active: 1
                }
            });

            if (response.data.success) {
                const coursesData = response.data.data || [];
                setCourses(coursesData);
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to fetch courses',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setSnackbar({
                open: true,
                message: 'Error fetching courses',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleFormTypeChange = (event) => {
        const isAdmission = event.target.checked;
        setIsAdmissionForm(isAdmission);
        setErrors({});
        
        // Reset form when switching
        setFormData({
            name: '',
            address: '',
            contact_number: '',
            parent_contact: '',
            date_of_birth: '',
            email: '',
            gender: '',
            qualification: '',
            course_name: '',
            date_of_admission: new Date().toISOString().split('T')[0],
            total_fees: '',
            fees_submitted: '',
            fees_pending: '',
            payment_mode: '',
            payment_date: new Date().toISOString().split('T')[0],
            enquiry_type: '',
            preferred_timing: '',
            registration_fee: '',
            admission_type: isAdmission ? 1 : 0,
            student_status: isAdmission ? 3 : 0,
            admission_step: 0
        });
        setShowRegistrationFee(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error for this field
        setErrors(prev => ({ ...prev, [name]: '' }));
        
        let updatedData = {
            ...formData,
            [name]: value
        };
        
        // Calculate pending fees if total_fees or fees_submitted changes
        if (name === 'total_fees' || name === 'fees_submitted') {
            const amount = parseFloat(updatedData.total_fees) || 0;
            const submitted = parseFloat(updatedData.fees_submitted) || 0;
            updatedData.fees_pending = (amount - submitted).toFixed(2);
        }
        
        // When course changes, auto-populate fees if available
        if (name === 'course_name' && isAdmissionForm) {
            const selectedCourse = courses.find(course => course.course_name === value);
            if (selectedCourse) {
                updatedData.total_fees = selectedCourse.fees || '';
                const amount = parseFloat(selectedCourse.fees) || 0;
                const submitted = parseFloat(updatedData.fees_submitted) || 0;
                updatedData.fees_pending = (amount - submitted).toFixed(2);
            }
        }
        
        setFormData(updatedData);
    };

    const handleRegistrationFee = () => {
        setShowRegistrationFee(true);
        setFormData(prev => ({
            ...prev,
            registration_fee: '100',
            total_fees: '100',
            fees_submitted: '0',
            fees_pending: '100'
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Common validations
        if (!formData.name.trim()) newErrors.name = 'Student name is required';
        if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
        else if (!/^\d{10}$/.test(formData.contact_number)) newErrors.contact_number = 'Enter a valid 10-digit mobile number';
        
        if (!formData.course_name) newErrors.course_name = 'Course selection is required';
        
        // Admission form specific validations
        if (isAdmissionForm) {
            if (!formData.parent_contact.trim()) newErrors.parent_contact = 'Parent/Guardian number is required';
            else if (!/^\d{10}$/.test(formData.parent_contact)) newErrors.parent_contact = 'Enter a valid 10-digit mobile number';
            
            if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
            if (!formData.qualification) newErrors.qualification = 'Qualification is required';
            if (!formData.date_of_admission) newErrors.date_of_admission = 'Admission date is required';
            
            if (!formData.total_fees || parseFloat(formData.total_fees) <= 0) 
                newErrors.total_fees = 'Total fees must be greater than 0';
            
            if (formData.fees_submitted && parseFloat(formData.fees_submitted) < 0)
                newErrors.fees_submitted = 'Fees submitted cannot be negative';
                
            if (formData.fees_submitted && parseFloat(formData.fees_submitted) > parseFloat(formData.total_fees))
                newErrors.fees_submitted = 'Submitted fees cannot exceed total fees';
        } 
        // Enquiry form specific validations
        else {
            if (!formData.enquiry_type) newErrors.enquiry_type = 'Enquiry type is required';
            
            if (!showRegistrationFee && !formData.registration_fee) {
                newErrors.registration_fee = 'Registration fee is required';
            } else if (formData.registration_fee && parseFloat(formData.registration_fee) !== 100) {
                newErrors.registration_fee = 'Registration fee must be ₹100';
            }
        }
        
        return newErrors;
    };

    const prepareApiData = () => {
        const admission_type = isAdmissionForm ? 1 : 0;
        const total_fees = parseFloat(formData.total_fees) || 0;
        const fees_submitted = parseFloat(formData.fees_submitted) || 0;
        const registration_fee = parseFloat(formData.registration_fee) || 0;
        
        const finalTotalFees = admission_type === 0 && registration_fee > 0 ? registration_fee : total_fees;
        const finalSubmittedFees = admission_type === 0 && registration_fee > 0 ? fees_submitted : fees_submitted;
        const fees_pending = finalTotalFees - finalSubmittedFees;
        
        let admission_step = 0;
        if (admission_type === 0 && registration_fee > 0 && finalSubmittedFees >= registration_fee) {
            admission_step = 1;
        } else if (admission_type === 1 && finalSubmittedFees > 0) {
            admission_step = 2;
        }

        const apiData = {
            admission_type: admission_type,
            name: formData.name,
            address: formData.address,
            contact_number: formData.contact_number,
            parent_contact: formData.parent_contact,
            date_of_birth: formData.date_of_birth,
            qualification: formData.qualification,
            course_name: formData.course_name,
            date_of_admission: formData.date_of_admission,
            total_fees: finalTotalFees,
            fees_submitted: finalSubmittedFees,
            enquiry_type: formData.enquiry_type,
            preferred_timing: formData.preferred_timing,
            registration_fee: registration_fee,
            payment_mode: formData.payment_mode,
            payment_date: formData.payment_date,
            email: formData.email,
            gender: formData.gender ? parseInt(formData.gender) : 1,
            student_status: admission_type === 1 ? 3 : 0,
            admission_step: admission_step
        };

        Object.keys(apiData).forEach(key => {
            if (apiData[key] === '' || apiData[key] === undefined) {
                delete apiData[key];
            }
        });

        return apiData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSnackbar({
                open: true,
                message: 'Please fix the errors in the form',
                severity: 'error'
            });
            return;
        }
        
        if (!isAdmissionForm && !showRegistrationFee && !formData.registration_fee) {
            const confirmEnquiry = window.confirm('Do you want to pay ₹100 registration fee to proceed with the enquiry?');
            if (confirmEnquiry) {
                handleRegistrationFee();
                return;
            } else {
                setSnackbar({
                    open: true,
                    message: 'Registration fee is required to process your enquiry',
                    severity: 'warning'
                });
                return;
            }
        }
        
        setSubmitting(true);
        
        try {
            const apiData = prepareApiData();
            
            const response = await axios.post(`${API_URL}create_student_record`, apiData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: response.data.message || 
                           (isAdmissionForm ? 'Admission created successfully!' : 'Enquiry created successfully!'),
                    severity: 'success'
                });
                
                // Reset form on success
                setFormData({
                    name: '',
                    address: '',
                    contact_number: '',
                    parent_contact: '',
                    date_of_birth: '',
                    email: '',
                    gender: '',
                    qualification: '',
                    course_name: '',
                    date_of_admission: new Date().toISOString().split('T')[0],
                    total_fees: '',
                    fees_submitted: '',
                    fees_pending: '',
                    payment_mode: '',
                    payment_date: new Date().toISOString().split('T')[0],
                    enquiry_type: '',
                    preferred_timing: '',
                    registration_fee: '',
                    admission_type: isAdmissionForm ? 1 : 0,
                    student_status: isAdmissionForm ? 3 : 0,
                    admission_step: 0
                });
                setShowRegistrationFee(false);
                setErrors({});
            } else {
                setSnackbar({
                    open: true,
                    message: response.data.message || 'Submission failed',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Network error. Please try again.';
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Form Type Toggle */}
            <FormTypeToggle
                isAdmissionForm={isAdmissionForm}
                handleFormTypeChange={handleFormTypeChange}
                submitting={submitting}
            />

            {/* Info Alert for Enquiry Form */}
            {!isAdmissionForm && (
                <Alert 
                    severity="info" 
                    sx={{ 
                        mb: 3, 
                        backgroundColor: '#e8f4fd',
                        border: '1px solid #b6d4fe',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body2">
                        <strong>Note:</strong> A registration fee of ₹100 is required to process your enquiry. 
                        This amount will be adjusted against your admission fees if you choose to enroll later.
                    </Typography>
                </Alert>
            )}

            {/* Main Form Card */}
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Form Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            color: isAdmissionForm ? '#1976d2' : '#9c27b0',
                            mb: 1
                        }}>
                            {isAdmissionForm ? 'Student Admission Form' : 'Student Enquiry Form'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please fill all the required fields carefully
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        {/* Personal Details Section */}
                        <PersonalDetailsSection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm}
                            submitting={submitting}
                        />

                        {/* Academic Details Section */}
                        <AcademicDetailsSection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm}
                            submitting={submitting}
                            courses={courses}
                            loading={loading}
                            qualifications={qualifications}
                            enquiryTypes={enquiryTypes}
                            timingSlots={timingSlots}
                        />

                        {/* Fees Details Section */}
                        <FeesDetailsSection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm}
                            submitting={submitting}
                            showRegistrationFee={showRegistrationFee}
                            paymentModes={paymentModes}
                        />

                        {/* Summary Card */}
                        <SummaryCard
                            formData={formData}
                            isAdmissionForm={isAdmissionForm}
                        />

                        {/* Action Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 3, 
                            mt: 4,
                            flexWrap: 'wrap'
                        }}>
                            {!isAdmissionForm && !showRegistrationFee && !formData.registration_fee && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    onClick={handleRegistrationFee}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        borderColor: '#9c27b0',
                                        color: '#9c27b0',
                                        '&:hover': {
                                            borderColor: '#7b1fa2',
                                            backgroundColor: 'rgba(156, 39, 176, 0.04)'
                                        }
                                    }}
                                    disabled={submitting}
                                >
                                    Add ₹100 Registration Fee
                                </Button>
                            )}
                            
                            <Button
                                variant="contained"
                                type="submit"
                                size="large"
                                disabled={submitting || loading}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: isAdmissionForm 
                                        ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
                                        : 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                    boxShadow: 2,
                                    '&:hover': {
                                        boxShadow: 4,
                                        transform: 'translateY(-1px)'
                                    },
                                    '&:disabled': {
                                        opacity: 0.7
                                    }
                                }}
                            >
                                {submitting ? (
                                    <>
                                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                        Processing...
                                    </>
                                ) : isAdmissionForm ? 'Submit Admission' : 'Submit Enquiry'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdmissionForm;



















// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Card,
//     CardContent,
//     Typography,
//     TextField,
//     Button,
//     Grid,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Select,
//     Divider,
//     Alert,
//     Switch,
//     FormControlLabel,
//     Paper,
//     Snackbar,
//     CircularProgress,
//     FormHelperText,
//     Stepper,
//     Step,
//     StepLabel,
//     Container
// } from '@mui/material';
// import {
//     Person as PersonIcon,
//     Phone as PhoneIcon,
//     LocationOn as LocationIcon,
//     CalendarToday as CalendarIcon,
//     School as SchoolIcon,
//     Payment as PaymentIcon,
//     Info as InfoIcon,
//     Email as EmailIcon,
//     Assignment as AssignmentIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { API_URL } from 'config/constant';

// // Theme colors based on your SCSS variables
// const theme = {
//     // Background & Paper
//     paper: '#0f172a',
//     darkBackground: '#0b1120',
//     darkPaper: '#111827',
    
//     // Primary
//     primaryLight: '#60a5fa',
//     primaryMain: '#3b82f6',
//     primaryDark: '#2563eb',
//     primary200: '#93c5fd',
//     primary800: '#1e40af',
    
//     // Secondary
//     secondaryLight: '#5eead4',
//     secondaryMain: '#14b8a6',
//     secondaryDark: '#0f766e',
//     secondary200: '#99f6e4',
//     secondary800: '#115e59',
    
//     // Success
//     successLight: '#86efac',
//     success200: '#4ade80',
//     successMain: '#22c55e',
//     successDark: '#16a34a',
    
//     // Error
//     errorLight: '#fca5a5',
//     errorMain: '#ef4444',
//     errorDark: '#dc2626',
    
//     // Warning
//     warningLight: '#fde68a',
//     warningMain: '#f59e0b',
//     warningDark: '#d97706',
    
//     // Orange
//     orangeLight: '#fed7aa',
//     orangeMain: '#fb923c',
//     orangeDark: '#ea580c',
    
//     // Grey
//     grey50: '#0f172a',
//     grey100: '#1e293b',
//     grey200: '#334155',
//     grey300: '#475569',
//     grey500: '#64748b',
//     grey600: '#94a3b8',
//     grey700: '#cbd5e1',
//     grey900: '#f1f5f9',
    
//     // Text
//     darkTextTitle: '#f8fafc',
//     darkTextPrimary: '#e2e8f0',
//     darkTextSecondary: '#94a3b8'
// };

// // Form Type Toggle Component
// const FormTypeToggle = ({ isAdmissionForm, handleFormTypeChange, submitting }) => (
//     <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
//         <Paper elevation={2} sx={{ 
//             p: 3, 
//             borderRadius: 3, 
//             width: '100%', 
//             maxWidth: 500,
//             backgroundColor: theme.paper,
//             border: `1px solid ${theme.grey200}`
//         }}>
//             <Box sx={{ textAlign: 'center', mb: 2 }}>
//                 <Typography variant="h5" gutterBottom sx={{ 
//                     color: isAdmissionForm ? theme.primaryMain : theme.secondaryMain,
//                     fontWeight: 'bold'
//                 }}>
//                     {isAdmissionForm ? '🎓 Admission Portal' : '📝 Enquiry Portal'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: theme.darkTextSecondary }}>
//                     {isAdmissionForm 
//                         ? 'Complete the form below to enroll as a student' 
//                         : 'Fill the enquiry form to get more information'}
//                 </Typography>
//             </Box>
            
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
//                 <Typography variant="body1" sx={{ 
//                     color: !isAdmissionForm ? theme.secondaryMain : theme.darkTextSecondary, 
//                     fontWeight: !isAdmissionForm ? 'bold' : 'normal' 
//                 }}>
//                     Enquiry
//                 </Typography>
//                 <FormControlLabel
//                     control={
//                         <Switch
//                             checked={isAdmissionForm}
//                             onChange={handleFormTypeChange}
//                             sx={{
//                                 '& .MuiSwitch-switchBase.Mui-checked': {
//                                     color: theme.primaryMain,
//                                     '&:hover': {
//                                         backgroundColor: `${theme.primaryLight}20`,
//                                     },
//                                 },
//                                 '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                                     backgroundColor: theme.primaryMain,
//                                 },
//                             }}
//                             size="medium"
//                             disabled={submitting}
//                         />
//                     }
//                     label=""
//                 />
//                 <Typography variant="body1" sx={{ 
//                     color: isAdmissionForm ? theme.primaryMain : theme.darkTextSecondary, 
//                     fontWeight: isAdmissionForm ? 'bold' : 'normal' 
//                 }}>
//                     Admission
//                 </Typography>
//             </Box>
//         </Paper>
//     </Box>
// );

// // Personal Details Section
// const PersonalDetailsSection = ({ formData, errors, handleChange, isAdmissionForm, submitting }) => (
//     <Card variant="outlined" sx={{ 
//         mb: 3, 
//         borderRadius: 2,
//         backgroundColor: theme.paper,
//         borderColor: theme.grey200,
//         '&:hover': {
//             borderColor: theme.primary200,
//         }
//     }}>
//         <CardContent>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <PersonIcon sx={{ mr: 1, color: theme.primaryMain }} />
//                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.darkTextTitle }}>
//                     Personal Information
//                 </Typography>
//             </Box>
            
//             <Grid container spacing={2.5}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         required
//                         fullWidth
//                         label="Student Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         variant="outlined"
//                         size="small"
//                         error={!!errors.name}
//                         helperText={errors.name}
//                         disabled={submitting}
//                         placeholder="Enter full name"
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             },
//                             '& .MuiInputLabel-root': {
//                                 color: theme.darkTextSecondary,
//                             },
//                             '& .MuiInputBase-input': {
//                                 color: theme.darkTextPrimary,
//                             },
//                         }}
//                     />
//                 </Grid>
                
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Email Address"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         variant="outlined"
//                         size="small"
//                         placeholder="student@example.com"
//                         error={!!errors.email}
//                         helperText={errors.email}
//                         disabled={submitting}
//                         InputProps={{
//                             startAdornment: <EmailIcon sx={{ mr: 1, color: theme.grey500, fontSize: 20 }} />
//                         }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             },
//                             '& .MuiInputLabel-root': {
//                                 color: theme.darkTextSecondary,
//                             },
//                             '& .MuiInputBase-input': {
//                                 color: theme.darkTextPrimary,
//                             },
//                         }}
//                     />
//                 </Grid>
                
//                 <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
//                     <TextField
//                         required={isAdmissionForm}
//                         fullWidth
//                         label="Date of Birth"
//                         name="date_of_birth"
//                         type="date"
//                         value={formData.date_of_birth}
//                         onChange={handleChange}
//                         variant="outlined"
//                         size="small"
//                         InputLabelProps={{ shrink: true }}
//                         error={!!errors.date_of_birth}
//                         helperText={errors.date_of_birth}
//                         disabled={submitting}
//                         InputProps={{
//                             startAdornment: <CalendarIcon sx={{ mr: 1, color: theme.grey500, fontSize: 20 }} />
//                         }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             },
//                             '& .MuiInputLabel-root': {
//                                 color: theme.darkTextSecondary,
//                             },
//                             '& .MuiInputBase-input': {
//                                 color: theme.darkTextPrimary,
//                             },
//                         }}
//                     />
//                 </Grid>
                
//                 {isAdmissionForm && (
//                     <Grid item xs={12} md={4}>
//                         <TextField
//                             required
//                             fullWidth
//                             label="Admission Date"
//                             name="date_of_admission"
//                             type="date"
//                             value={formData.date_of_admission}
//                             onChange={handleChange}
//                             variant="outlined"
//                             size="small"
//                             InputLabelProps={{ shrink: true }}
//                             error={!!errors.date_of_admission}
//                             helperText={errors.date_of_admission}
//                             disabled={submitting}
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     '& fieldset': {
//                                         borderColor: theme.grey300,
//                                     },
//                                     '&:hover fieldset': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                     '&.Mui-focused fieldset': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                 },
//                                 '& .MuiInputLabel-root': {
//                                     color: theme.darkTextSecondary,
//                                 },
//                                 '& .MuiInputBase-input': {
//                                     color: theme.darkTextPrimary,
//                                 },
//                             }}
//                         />
//                     </Grid>
//                 )}
                
//                 <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
//                     <FormControl fullWidth size="small" error={!!errors.gender}>
//                         <InputLabel sx={{ color: theme.darkTextSecondary }}>Gender</InputLabel>
//                         <Select
//                             name="gender"
//                             value={formData.gender}
//                             onChange={handleChange}
//                             label="Gender"
//                             disabled={submitting}
//                             sx={{
//                                 color: theme.darkTextPrimary,
//                                 '& .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             }}
//                         >
//                             <MenuItem value="">Select</MenuItem>
//                             <MenuItem value="1">Male</MenuItem>
//                             <MenuItem value="2">Female</MenuItem>
//                             <MenuItem value="3">Other</MenuItem>
//                         </Select>
//                         {errors.gender && <FormHelperText sx={{ color: theme.errorMain }}>{errors.gender}</FormHelperText>}
//                     </FormControl>
//                 </Grid>
                
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         required
//                         fullWidth
//                         label="Contact Number"
//                         name="contact_number"
//                         value={formData.contact_number}
//                         onChange={handleChange}
//                         variant="outlined"
//                         size="small"
//                         placeholder="9876543210"
//                         error={!!errors.contact_number}
//                         helperText={errors.contact_number}
//                         disabled={submitting}
//                         InputProps={{
//                             startAdornment: <PhoneIcon sx={{ mr: 1, color: theme.grey500, fontSize: 20 }} />
//                         }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             },
//                             '& .MuiInputLabel-root': {
//                                 color: theme.darkTextSecondary,
//                             },
//                             '& .MuiInputBase-input': {
//                                 color: theme.darkTextPrimary,
//                             },
//                         }}
//                     />
//                 </Grid>
                
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         required={isAdmissionForm}
//                         fullWidth
//                         label="Parent/Guardian Number"
//                         name="parent_contact"
//                         value={formData.parent_contact}
//                         onChange={handleChange}
//                         variant="outlined"
//                         size="small"
//                         placeholder="9876543210"
//                         error={!!errors.parent_contact}
//                         helperText={errors.parent_contact}
//                         disabled={submitting}
//                         InputProps={{
//                             startAdornment: <PhoneIcon sx={{ mr: 1, color: theme.grey500, fontSize: 20 }} />
//                         }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             },
//                             '& .MuiInputLabel-root': {
//                                 color: theme.darkTextSecondary,
//                             },
//                             '& .MuiInputBase-input': {
//                                 color: theme.darkTextPrimary,
//                             },
//                         }}
//                     />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         label="Complete Address"
//                         name="address"
//                         multiline
//                         rows={2}
//                         value={formData.address}
//                         onChange={handleChange}
//                         variant="outlined"
//                         size="small"
//                         placeholder="House no, Street, City, State, Pincode"
//                         error={!!errors.address}
//                         helperText={errors.address}
//                         disabled={submitting}
//                         InputProps={{
//                             startAdornment: <LocationIcon sx={{ mt: -2, mr: 1, color: theme.grey500, fontSize: 20 }} />
//                         }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             },
//                             '& .MuiInputLabel-root': {
//                                 color: theme.darkTextSecondary,
//                             },
//                             '& .MuiInputBase-input': {
//                                 color: theme.darkTextPrimary,
//                             },
//                         }}
//                     />
//                 </Grid>
//             </Grid>
//         </CardContent>
//     </Card>
// );

// // Academic Details Section
// const AcademicDetailsSection = ({ 
//     formData, 
//     errors, 
//     handleChange, 
//     isAdmissionForm, 
//     submitting, 
//     courses, 
//     loading,
//     qualifications,
//     enquiryTypes,
//     timingSlots 
// }) => (
//     <Card variant="outlined" sx={{ 
//         mb: 3, 
//         borderRadius: 2,
//         backgroundColor: theme.paper,
//         borderColor: theme.grey200,
//         '&:hover': {
//             borderColor: theme.primary200,
//         }
//     }}>
//         <CardContent>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <SchoolIcon sx={{ mr: 1, color: theme.primaryMain }} />
//                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.darkTextTitle }}>
//                     {isAdmissionForm ? 'Academic Details' : 'Course Details'}
//                 </Typography>
//             </Box>
            
//             <Grid container spacing={2.5}>
//                 {isAdmissionForm ? (
//                     <Grid item xs={12} md={6}>
//                         <FormControl fullWidth size="small" required error={!!errors.qualification}>
//                             <InputLabel sx={{ color: theme.darkTextSecondary }}>Highest Qualification</InputLabel>
//                             <Select
//                                 name="qualification"
//                                 value={formData.qualification}
//                                 onChange={handleChange}
//                                 label="Highest Qualification"
//                                 disabled={submitting}
//                                 sx={{
//                                     color: theme.darkTextPrimary,
//                                     '& .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.grey300,
//                                     },
//                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="">Select</MenuItem>
//                                 {qualifications.map((qual) => (
//                                     <MenuItem key={qual} value={qual}>{qual}</MenuItem>
//                                 ))}
//                             </Select>
//                             {errors.qualification && <FormHelperText sx={{ color: theme.errorMain }}>{errors.qualification}</FormHelperText>}
//                         </FormControl>
//                     </Grid>
//                 ) : (
//                     <Grid item xs={12} md={6}>
//                         <FormControl fullWidth size="small" required error={!!errors.enquiry_type}>
//                             <InputLabel sx={{ color: theme.darkTextSecondary }}>Enquiry Purpose</InputLabel>
//                             <Select
//                                 name="enquiry_type"
//                                 value={formData.enquiry_type}
//                                 onChange={handleChange}
//                                 label="Enquiry Purpose"
//                                 disabled={submitting}
//                                 sx={{
//                                     color: theme.darkTextPrimary,
//                                     '& .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.grey300,
//                                     },
//                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="">Select</MenuItem>
//                                 {enquiryTypes.map((type) => (
//                                     <MenuItem key={type} value={type}>{type}</MenuItem>
//                                 ))}
//                             </Select>
//                             {errors.enquiry_type && <FormHelperText sx={{ color: theme.errorMain }}>{errors.enquiry_type}</FormHelperText>}
//                         </FormControl>
//                     </Grid>
//                 )}
                
//                 <Grid item xs={12} md={6}>
//                     <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading}>
//                         <InputLabel sx={{ color: theme.darkTextSecondary }}>Select Course</InputLabel>
//                         <Select
//                             name="course_name"
//                             value={formData.course_name}
//                             onChange={handleChange}
//                             label="Select Course"
//                             sx={{
//                                 color: theme.darkTextPrimary,
//                                 '& .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: theme.grey300,
//                                 },
//                                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: theme.primaryMain,
//                                 },
//                             }}
//                         >
//                             <MenuItem value="">Select Course</MenuItem>
//                             {courses.map((course) => (
//                                 <MenuItem key={course.course_id || course.id} value={course.course_name}>
//                                     {course.course_name} {course.fees ? `(₹${course.fees})` : ''}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                         {errors.course_name && <FormHelperText sx={{ color: theme.errorMain }}>{errors.course_name}</FormHelperText>}
//                         {loading && <FormHelperText sx={{ color: theme.darkTextSecondary }}>Loading courses...</FormHelperText>}
//                     </FormControl>
//                 </Grid>
                
//                 {!isAdmissionForm && (
//                     <Grid item xs={12} md={6}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel sx={{ color: theme.darkTextSecondary }}>Preferred Timing</InputLabel>
//                             <Select
//                                 name="preferred_timing"
//                                 value={formData.preferred_timing}
//                                 onChange={handleChange}
//                                 label="Preferred Timing"
//                                 disabled={submitting}
//                                 sx={{
//                                     color: theme.darkTextPrimary,
//                                     '& .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.grey300,
//                                     },
//                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="">Select</MenuItem>
//                                 {timingSlots.map((slot) => (
//                                     <MenuItem key={slot} value={slot}>{slot}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                 )}
//             </Grid>
//         </CardContent>
//     </Card>
// );

// // Fees Details Section
// const FeesDetailsSection = ({ 
//     formData, 
//     errors, 
//     handleChange, 
//     isAdmissionForm, 
//     submitting, 
//     showRegistrationFee,
//     paymentModes 
// }) => (
//     (isAdmissionForm || showRegistrationFee) && (
//         <Card variant="outlined" sx={{ 
//             mb: 3, 
//             borderRadius: 2,
//             backgroundColor: theme.paper,
//             borderColor: theme.grey200,
//             '&:hover': {
//                 borderColor: theme.primary200,
//             }
//         }}>
//             <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <PaymentIcon sx={{ mr: 1, color: theme.primaryMain }} />
//                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.darkTextTitle }}>
//                         {isAdmissionForm ? 'Fees Structure' : 'Registration Fee'}
//                     </Typography>
//                 </Box>
                
//                 <Grid container spacing={2.5}>
//                     {isAdmissionForm ? (
//                         <>
//                             <Grid item xs={12} md={4}>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     label="Total Course Fees"
//                                     name="total_fees"
//                                     type="number"
//                                     value={formData.total_fees}
//                                     onChange={handleChange}
//                                     variant="outlined"
//                                     size="small"
//                                     error={!!errors.total_fees}
//                                     helperText={errors.total_fees}
//                                     disabled={submitting}
//                                     InputProps={{
//                                         startAdornment: <Typography sx={{ mr: 1, color: theme.grey500 }}>₹</Typography>
//                                     }}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             '& fieldset': {
//                                                 borderColor: theme.grey300,
//                                             },
//                                             '&:hover fieldset': {
//                                                 borderColor: theme.primaryMain,
//                                             },
//                                             '&.Mui-focused fieldset': {
//                                                 borderColor: theme.primaryMain,
//                                             },
//                                         },
//                                         '& .MuiInputLabel-root': {
//                                             color: theme.darkTextSecondary,
//                                         },
//                                         '& .MuiInputBase-input': {
//                                             color: theme.darkTextPrimary,
//                                         },
//                                     }}
//                                 />
//                             </Grid>
                            
//                             <Grid item xs={12} md={4}>
//                                 <TextField
//                                     fullWidth
//                                     label="Fees Submitted"
//                                     name="fees_submitted"
//                                     type="number"
//                                     value={formData.fees_submitted}
//                                     onChange={handleChange}
//                                     variant="outlined"
//                                     size="small"
//                                     error={!!errors.fees_submitted}
//                                     helperText={errors.fees_submitted}
//                                     disabled={submitting}
//                                     InputProps={{
//                                         startAdornment: <Typography sx={{ mr: 1, color: theme.grey500 }}>₹</Typography>
//                                     }}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             '& fieldset': {
//                                                 borderColor: theme.grey300,
//                                             },
//                                             '&:hover fieldset': {
//                                                 borderColor: theme.primaryMain,
//                                             },
//                                             '&.Mui-focused fieldset': {
//                                                 borderColor: theme.primaryMain,
//                                             },
//                                         },
//                                         '& .MuiInputLabel-root': {
//                                             color: theme.darkTextSecondary,
//                                         },
//                                         '& .MuiInputBase-input': {
//                                             color: theme.darkTextPrimary,
//                                         },
//                                     }}
//                                 />
//                             </Grid>
                            
//                             <Grid item xs={12} md={4}>
//                                 <TextField
//                                     fullWidth
//                                     label="Fees Pending"
//                                     name="fees_pending"
//                                     value={formData.fees_pending}
//                                     variant="outlined"
//                                     size="small"
//                                     InputProps={{
//                                         readOnly: true,
//                                         startAdornment: <Typography sx={{ mr: 1, color: theme.grey500 }}>₹</Typography>,
//                                         style: { 
//                                             fontWeight: 'bold',
//                                             color: parseFloat(formData.fees_pending || 0) > 0 ? theme.errorMain : theme.successMain
//                                         }
//                                     }}
//                                     disabled={submitting}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             '& fieldset': {
//                                                 borderColor: theme.grey300,
//                                             },
//                                         },
//                                         '& .MuiInputLabel-root': {
//                                             color: theme.darkTextSecondary,
//                                         },
//                                     }}
//                                 />
//                             </Grid>
//                         </>
//                     ) : (
//                         <>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Registration Fee"
//                                     name="registration_fee"
//                                     value={formData.registration_fee || 100}
//                                     onChange={handleChange}
//                                     variant="outlined"
//                                     size="small"
//                                     InputProps={{
//                                         readOnly: showRegistrationFee,
//                                         startAdornment: <Typography sx={{ mr: 1, color: theme.grey500 }}>₹</Typography>,
//                                         style: { 
//                                             fontWeight: 'bold',
//                                             color: theme.secondaryMain
//                                         }
//                                     }}
//                                     helperText="Mandatory for enquiry processing"
//                                     error={!!errors.registration_fee}
//                                     disabled={submitting}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             '& fieldset': {
//                                                 borderColor: theme.grey300,
//                                             },
//                                             '&:hover fieldset': {
//                                                 borderColor: theme.primaryMain,
//                                             },
//                                             '&.Mui-focused fieldset': {
//                                                 borderColor: theme.primaryMain,
//                                             },
//                                         },
//                                         '& .MuiInputLabel-root': {
//                                             color: theme.darkTextSecondary,
//                                         },
//                                         '& .MuiInputBase-input': {
//                                             color: theme.darkTextPrimary,
//                                         },
//                                     }}
//                                 />
//                             </Grid>
                            
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Payment Status"
//                                     value={parseFloat(formData.fees_pending || 0) === 0 ? "✅ Paid" : "⏳ Pending"}
//                                     variant="outlined"
//                                     size="small"
//                                     InputProps={{
//                                         readOnly: true,
//                                         style: { 
//                                             fontWeight: 'bold',
//                                             color: parseFloat(formData.fees_pending || 0) === 0 ? theme.successMain : theme.errorMain
//                                         }
//                                     }}
//                                     disabled={submitting}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             '& fieldset': {
//                                                 borderColor: theme.grey300,
//                                             },
//                                         },
//                                         '& .MuiInputLabel-root': {
//                                             color: theme.darkTextSecondary,
//                                         },
//                                     }}
//                                 />
//                             </Grid>
//                         </>
//                     )}
                    
//                     <Grid item xs={12} md={6}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel sx={{ color: theme.darkTextSecondary }}>Payment Mode</InputLabel>
//                             <Select
//                                 name="payment_mode"
//                                 value={formData.payment_mode}
//                                 onChange={handleChange}
//                                 label="Payment Mode"
//                                 disabled={submitting}
//                                 sx={{
//                                     color: theme.darkTextPrimary,
//                                     '& .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.grey300,
//                                     },
//                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="">Select</MenuItem>
//                                 {paymentModes.map((mode) => (
//                                     <MenuItem key={mode} value={mode}>{mode}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>
                    
//                     <Grid item xs={12} md={6}>
//                         <TextField
//                             fullWidth
//                             label="Payment Date"
//                             name="payment_date"
//                             type="date"
//                             value={formData.payment_date}
//                             onChange={handleChange}
//                             variant="outlined"
//                             size="small"
//                             InputLabelProps={{ shrink: true }}
//                             disabled={submitting}
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     '& fieldset': {
//                                         borderColor: theme.grey300,
//                                     },
//                                     '&:hover fieldset': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                     '&.Mui-focused fieldset': {
//                                         borderColor: theme.primaryMain,
//                                     },
//                                 },
//                                 '& .MuiInputLabel-root': {
//                                     color: theme.darkTextSecondary,
//                                 },
//                                 '& .MuiInputBase-input': {
//                                     color: theme.darkTextPrimary,
//                                 },
//                             }}
//                         />
//                     </Grid>
//                 </Grid>
//             </CardContent>
//         </Card>
//     )
// );

// // Summary Card Component
// const SummaryCard = ({ formData, isAdmissionForm }) => (
//     <Card variant="outlined" sx={{ 
//         mb: 3, 
//         borderRadius: 2, 
//         backgroundColor: theme.grey100,
//         borderColor: theme.grey200
//     }}>
//         <CardContent>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <AssignmentIcon sx={{ mr: 1, color: theme.primaryMain }} />
//                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.darkTextTitle }}>
//                     Summary
//                 </Typography>
//             </Box>
            
//             <Grid container spacing={1.5}>
//                 <Grid item xs={12} md={6}>
//                     <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                         <strong style={{ color: theme.darkTextSecondary }}>Student:</strong> {formData.name || 'Not provided'}
//                     </Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                         <strong style={{ color: theme.darkTextSecondary }}>Contact:</strong> {formData.contact_number || 'Not provided'}
//                     </Typography>
//                 </Grid>
                
//                 {isAdmissionForm ? (
//                     <>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Admission Date:</strong> {formData.date_of_admission || 'Not selected'}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Course:</strong> {formData.course_name || 'Not selected'}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Qualification:</strong> {formData.qualification || 'Not selected'}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
//                                 <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                     <strong style={{ color: theme.darkTextSecondary }}>Total:</strong> 
//                                     <span style={{ color: theme.primaryMain, fontWeight: 'bold', marginLeft: 4 }}>
//                                         ₹{(parseFloat(formData.total_fees) || 0).toLocaleString()}
//                                     </span>
//                                 </Typography>
//                                 <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                     <strong style={{ color: theme.darkTextSecondary }}>Submitted:</strong> 
//                                     <span style={{ color: theme.successMain, fontWeight: 'bold', marginLeft: 4 }}>
//                                         ₹{(parseFloat(formData.fees_submitted) || 0).toLocaleString()}
//                                     </span>
//                                 </Typography>
//                                 <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                     <strong style={{ color: theme.darkTextSecondary }}>Pending:</strong> 
//                                     <span style={{ 
//                                         color: parseFloat(formData.fees_pending || 0) > 0 ? theme.errorMain : theme.successMain, 
//                                         fontWeight: 'bold', 
//                                         marginLeft: 4 
//                                     }}>
//                                         ₹{(parseFloat(formData.fees_pending) || 0).toLocaleString()}
//                                     </span>
//                                 </Typography>
//                             </Box>
//                         </Grid>
//                     </>
//                 ) : (
//                     <>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Enquiry Type:</strong> {formData.enquiry_type || 'Not selected'}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Course:</strong> {formData.course_name || 'Not selected'}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Preferred Timing:</strong> {formData.preferred_timing || 'Not specified'}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Typography variant="body2" sx={{ color: theme.darkTextPrimary }}>
//                                 <strong style={{ color: theme.darkTextSecondary }}>Registration Fee:</strong> 
//                                 <span style={{ 
//                                     fontWeight: 'bold', 
//                                     color: parseFloat(formData.registration_fee || 0) > 0 ? theme.successMain : theme.errorMain,
//                                     marginLeft: 4
//                                 }}>
//                                     ₹{(parseFloat(formData.registration_fee) || 0).toLocaleString()} 
//                                     {parseFloat(formData.registration_fee || 0) === 100 ? ' (Required)' : ' (Not Paid)'}
//                                 </span>
//                             </Typography>
//                         </Grid>
//                     </>
//                 )}
//             </Grid>
//         </CardContent>
//     </Card>
// );

// // Main Component
// const AdmissionForm = () => {
//     // Toggle state for form type
//     const [isAdmissionForm, setIsAdmissionForm] = useState(true);
    
//     // API states
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [courses, setCourses] = useState([]);
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: '',
//         severity: 'success'
//     });
    
//     // Form state
//     const [formData, setFormData] = useState({
//         // Personal Details
//         name: '',
//         address: '',
//         contact_number: '',
//         parent_contact: '',
//         date_of_birth: '',
//         email: '',
//         gender: '',
        
//         // Academic Details
//         qualification: '',
//         course_name: '',
        
//         // Admission Details
//         date_of_admission: new Date().toISOString().split('T')[0],
        
//         // Fees
//         total_fees: '',
//         fees_submitted: '',
//         fees_pending: '',
//         payment_mode: '',
//         payment_date: new Date().toISOString().split('T')[0],
        
//         // Enquiry specific
//         enquiry_type: '',
//         preferred_timing: '',
//         registration_fee: '',
        
//         // Additional fields for API
//         admission_type: 1,
//         student_status: 3,
//         admission_step: 0
//     });

//     // Form errors
//     const [errors, setErrors] = useState({});
//     const [showRegistrationFee, setShowRegistrationFee] = useState(false);

//     // Static data
//     const qualifications = [
//         '10th Pass',
//         '12th Pass',
//         'Graduate',
//         'Post Graduate',
//         'Diploma',
//         'Other'
//     ];

//     const enquiryTypes = [
//         'Course Information',
//         'Fee Structure',
//         'Batch Timings',
//         'Faculty Details',
//         'Infrastructure',
//         'Scholarship',
//         'Other'
//     ];

//     const timingSlots = [
//         'Morning (7 AM - 10 AM)',
//         'Afternoon (2 PM - 5 PM)',
//         'Evening (5 PM - 8 PM)',
//         'Weekend Batch',
//         'Flexible Timing'
//     ];

//     const paymentModes = [
//         'Cash',
//         'Cheque',
//         'Online Transfer',
//         'UPI',
//         'Card',
//         'Bank Transfer'
//     ];

//     // Fetch courses from API
//     const fetchCourses = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_URL}get_all_courses`, {
//                 params: {
//                     page: 1,
//                     limit: 100,
//                     active: 1
//                 }
//             });

//             if (response.data.success) {
//                 const coursesData = response.data.data || [];
//                 setCourses(coursesData);
//             } else {
//                 setSnackbar({
//                     open: true,
//                     message: 'Failed to fetch courses',
//                     severity: 'error'
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching courses:', error);
//             setSnackbar({
//                 open: true,
//                 message: 'Error fetching courses',
//                 severity: 'error'
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, []);

//     const handleFormTypeChange = (event) => {
//         const isAdmission = event.target.checked;
//         setIsAdmissionForm(isAdmission);
//         setErrors({});
        
//         // Reset form when switching
//         setFormData({
//             name: '',
//             address: '',
//             contact_number: '',
//             parent_contact: '',
//             date_of_birth: '',
//             email: '',
//             gender: '',
//             qualification: '',
//             course_name: '',
//             date_of_admission: new Date().toISOString().split('T')[0],
//             total_fees: '',
//             fees_submitted: '',
//             fees_pending: '',
//             payment_mode: '',
//             payment_date: new Date().toISOString().split('T')[0],
//             enquiry_type: '',
//             preferred_timing: '',
//             registration_fee: '',
//             admission_type: isAdmission ? 1 : 0,
//             student_status: isAdmission ? 3 : 0,
//             admission_step: 0
//         });
//         setShowRegistrationFee(false);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
        
//         // Clear error for this field
//         setErrors(prev => ({ ...prev, [name]: '' }));
        
//         let updatedData = {
//             ...formData,
//             [name]: value
//         };
        
//         // Calculate pending fees if total_fees or fees_submitted changes
//         if (name === 'total_fees' || name === 'fees_submitted') {
//             const amount = parseFloat(updatedData.total_fees) || 0;
//             const submitted = parseFloat(updatedData.fees_submitted) || 0;
//             updatedData.fees_pending = (amount - submitted).toFixed(2);
//         }
        
//         // When course changes, auto-populate fees if available
//         if (name === 'course_name' && isAdmissionForm) {
//             const selectedCourse = courses.find(course => course.course_name === value);
//             if (selectedCourse) {
//                 updatedData.total_fees = selectedCourse.fees || '';
//                 const amount = parseFloat(selectedCourse.fees) || 0;
//                 const submitted = parseFloat(updatedData.fees_submitted) || 0;
//                 updatedData.fees_pending = (amount - submitted).toFixed(2);
//             }
//         }
        
//         setFormData(updatedData);
//     };

//     const handleRegistrationFee = () => {
//         setShowRegistrationFee(true);
//         setFormData(prev => ({
//             ...prev,
//             registration_fee: '100',
//             total_fees: '100',
//             fees_submitted: '0',
//             fees_pending: '100'
//         }));
//     };

//     const validateForm = () => {
//         const newErrors = {};
        
//         // Common validations
//         if (!formData.name.trim()) newErrors.name = 'Student name is required';
//         if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
//         else if (!/^\d{10}$/.test(formData.contact_number)) newErrors.contact_number = 'Enter a valid 10-digit mobile number';
        
//         if (!formData.course_name) newErrors.course_name = 'Course selection is required';
        
//         // Admission form specific validations
//         if (isAdmissionForm) {
//             if (!formData.parent_contact.trim()) newErrors.parent_contact = 'Parent/Guardian number is required';
//             else if (!/^\d{10}$/.test(formData.parent_contact)) newErrors.parent_contact = 'Enter a valid 10-digit mobile number';
            
//             if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
//             if (!formData.qualification) newErrors.qualification = 'Qualification is required';
//             if (!formData.date_of_admission) newErrors.date_of_admission = 'Admission date is required';
            
//             if (!formData.total_fees || parseFloat(formData.total_fees) <= 0) 
//                 newErrors.total_fees = 'Total fees must be greater than 0';
            
//             if (formData.fees_submitted && parseFloat(formData.fees_submitted) < 0)
//                 newErrors.fees_submitted = 'Fees submitted cannot be negative';
                
//             if (formData.fees_submitted && parseFloat(formData.fees_submitted) > parseFloat(formData.total_fees))
//                 newErrors.fees_submitted = 'Submitted fees cannot exceed total fees';
//         } 
//         // Enquiry form specific validations
//         else {
//             if (!formData.enquiry_type) newErrors.enquiry_type = 'Enquiry type is required';
            
//             if (!showRegistrationFee && !formData.registration_fee) {
//                 newErrors.registration_fee = 'Registration fee is required';
//             } else if (formData.registration_fee && parseFloat(formData.registration_fee) !== 100) {
//                 newErrors.registration_fee = 'Registration fee must be ₹100';
//             }
//         }
        
//         return newErrors;
//     };

//     const prepareApiData = () => {
//         const admission_type = isAdmissionForm ? 1 : 0;
//         const total_fees = parseFloat(formData.total_fees) || 0;
//         const fees_submitted = parseFloat(formData.fees_submitted) || 0;
//         const registration_fee = parseFloat(formData.registration_fee) || 0;
        
//         const finalTotalFees = admission_type === 0 && registration_fee > 0 ? registration_fee : total_fees;
//         const finalSubmittedFees = admission_type === 0 && registration_fee > 0 ? fees_submitted : fees_submitted;
//         const fees_pending = finalTotalFees - finalSubmittedFees;
        
//         let admission_step = 0;
//         if (admission_type === 0 && registration_fee > 0 && finalSubmittedFees >= registration_fee) {
//             admission_step = 1;
//         } else if (admission_type === 1 && finalSubmittedFees > 0) {
//             admission_step = 2;
//         }

//         const apiData = {
//             admission_type: admission_type,
//             name: formData.name,
//             address: formData.address,
//             contact_number: formData.contact_number,
//             parent_contact: formData.parent_contact,
//             date_of_birth: formData.date_of_birth,
//             qualification: formData.qualification,
//             course_name: formData.course_name,
//             date_of_admission: formData.date_of_admission,
//             total_fees: finalTotalFees,
//             fees_submitted: finalSubmittedFees,
//             enquiry_type: formData.enquiry_type,
//             preferred_timing: formData.preferred_timing,
//             registration_fee: registration_fee,
//             payment_mode: formData.payment_mode,
//             payment_date: formData.payment_date,
//             email: formData.email,
//             gender: formData.gender ? parseInt(formData.gender) : 1,
//             student_status: admission_type === 1 ? 3 : 0,
//             admission_step: admission_step
//         };

//         Object.keys(apiData).forEach(key => {
//             if (apiData[key] === '' || apiData[key] === undefined) {
//                 delete apiData[key];
//             }
//         });

//         return apiData;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         const validationErrors = validateForm();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             setSnackbar({
//                 open: true,
//                 message: 'Please fix the errors in the form',
//                 severity: 'error'
//             });
//             return;
//         }
        
//         if (!isAdmissionForm && !showRegistrationFee && !formData.registration_fee) {
//             const confirmEnquiry = window.confirm('Do you want to pay ₹100 registration fee to proceed with the enquiry?');
//             if (confirmEnquiry) {
//                 handleRegistrationFee();
//                 return;
//             } else {
//                 setSnackbar({
//                     open: true,
//                     message: 'Registration fee is required to process your enquiry',
//                     severity: 'warning'
//                 });
//                 return;
//             }
//         }
        
//         setSubmitting(true);
        
//         try {
//             const apiData = prepareApiData();
            
//             const response = await axios.post(`${API_URL}create_student_record`, apiData, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
            
//             if (response.data.success) {
//                 setSnackbar({
//                     open: true,
//                     message: response.data.message || 
//                            (isAdmissionForm ? 'Admission created successfully!' : 'Enquiry created successfully!'),
//                     severity: 'success'
//                 });
                
//                 // Reset form on success
//                 setFormData({
//                     name: '',
//                     address: '',
//                     contact_number: '',
//                     parent_contact: '',
//                     date_of_birth: '',
//                     email: '',
//                     gender: '',
//                     qualification: '',
//                     course_name: '',
//                     date_of_admission: new Date().toISOString().split('T')[0],
//                     total_fees: '',
//                     fees_submitted: '',
//                     fees_pending: '',
//                     payment_mode: '',
//                     payment_date: new Date().toISOString().split('T')[0],
//                     enquiry_type: '',
//                     preferred_timing: '',
//                     registration_fee: '',
//                     admission_type: isAdmissionForm ? 1 : 0,
//                     student_status: isAdmissionForm ? 3 : 0,
//                     admission_step: 0
//                 });
//                 setShowRegistrationFee(false);
//                 setErrors({});
//             } else {
//                 setSnackbar({
//                     open: true,
//                     message: response.data.message || 'Submission failed',
//                     severity: 'error'
//                 });
//             }
//         } catch (error) {
//             console.error('API Error:', error);
//             const errorMessage = error.response?.data?.message || 
//                                error.response?.data?.error || 
//                                'Network error. Please try again.';
//             setSnackbar({
//                 open: true,
//                 message: errorMessage,
//                 severity: 'error'
//             });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbar({ ...snackbar, open: false });
//     };

//     return (
//         <Box sx={{ 
//             minHeight: '100vh', 
//             backgroundColor: theme.darkBackground,
//             py: 4
//         }}>
//             <Container maxWidth="lg">
//                 {/* Snackbar for notifications */}
//                 <Snackbar
//                     open={snackbar.open}
//                     autoHideDuration={6000}
//                     onClose={handleCloseSnackbar}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//                 >
//                     <Alert 
//                         onClose={handleCloseSnackbar} 
//                         severity={snackbar.severity} 
//                         sx={{ 
//                             width: '100%',
//                             backgroundColor: snackbar.severity === 'success' ? theme.successLight :
//                                            snackbar.severity === 'error' ? theme.errorLight :
//                                            snackbar.severity === 'warning' ? theme.warningLight : theme.primaryLight,
//                             color: theme.darkTextTitle,
//                             '& .MuiAlert-icon': {
//                                 color: snackbar.severity === 'success' ? theme.successDark :
//                                        snackbar.severity === 'error' ? theme.errorDark :
//                                        snackbar.severity === 'warning' ? theme.warningDark : theme.primaryDark
//                             }
//                         }}
//                     >
//                         {snackbar.message}
//                     </Alert>
//                 </Snackbar>

//                 {/* Form Type Toggle */}
//                 <FormTypeToggle
//                     isAdmissionForm={isAdmissionForm}
//                     handleFormTypeChange={handleFormTypeChange}
//                     submitting={submitting}
//                 />

//                 {/* Info Alert for Enquiry Form */}
//                 {!isAdmissionForm && (
//                     <Alert 
//                         severity="info" 
//                         sx={{ 
//                             mb: 3, 
//                             backgroundColor: theme.primary200,
//                             border: `1px solid ${theme.primaryLight}`,
//                             borderRadius: 2,
//                             color: theme.darkTextTitle,
//                             '& .MuiAlert-icon': {
//                                 color: theme.primary800
//                             }
//                         }}
//                     >
//                         <Typography variant="body2">
//                             <strong>Note:</strong> A registration fee of ₹100 is required to process your enquiry. 
//                             This amount will be adjusted against your admission fees if you choose to enroll later.
//                         </Typography>
//                     </Alert>
//                 )}

//                 {/* Main Form Card */}
//                 <Card elevation={0} sx={{ 
//                     borderRadius: 2, 
//                     border: `1px solid ${theme.grey200}`,
//                     backgroundColor: theme.paper
//                 }}>
//                     <CardContent sx={{ p: 4 }}>
//                         {/* Form Header */}
//                         <Box sx={{ textAlign: 'center', mb: 4 }}>
//                             <Typography variant="h4" sx={{ 
//                                 fontWeight: 'bold', 
//                                 color: isAdmissionForm ? theme.primaryMain : theme.secondaryMain,
//                                 mb: 1
//                             }}>
//                                 {isAdmissionForm ? 'Student Admission Form' : 'Student Enquiry Form'}
//                             </Typography>
//                             <Typography variant="body1" sx={{ color: theme.darkTextSecondary }}>
//                                 Please fill all the required fields carefully
//                             </Typography>
//                         </Box>

//                         <form onSubmit={handleSubmit}>
//                             {/* Personal Details Section */}
//                             <PersonalDetailsSection
//                                 formData={formData}
//                                 errors={errors}
//                                 handleChange={handleChange}
//                                 isAdmissionForm={isAdmissionForm}
//                                 submitting={submitting}
//                             />

//                             {/* Academic Details Section */}
//                             <AcademicDetailsSection
//                                 formData={formData}
//                                 errors={errors}
//                                 handleChange={handleChange}
//                                 isAdmissionForm={isAdmissionForm}
//                                 submitting={submitting}
//                                 courses={courses}
//                                 loading={loading}
//                                 qualifications={qualifications}
//                                 enquiryTypes={enquiryTypes}
//                                 timingSlots={timingSlots}
//                             />

//                             {/* Fees Details Section */}
//                             <FeesDetailsSection
//                                 formData={formData}
//                                 errors={errors}
//                                 handleChange={handleChange}
//                                 isAdmissionForm={isAdmissionForm}
//                                 submitting={submitting}
//                                 showRegistrationFee={showRegistrationFee}
//                                 paymentModes={paymentModes}
//                             />

//                             {/* Summary Card */}
//                             <SummaryCard
//                                 formData={formData}
//                                 isAdmissionForm={isAdmissionForm}
//                             />

//                             {/* Action Buttons */}
//                             <Box sx={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'center', 
//                                 gap: 3, 
//                                 mt: 4,
//                                 flexWrap: 'wrap'
//                             }}>
//                                 {!isAdmissionForm && !showRegistrationFee && !formData.registration_fee && (
//                                     <Button
//                                         variant="outlined"
//                                         size="large"
//                                         onClick={handleRegistrationFee}
//                                         sx={{
//                                             px: 4,
//                                             py: 1.5,
//                                             borderRadius: 2,
//                                             fontWeight: 'bold',
//                                             borderColor: theme.secondaryMain,
//                                             color: theme.secondaryMain,
//                                             '&:hover': {
//                                                 borderColor: theme.secondaryDark,
//                                                 backgroundColor: `${theme.secondaryLight}20`,
//                                             }
//                                         }}
//                                         disabled={submitting}
//                                     >
//                                         Add ₹100 Registration Fee
//                                     </Button>
//                                 )}
                                
//                                 <Button
//                                     variant="contained"
//                                     type="submit"
//                                     size="large"
//                                     disabled={submitting || loading}
//                                     sx={{
//                                         px: 5,
//                                         py: 1.5,
//                                         borderRadius: 2,
//                                         fontWeight: 'bold',
//                                         fontSize: '1rem',
//                                         background: isAdmissionForm 
//                                             ? `linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primaryMain} 100%)`
//                                             : `linear-gradient(135deg, ${theme.secondaryDark} 0%, ${theme.secondaryMain} 100%)`,
//                                         boxShadow: 2,
//                                         '&:hover': {
//                                             boxShadow: 4,
//                                             transform: 'translateY(-1px)',
//                                             background: isAdmissionForm 
//                                                 ? `linear-gradient(135deg, ${theme.primary800} 0%, ${theme.primaryDark} 100%)`
//                                                 : `linear-gradient(135deg, ${theme.secondary800} 0%, ${theme.secondaryDark} 100%)`,
//                                         },
//                                         '&:disabled': {
//                                             opacity: 0.7,
//                                             background: isAdmissionForm ? theme.primary200 : theme.secondary200,
//                                         }
//                                     }}
//                                 >
//                                     {submitting ? (
//                                         <>
//                                             <CircularProgress size={24} sx={{ color: theme.darkTextTitle, mr: 1 }} />
//                                             Processing...
//                                         </>
//                                     ) : isAdmissionForm ? 'Submit Admission' : 'Submit Enquiry'}
//                                 </Button>
//                             </Box>
//                         </form>
//                     </CardContent>
//                 </Card>
//             </Container>
//         </Box>
//     );
// };

// export default AdmissionForm;