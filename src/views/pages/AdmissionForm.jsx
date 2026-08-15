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
    Alert,
    Switch,
    FormControlLabel,
    Paper,
    Snackbar,
    CircularProgress,
    FormHelperText,
    Container
} from '@mui/material';
import {
    Person as PersonIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    School as SchoolIcon,
    Payment as PaymentIcon,
    Email as EmailIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { IconSchool, IconMessageCircleQuestion } from '@tabler/icons-react';
import axios from 'axios';

// ====== CHANGE THIS TO YOUR ACTUAL API BASE URL ======
const API_URL = 'http://localhost:3003/coaching/adminapi/';

// ====== STYLES ======
const whiteBorderSx = {
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#71707097' },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2d8bfdec' },
};

const referrerOptions = ['Friends', 'Family', 'Facebook', 'Instagram', 'Ad', 'Advertisement', 'Google', 'YouTube', 'Other'];

// ====== SUB-COMPONENTS ======

const FormTypeToggle = ({ isAdmissionForm, handleFormTypeChange, submitting }) => (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, width: '100%', maxWidth: 500, border: isAdmissionForm ? '1px solid #0066ff92' : '1px solid #ff8c007f' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ color: isAdmissionForm ? '#1280ee' : '#f9992b', fontWeight: 'bold' }}>
                    {isAdmissionForm ? <IconSchool size={24} color="#1280ee" /> : <IconMessageCircleQuestion size={24} />}
                    {isAdmissionForm ? ' Admission Portal' : ' Enquiry Portal'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {isAdmissionForm ? 'Complete the form below to enroll as a student' : 'Fill the enquiry form to get more information'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ color: !isAdmissionForm ? '#f9992b' : 'text.secondary', fontWeight: !isAdmissionForm ? 'bold' : 'normal' }}>
                    Enquiry
                </Typography>
                <FormControlLabel
                    control={<Switch checked={isAdmissionForm} onChange={handleFormTypeChange} color="primary" size="medium" disabled={submitting} />}
                    label=""
                />
                <Typography variant="body1" sx={{ color: isAdmissionForm ? '#1976d2' : 'text.secondary', fontWeight: isAdmissionForm ? 'bold' : 'normal' }}>
                    Admission
                </Typography>
            </Box>
        </Paper>
    </Box>
);

const PersonalDetailsSection = ({ formData, errors, handleChange, isAdmissionForm, submitting }) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 1, color: isAdmissionForm ? '#1280ee' : '#f9992b' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>Personal Information</Typography>
            </Box>
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required fullWidth label="Student Name" name="name"
                        value={formData.name} onChange={handleChange} variant="outlined" size="small"
                        error={!!errors.name} helperText={errors.name} disabled={submitting}
                        placeholder="Enter full name" sx={whiteBorderSx}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth label="Email Address" name="email" type="email"
                        value={formData.email} onChange={handleChange} variant="outlined" size="small"
                        placeholder="student@example.com" error={!!errors.email} helperText={errors.email}
                        disabled={submitting} sx={whiteBorderSx}
                        InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} /> }}
                    />
                </Grid>
                <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
                    <TextField
                        required={isAdmissionForm} fullWidth label="Date of Birth" name="date_of_birth" type="date"
                        value={formData.date_of_birth} onChange={handleChange} variant="outlined" size="small"
                        InputLabelProps={{ shrink: true }} error={!!errors.date_of_birth} helperText={errors.date_of_birth}
                        disabled={submitting} sx={{ ...whiteBorderSx, "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
                        InputProps={{ startAdornment: <CalendarIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 17 }} /> }}
                    />
                </Grid>
                {isAdmissionForm && (
                    <Grid item xs={12} md={4}>
                        <TextField
                            required fullWidth label="Admission Date" name="date_of_admission" type="date"
                            value={formData.date_of_admission} onChange={handleChange} variant="outlined" size="small"
                            InputLabelProps={{ shrink: true }} error={!!errors.date_of_admission} helperText={errors.date_of_admission}
                            disabled={submitting} sx={{ ...whiteBorderSx, "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
                    <FormControl fullWidth size="small" required error={!!errors.gender} sx={whiteBorderSx}>
                        <InputLabel>Gender</InputLabel>
                        <Select name="gender" value={formData.gender} onChange={handleChange} label="Gender" disabled={submitting}>
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
                        required fullWidth label="Contact Number" name="contact_number"
                        value={formData.contact_number} onChange={handleChange} variant="outlined" size="small"
                        placeholder="9876543210" error={!!errors.contact_number} helperText={errors.contact_number}
                        disabled={submitting} sx={whiteBorderSx}
                        InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} /> }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required={isAdmissionForm} fullWidth label="Parent/Guardian Number" name="parent_contact"
                        value={formData.parent_contact} onChange={handleChange} variant="outlined" size="small"
                        placeholder="9876543210" error={!!errors.parent_contact} helperText={errors.parent_contact}
                        disabled={submitting} sx={whiteBorderSx}
                        InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} /> }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth label="Complete Address" name="address" multiline rows={2}
                        value={formData.address} onChange={handleChange} variant="outlined" size="small"
                        placeholder="House no, Street, City, State, Pincode" error={!!errors.address} helperText={errors.address}
                        disabled={submitting} sx={whiteBorderSx}
                        InputProps={{ startAdornment: <LocationIcon sx={{ mb: 3, mr: 1, color: '#7f8c8d', fontSize: 20 }} /> }}
                    />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

const AcademicDetailsSection = ({
    formData, errors, handleChange, isAdmissionForm, submitting,
    courses, loading, qualifications, enquiryTypes, timingSlots
}) => (
    <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ mr: 1, color: isAdmissionForm ? '#1280ee' : '#f9992b' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>
                    {isAdmissionForm ? 'Academic Details' : 'Course Details'}
                </Typography>
            </Box>
            <Grid container spacing={2.5}>
                {isAdmissionForm ? (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.qualification} sx={whiteBorderSx}>
                            <InputLabel>Highest Qualification</InputLabel>
                            <Select name="qualification" value={formData.qualification} onChange={handleChange} label="Highest Qualification" disabled={submitting}>
                                <MenuItem value="">Select</MenuItem>
                                {qualifications.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                            </Select>
                            {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                        </FormControl>
                    </Grid>
                ) : (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.enquiry_type} sx={whiteBorderSx}>
                            <InputLabel>Enquiry Purpose</InputLabel>
                            <Select name="enquiry_type" value={formData.enquiry_type} onChange={handleChange} label="Enquiry Purpose" disabled={submitting}>
                                <MenuItem value="">Select</MenuItem>
                                {enquiryTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </Select>
                            {errors.enquiry_type && <FormHelperText>{errors.enquiry_type}</FormHelperText>}
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
                        <InputLabel>Select Course</InputLabel>
                        <Select name="course_name" value={formData.course_name} onChange={handleChange} label="Select Course">
                            <MenuItem value="">Select Course</MenuItem>
                            {courses.map(course => (
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
                    <>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small" sx={whiteBorderSx}>
                                <InputLabel>Enquiry Timing</InputLabel>
                                <Select name="preferred_timing" value={formData.preferred_timing} onChange={handleChange} label="Preferred Timing" disabled={submitting}>
                                    <MenuItem value="">Select</MenuItem>
                                    {timingSlots.map(slot => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small" sx={whiteBorderSx}>
                                <InputLabel>How did you hear about us?</InputLabel>
                                <Select name="enquiry_source" value={formData.enquiry_source} onChange={handleChange} label="How did you hear about us?" disabled={submitting}>
                                    <MenuItem value="">Select</MenuItem>
                                    {referrerOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                )}
            </Grid>
        </CardContent>
    </Card>
);

const CourseDetailsSection = ({
    formData, errors, handleChange, isAdmissionForm, submitting,
    courses, loading, timingSlots
}) => (
    isAdmissionForm && (
        <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SchoolIcon sx={{ mr: 1, color: '#1280ee' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>Course Details</Typography>
                </Box>
                <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.course_name} sx={whiteBorderSx}>
                            <InputLabel>Course</InputLabel>
                            <Select name="course_name" value={formData.course_name} onChange={handleChange} label="Course" disabled={submitting || loading}>
                                <MenuItem value="">Select Course</MenuItem>
                                {courses.map(course => (
                                    <MenuItem key={course.course_id} value={course.course_name}>{course.course_name}</MenuItem>
                                ))}
                            </Select>
                            {errors.course_name && <FormHelperText>{errors.course_name}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" sx={whiteBorderSx}>
                            <InputLabel>Batch Timing</InputLabel>
                            <Select name="batch_timing" value={formData.batch_timing} onChange={handleChange} label="Batch Timing" disabled={submitting}>
                                <MenuItem value="">Select Timing</MenuItem>
                                {timingSlots.map(slot => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" sx={whiteBorderSx}>
                            <InputLabel>How did you hear about us?</InputLabel>
                            <Select name="enquiry_source" value={formData.enquiry_source} onChange={handleChange} label="How did you hear about us?" disabled={submitting}>
                                <MenuItem value="">Select</MenuItem>
                                {referrerOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
);

const FeesDetailsSection = ({
    formData, errors, handleChange, isAdmissionForm, submitting,
    showRegistrationFee, paymentModes
}) => {
    const getToday = () => new Date().toISOString().split('T')[0];
    return (
        (isAdmissionForm || showRegistrationFee) && (
            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <PaymentIcon sx={{ mr: 1, color: isAdmissionForm ? '#1976d2' : '#f9992b' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>
                            {isAdmissionForm ? 'Fees Structure' : 'Registration Fee'}
                        </Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                        {isAdmissionForm ? (
                            <>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        required fullWidth label="Total Course Fees" name="total_fees" type="number"
                                        value={formData.total_fees} onChange={handleChange} variant="outlined" size="small"
                                        error={!!errors.total_fees} helperText={errors.total_fees} disabled={submitting}
                                        sx={whiteBorderSx} InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography> }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth label="Fees Submitted" name="fees_submitted" type="number"
                                        value={formData.fees_submitted} onChange={handleChange} variant="outlined" size="small"
                                        error={!!errors.fees_submitted} helperText={errors.fees_submitted} disabled={submitting}
                                        sx={whiteBorderSx} InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography> }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth label="Fees Pending" name="fees_pending"
                                        value={formData.fees_pending} variant="outlined" size="small" sx={whiteBorderSx}
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>,
                                            style: { fontWeight: 'bold', color: parseFloat(formData.fees_pending || 0) > 0 ? '#d32f2f' : '#2e7d32' }
                                        }}
                                        disabled={submitting}
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Registration Fee" name="registration_fee"
                                        value={formData.registration_fee || 100} onChange={handleChange} variant="outlined" size="small"
                                        sx={whiteBorderSx} InputProps={{
                                            readOnly: true,
                                            startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>,
                                            style: { fontWeight: 'bold', color: '#f9992b' }
                                        }}
                                        helperText="Mandatory for enquiry processing"
                                        error={!!errors.registration_fee}
                                        disabled={submitting}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Payment Status"
                                        value={parseFloat(formData.registration_fee || 0) === 100 ? "✅ Paid" : "⏳ Pending"}
                                        variant="outlined" size="small" sx={whiteBorderSx}
                                        InputProps={{
                                            readOnly: true,
                                            style: { fontWeight: 'bold', color: parseFloat(formData.registration_fee || 0) === 100 ? '#2e7d32' : '#d32f2f' }
                                        }}
                                        disabled={submitting}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small" sx={whiteBorderSx}>
                                <InputLabel>Payment Mode</InputLabel>
                                <Select name="payment_mode" value={formData.payment_mode} onChange={handleChange} label="Payment Mode" disabled={submitting}>
                                    <MenuItem value="">Select</MenuItem>
                                    {paymentModes.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="Payment Date" name="payment_date" type="date"
                                value={formData.payment_date} onChange={handleChange} variant="outlined" size="small"
                                InputLabelProps={{ shrink: true }} disabled={submitting}
                                sx={{ ...whiteBorderSx, "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    );
};

const SummaryCard = ({ formData, isAdmissionForm }) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#141414', fontSize: '15px' }}>Summary</Typography>
            </Box>
            <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong style={{ color: '#070707dc' }}>Student:</strong> {formData.name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong style={{ color: '#070707dc' }}>Contact:</strong> {formData.contact_number || 'Not provided'}</Typography>
                </Grid>
                {isAdmissionForm ? (
                    <>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2"><strong style={{ color: '#070707dc' }}>Admission Date:</strong> {formData.date_of_admission || 'Not selected'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2"><strong style={{ color: '#070707dc' }}>Course:</strong> {formData.course_name || 'Not selected'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2"><strong style={{ color: '#070707dc' }}>Qualification:</strong> {formData.qualification || 'Not selected'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                <Typography variant="body2"><strong style={{ color: '#555' }}>Total:</strong> <span style={{ color: '#1976d2', fontWeight: 'bold' }}>₹{(parseFloat(formData.total_fees) || 0).toLocaleString()}</span></Typography>
                                <Typography variant="body2"><strong style={{ color: '#555' }}>Submitted:</strong> <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>₹{(parseFloat(formData.fees_submitted) || 0).toLocaleString()}</span></Typography>
                                <Typography variant="body2"><strong style={{ color: '#555' }}>Pending:</strong> <span style={{ color: parseFloat(formData.fees_pending || 0) > 0 ? '#d32f2f' : '#f59037', fontWeight: 'bold' }}>₹{(parseFloat(formData.fees_pending) || 0).toLocaleString()}</span></Typography>
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2"><strong style={{ color: '#555' }}>Enquiry Type:</strong> {formData.enquiry_type || 'Not selected'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2"><strong style={{ color: '#555' }}>Course:</strong> {formData.course_name || 'Not selected'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2"><strong style={{ color: '#555' }}>Preferred Timing:</strong> {formData.preferred_timing || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2"><strong style={{ color: '#555' }}>Registration Fee:</strong> <span style={{ fontWeight: 'bold', color: parseFloat(formData.registration_fee || 0) === 100 ? '#2e7d32' : '#d32f2f' }}>₹{(parseFloat(formData.registration_fee) || 0).toLocaleString()} {parseFloat(formData.registration_fee || 0) === 100 ? '(Paid)' : '(Not Paid)'}</span></Typography>
                        </Grid>
                    </>
                )}
            </Grid>
        </CardContent>
    </Card>
);

// ====== MAIN COMPONENT ======
const AdmissionForm = () => {
    const getToday = () => new Date().toISOString().split('T')[0];

    const [isAdmissionForm, setIsAdmissionForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        name: '', address: '', contact_number: '', parent_contact: '', date_of_birth: '', email: '', gender: '',
        qualification: '', course_name: '',
        date_of_admission: getToday(),
        total_fees: '', fees_submitted: '', fees_pending: '', payment_mode: '', payment_date: getToday(),
        enquiry_type: '', preferred_timing: '', registration_fee: '', enquiry_source: '', batch_timing: '',
        reference_by: '', zipcode: '',
        admission_type: 1
    });

    const [errors, setErrors] = useState({});
    const [showRegistrationFee, setShowRegistrationFee] = useState(false);

    const qualifications = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'Other'];
    const enquiryTypes = ['Course Information', 'Fee Structure', 'Batch Timings', 'Faculty Details', 'Infrastructure', 'Scholarship', 'Other'];
    const timingSlots = ['Morning (7 AM - 10 AM)', 'Afternoon (2 PM - 5 PM)', 'Evening (5 PM - 8 PM)', 'Weekend Batch', 'Flexible Timing'];
    const paymentModes = ['Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card', 'Bank Transfer'];

    // ====== FIXED fetchCourses with pagination parameters ======
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_courses`, {
                params: {
                    page: 1,
                    limit: 1000,     // Get all courses
                    search: ''
                }
            });

            if (response.data.success) {
                const coursesData = response.data.data || [];
                setCourses(coursesData);
            } else {
                setSnackbar({
                    open: true,
                    message: response.data.msg || 'Failed to fetch courses',
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
        const admission = event.target.checked;
        setIsAdmissionForm(admission);
        setFormData({
            name: '', address: '', contact_number: '', parent_contact: '', date_of_birth: '', email: '', gender: '',
            qualification: '', course_name: '',
            date_of_admission: admission ? getToday() : '',
            total_fees: '', fees_submitted: '', fees_pending: '', payment_mode: '', payment_date: getToday(),
            enquiry_type: '', preferred_timing: '', registration_fee: '', enquiry_source: '', batch_timing: '',
            reference_by: '', zipcode: '',
            admission_type: admission ? 1 : 0
        });
        setErrors({});
        setShowRegistrationFee(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setErrors(prev => ({ ...prev, [name]: '' }));
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'total_fees' || name === 'fees_submitted') {
                const total = Number(updated.total_fees) || 0;
                const submitted = Number(updated.fees_submitted) || 0;
                updated.fees_pending = Math.max(total - submitted, 0).toFixed(2);
            }
            if (name === 'course_name' && isAdmissionForm) {
                const selectedCourse = courses.find(c => c.course_name === value);
                if (selectedCourse) {
                    const courseFees = selectedCourse.fees || selectedCourse.minimum_fees || 0;
                    const submitted = Number(updated.fees_submitted) || 0;
                    updated.total_fees = courseFees;
                    updated.fees_pending = Math.max(Number(courseFees) - submitted, 0).toFixed(2);
                }
            }
            return updated;
        });
    };

    const handleRegistrationFee = () => {
        setShowRegistrationFee(true);
        setFormData(prev => ({
            ...prev,
            registration_fee: '100',
            total_fees: '100',
            fees_submitted: '100',
            fees_pending: '0',
            payment_mode: prev.payment_mode || 'Cash',
            payment_date: getToday()
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Student name is required';
        if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
        else if (!/^[0-9]{10}$/.test(formData.contact_number)) newErrors.contact_number = 'Enter a valid 10-digit mobile number';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
        if (!formData.course_name) newErrors.course_name = 'Course selection is required';

        if (isAdmissionForm) {
            if (!formData.parent_contact.trim()) newErrors.parent_contact = 'Parent/Guardian number is required';
            else if (!/^[0-9]{10}$/.test(formData.parent_contact)) newErrors.parent_contact = 'Enter a valid 10-digit parent mobile number';
            if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
            if (!formData.qualification) newErrors.qualification = 'Qualification is required';
            if (!formData.date_of_admission) newErrors.date_of_admission = 'Admission date is required';
            if (!formData.total_fees || Number(formData.total_fees) <= 0) newErrors.total_fees = 'Total fees must be greater than 0';
            if (Number(formData.fees_submitted) < 0) newErrors.fees_submitted = 'Submitted fees cannot be negative';
            if (Number(formData.fees_submitted) > Number(formData.total_fees)) newErrors.fees_submitted = 'Submitted fees cannot exceed total fees';
        } else {
            if (!formData.enquiry_type) newErrors.enquiry_type = 'Enquiry type is required';
            if (!showRegistrationFee) newErrors.registration_fee = 'Registration fee payment is required';
            if (formData.registration_fee && Number(formData.registration_fee) !== 100) newErrors.registration_fee = 'Registration fee must be ₹100';
        }
        return newErrors;
    };

    const prepareApiData = () => {
        const admissionType = isAdmissionForm ? 1 : 0;
        const totalFees = Number(formData.total_fees) || 0;
        const feesSubmitted = Number(formData.fees_submitted) || 0;
        const registrationFee = Number(formData.registration_fee) || 0;
        return {
            admission_type: admissionType,
            name: formData.name.trim(),
            address: formData.address || null,
            contact_number: formData.contact_number.trim(),
            parent_contact: formData.parent_contact || null,
            date_of_birth: formData.date_of_birth || null,
            qualification: formData.qualification || null,
            course_name: formData.course_name,
            date_of_admission: admissionType === 1 ? formData.date_of_admission : null,
            total_fees: totalFees,
            fees_submitted: feesSubmitted,
            enquiry_type: formData.enquiry_type || null,
            preferred_timing: formData.preferred_timing || null,
            registration_fee: registrationFee,
            payment_mode: formData.payment_mode || null,
            payment_date: formData.payment_date || null,
            batch_timing: formData.batch_timing || null,
            enquiry_source: formData.enquiry_source || null,
            reference_by: formData.reference_by || null,
            email: formData.email || null,
            gender: formData.gender ? Number(formData.gender) : null,
            zipcode: formData.zipcode || null,
            added_by: Number(localStorage.getItem('user_id')) || 0
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSnackbar({ open: true, message: 'Please fix the errors in the form', severity: 'error' });
            return;
        }
        setSubmitting(true);
        try {
            const payload = prepareApiData();
            const response = await axios.post(`${API_URL}create_student_record`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.success) {
                setSnackbar({ open: true, message: response.data.message, severity: 'success' });
                // Reset form
                setFormData({
                    name: '', address: '', contact_number: '', parent_contact: '', date_of_birth: '', email: '', gender: '',
                    qualification: '', course_name: '',
                    date_of_admission: isAdmissionForm ? getToday() : '',
                    total_fees: '', fees_submitted: '', fees_pending: '', payment_mode: '', payment_date: getToday(),
                    enquiry_type: '', preferred_timing: '', registration_fee: '', enquiry_source: '', batch_timing: '',
                    reference_by: '', zipcode: '',
                    admission_type: isAdmissionForm ? 1 : 0
                });
                setErrors({});
                setShowRegistrationFee(false);
            } else {
                setSnackbar({ open: true, message: response.data.message || 'Submission failed', severity: 'error' });
            }
        } catch (error) {
            console.error('Create student record error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || error.response?.data?.error || 'Unable to connect to the server',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>

            <FormTypeToggle isAdmissionForm={isAdmissionForm} handleFormTypeChange={handleFormTypeChange} submitting={submitting} />

            {!isAdmissionForm && (
                <Alert severity="info" sx={{ mb: 3, backgroundColor: '#83818163', borderRadius: 2 }}>
                    <Typography variant="body2">
                        <strong>Note:</strong> A registration fee of ₹100 is required to process your enquiry.
                        This amount will be adjusted against your admission fees if you choose to enroll later.
                    </Typography>
                </Alert>
            )}

            <Card elevation={0} sx={{ borderRadius: 2, border: isAdmissionForm ? '1px solid #0066ff92' : '1px solid #ff8c007f' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: isAdmissionForm ? '#1976d2' : '#f9992b', mb: 1 }}>
                            {isAdmissionForm ? 'Student Admission Form' : 'Student Enquiry Form'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">Please fill all the required fields carefully</Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <PersonalDetailsSection
                            formData={formData} errors={errors} handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm} submitting={submitting}
                        />
                        <AcademicDetailsSection
                            formData={formData} errors={errors} handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm} submitting={submitting}
                            courses={courses} loading={loading}
                            qualifications={qualifications} enquiryTypes={enquiryTypes} timingSlots={timingSlots}
                        />
                        <CourseDetailsSection
                            formData={formData} errors={errors} handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm} submitting={submitting}
                            courses={courses} loading={loading} timingSlots={timingSlots}
                        />
                        <FeesDetailsSection
                            formData={formData} errors={errors} handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm} submitting={submitting}
                            showRegistrationFee={showRegistrationFee} paymentModes={paymentModes}
                        />
                        <SummaryCard formData={formData} isAdmissionForm={isAdmissionForm} />

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4, flexWrap: 'wrap' }}>
                            {!isAdmissionForm && !showRegistrationFee && !formData.registration_fee && (
                                <Button
                                    variant="outlined" color="secondary" size="large"
                                    onClick={handleRegistrationFee}
                                    sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', borderColor: '#f9992b', color: '#f9992b',
                                        '&:hover': { borderColor: '#9b750c', backgroundColor: 'rgba(156, 39, 176, 0.04)' } }}
                                >
                                    Pay Registration Fee ₹100
                                </Button>
                            )}
                            <Button
                                variant="contained" color="primary" size="large" type="submit" disabled={submitting}
                                sx={{ px: 6, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                {submitting ? <CircularProgress size={24} color="inherit" /> :
                                    (isAdmissionForm ? 'Submit Admission' : 'Submit Enquiry')}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdmissionForm;