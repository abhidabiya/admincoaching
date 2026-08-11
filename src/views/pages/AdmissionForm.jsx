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
//     Alert,
//     Snackbar,
//     CircularProgress,
//     FormHelperText,
//     Container,
//     Chip,
//     IconButton,
//     Stack,
//     Switch,
//     FormControlLabel,
//     Paper
// } from '@mui/material';
// import {
//     Person as PersonIcon,
//     Phone as PhoneIcon,
//     LocationOn as LocationIcon,
//     CalendarToday as CalendarIcon,
//     School as SchoolIcon,
//     Payment as PaymentIcon,
//     Email as EmailIcon,
//     Book as BookIcon,
//     People as PeopleIcon,
//     Add as AddIcon,
//     Close as CloseIcon,
//     AccessTime as AccessTimeIcon,
//     Info as InfoIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { API_URL } from 'config/constant';

// // White border style for all input fields
// const whiteBorderSx = {
//     '& .MuiOutlinedInput-notchedOutline': {
//         borderColor: '#71707097',
//     },
//     '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'white',
//     },
//     '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
//         borderColor: '#2d8bfdec',
//     },
// };

// // Main Component
// const AdmissionForm = () => {
//     // API states
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [courses, setCourses] = useState([]);
//     const [teachers, setTeachers] = useState([]);
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
//         qualification: '',
        
//         // Course Details
//         course_type: 'admission', // 'admission' or 'enquiry'
//         course_name: '',
//         batch_time: '',
//         start_date: '',
//         end_date: '',
//         teacher_name: '',
//         referrer: '',
        
//         // Additional Courses
//         additional_courses: [],
        
//         // Admission Details
//         date_of_admission: new Date().toISOString().split('T')[0],
        
//         // Fees
//         total_fees: '',
//         fees_submitted: '',
//         fees_pending: '',
//         payment_mode: '',
//         payment_date: new Date().toISOString().split('T')[0],
        
//         // Additional fields for API
//         admission_type: 1,
//         student_status: 3,
//         admission_step: 0
//     });

//     // Form errors
//     const [errors, setErrors] = useState({});
//     const [showAdditionalCourse, setShowAdditionalCourse] = useState(false);
//     const [newAdditionalCourse, setNewAdditionalCourse] = useState('');
//     const [showEnquiryFields, setShowEnquiryFields] = useState(false);

//     // Static data
//     const qualifications = [
//         '10th Pass',
//         '12th Pass',
//         'Graduate',
//         'Post Graduate',
//         'Diploma',
//         'Other'
//     ];

//     const batchTimes = [
//         'Morning (7 AM - 10 AM)',
//         'Afternoon (2 PM - 5 PM)',
//         'Evening (5 PM - 8 PM)',
//         'Weekend Batch',
//         'Flexible Timing'
//     ];

//     const referrerOptions = [
//         'Friends',
//         'Family',
//         'Facebook',
//         'Instagram',
//         'Ad',
//         'Advertisement',
//         'Google',
//         'YouTube',
//         'Other'
//     ];

//     const paymentModes = [
//         'Cash',
//         'Cheque',
//         'Online Transfer',
//         'UPI',
//         'Card',
//         'Bank Transfer'
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

//     // Fetch teachers from API
//     const fetchTeachers = async () => {
//         try {
//             const response = await axios.get(`${API_URL}get_all_teachers`, {
//                 params: {
//                     active: 1
//                 }
//             });

//             if (response.data.success) {
//                 const teachersData = response.data.data || [];
//                 setTeachers(teachersData);
//             }
//         } catch (error) {
//             console.error('Error fetching teachers:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//         fetchTeachers();
//     }, []);

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
//         if (name === 'course_name') {
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

//     // Handle course type toggle
//     const handleCourseTypeChange = (event) => {
//         const isAdmission = event.target.checked;
//         setFormData(prev => ({
//             ...prev,
//             course_type: isAdmission ? 'admission' : 'enquiry',
//             // Reset enquiry fields when switching to admission
//             enquiry_type: isAdmission ? '' : prev.enquiry_type,
//             preferred_timing: isAdmission ? '' : prev.preferred_timing,
//             // Reset fees when switching to enquiry
//             total_fees: isAdmission ? prev.total_fees : '',
//             fees_submitted: isAdmission ? prev.fees_submitted : '',
//             fees_pending: isAdmission ? prev.fees_pending : '',
//         }));
//         setShowEnquiryFields(!isAdmission);
//         setErrors({});
//     };

//     // Handle adding additional course
//     const handleAddAdditionalCourse = () => {
//         if (newAdditionalCourse.trim()) {
//             setFormData(prev => ({
//                 ...prev,
//                 additional_courses: [...prev.additional_courses, newAdditionalCourse.trim()]
//             }));
//             setNewAdditionalCourse('');
//             setShowAdditionalCourse(false);
//         }
//     };

//     // Handle removing additional course
//     const handleRemoveAdditionalCourse = (courseToRemove) => {
//         setFormData(prev => ({
//             ...prev,
//             additional_courses: prev.additional_courses.filter(course => course !== courseToRemove)
//         }));
//     };

//     const validateForm = () => {
//         const newErrors = {};
        
//         // Personal Details Validations
//         if (!formData.name.trim()) newErrors.name = 'Student name is required';
//         if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
//         else if (!/^\d{10}$/.test(formData.contact_number)) newErrors.contact_number = 'Enter a valid 10-digit mobile number';
        
//         if (!formData.parent_contact.trim()) newErrors.parent_contact = 'Parent/Guardian number is required';
//         else if (!/^\d{10}$/.test(formData.parent_contact)) newErrors.parent_contact = 'Enter a valid 10-digit mobile number';
        
//         if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
//         if (!formData.qualification) newErrors.qualification = 'Qualification is required';
//         if (!formData.date_of_admission) newErrors.date_of_admission = 'Admission date is required';
        
//         // Course Details Validations
//         if (!formData.course_name) newErrors.course_name = 'Course selection is required';
//         if (!formData.batch_time) newErrors.batch_time = 'Batch time is required';
//         if (!formData.start_date) newErrors.start_date = 'Start date is required';
//         if (!formData.end_date) newErrors.end_date = 'End date is required';
//         if (!formData.teacher_name) newErrors.teacher_name = 'Teacher selection is required';
//         if (!formData.referrer) newErrors.referrer = 'Please select how you heard about us';
        
//         // Validate end date is after start date
//         if (formData.start_date && formData.end_date) {
//             const start = new Date(formData.start_date);
//             const end = new Date(formData.end_date);
//             if (end <= start) {
//                 newErrors.end_date = 'End date must be after start date';
//             }
//         }
        
//         // Enquiry specific validations
//         if (formData.course_type === 'enquiry') {
//             if (!formData.enquiry_type) newErrors.enquiry_type = 'Enquiry type is required';
//         }
        
//         // Fees Validations (only for admission)
//         if (formData.course_type === 'admission') {
//             if (!formData.total_fees || parseFloat(formData.total_fees) <= 0) 
//                 newErrors.total_fees = 'Total fees must be greater than 0';
            
//             if (formData.fees_submitted && parseFloat(formData.fees_submitted) < 0)
//                 newErrors.fees_submitted = 'Fees submitted cannot be negative';
                
//             if (formData.fees_submitted && parseFloat(formData.fees_submitted) > parseFloat(formData.total_fees))
//                 newErrors.fees_submitted = 'Submitted fees cannot exceed total fees';
//         }
        
//         return newErrors;
//     };

//     const prepareApiData = () => {
//         const total_fees = parseFloat(formData.total_fees) || 0;
//         const fees_submitted = parseFloat(formData.fees_submitted) || 0;
//         const fees_pending = total_fees - fees_submitted;
        
//         const admission_type = formData.course_type === 'admission' ? 1 : 0;
//         const student_status = formData.course_type === 'admission' ? 3 : 0;
//         const admission_step = formData.course_type === 'admission' && fees_submitted > 0 ? 2 : 0;

//         const apiData = {
//             admission_type: admission_type,
//             name: formData.name,
//             address: formData.address,
//             contact_number: formData.contact_number,
//             parent_contact: formData.parent_contact,
//             date_of_birth: formData.date_of_birth,
//             qualification: formData.qualification,
//             course_name: formData.course_name,
//             batch_time: formData.batch_time,
//             start_date: formData.start_date,
//             end_date: formData.end_date,
//             teacher_name: formData.teacher_name,
//             referrer: formData.referrer,
//             additional_courses: formData.additional_courses.join(', '),
//             date_of_admission: formData.date_of_admission,
//             total_fees: total_fees,
//             fees_submitted: fees_submitted,
//             fees_pending: fees_pending,
//             payment_mode: formData.payment_mode,
//             payment_date: formData.payment_date,
//             email: formData.email,
//             gender: formData.gender ? parseInt(formData.gender) : 1,
//             student_status: student_status,
//             admission_step: admission_step
//         };

//         // Add enquiry fields if it's an enquiry
//         if (formData.course_type === 'enquiry') {
//             apiData.enquiry_type = formData.enquiry_type;
//             apiData.preferred_timing = formData.preferred_timing;
//         }

//         // Remove empty fields
//         Object.keys(apiData).forEach(key => {
//             if (apiData[key] === '' || apiData[key] === undefined || apiData[key] === null) {
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
//                              (formData.course_type === 'admission' ? 'Admission created successfully!' : 'Enquiry submitted successfully!'),
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
//                     course_type: 'admission',
//                     course_name: '',
//                     batch_time: '',
//                     start_date: '',
//                     end_date: '',
//                     teacher_name: '',
//                     referrer: '',
//                     additional_courses: [],
//                     date_of_admission: new Date().toISOString().split('T')[0],
//                     total_fees: '',
//                     fees_submitted: '',
//                     fees_pending: '',
//                     payment_mode: '',
//                     payment_date: new Date().toISOString().split('T')[0],
//                     admission_type: 1,
//                     student_status: 3,
//                     admission_step: 0,
//                     enquiry_type: '',
//                     preferred_timing: ''
//                 });
//                 setErrors({});
//                 setShowAdditionalCourse(false);
//                 setNewAdditionalCourse('');
//                 setShowEnquiryFields(false);
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
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             {/* Snackbar for notifications */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>

//             {/* Main Form Card */}
//             <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #0066ff92' }}>
//                 <CardContent sx={{ p: 4 }}>
//                     {/* Form Header */}
//                     <Box sx={{ textAlign: 'center', mb: 4 }}>
//                         <Typography variant="h4" sx={{ 
//                             fontWeight: 'bold', 
//                             color: formData.course_type === 'admission' ? '#1976d2' : '#f9992b',
//                             mb: 1
//                         }}>
//                             {formData.course_type === 'admission' ? 'Student Admission Form' : 'Student Enquiry Form'}
//                         </Typography>
//                         <Typography variant="body1" color="text.secondary">
//                             Please fill all the required fields carefully
//                         </Typography>
//                     </Box>

//                     <form onSubmit={handleSubmit}>
//                         {/* Personal Details Section */}
//                         <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
//                             <CardContent>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                                     <PersonIcon sx={{ mr: 1, color: '#1280ee' }} />
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>
//                                         Personal Information
//                                     </Typography>
//                                 </Box>
                                
//                                 <Grid container spacing={2.5}>
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="Student Name"
//                                             name="name"
//                                             value={formData.name}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             error={!!errors.name}
//                                             helperText={errors.name}
//                                             disabled={submitting}
//                                             placeholder="Enter full name"
//                                             sx={whiteBorderSx}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             fullWidth
//                                             label="Email Address"
//                                             name="email"
//                                             type="email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             placeholder="student@example.com"
//                                             error={!!errors.email}
//                                             helperText={errors.email}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <EmailIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={4}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="Date of Birth"
//                                             name="date_of_birth"
//                                             type="date"
//                                             value={formData.date_of_birth}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             InputLabelProps={{ shrink: true }}
//                                             error={!!errors.date_of_birth}
//                                             helperText={errors.date_of_birth}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <CalendarIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={4}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="Admission Date"
//                                             name="date_of_admission"
//                                             type="date"
//                                             value={formData.date_of_admission}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             InputLabelProps={{ shrink: true }}
//                                             error={!!errors.date_of_admission}
//                                             helperText={errors.date_of_admission}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={4}>
//                                         <FormControl fullWidth size="small" error={!!errors.gender} sx={whiteBorderSx}>
//                                             <InputLabel>Gender</InputLabel>
//                                             <Select
//                                                 name="gender"
//                                                 value={formData.gender}
//                                                 onChange={handleChange}
//                                                 label="Gender"
//                                                 disabled={submitting}
//                                             >
//                                                 <MenuItem value="">Select</MenuItem>
//                                                 <MenuItem value="1">Male</MenuItem>
//                                                 <MenuItem value="2">Female</MenuItem>
//                                                 <MenuItem value="3">Other</MenuItem>
//                                             </Select>
//                                             {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="Contact Number"
//                                             name="contact_number"
//                                             value={formData.contact_number}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             placeholder="9876543210"
//                                             error={!!errors.contact_number}
//                                             helperText={errors.contact_number}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <PhoneIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="Parent/Guardian Number"
//                                             name="parent_contact"
//                                             value={formData.parent_contact}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             placeholder="9876543210"
//                                             error={!!errors.parent_contact}
//                                             helperText={errors.parent_contact}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <PhoneIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             fullWidth
//                                             label="Complete Address"
//                                             name="address"
//                                             multiline
//                                             rows={2}
//                                             value={formData.address}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             placeholder="House no, Street, City, State, Pincode"
//                                             error={!!errors.address}
//                                             helperText={errors.address}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <LocationIcon sx={{ mb: 3, mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             </CardContent>
//                         </Card>

//                         {/* Academic Details Section */}
//                         <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
//                             <CardContent>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                                     <SchoolIcon sx={{ mr: 1, color: '#1280ee' }} />
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>
//                                         Academic Details
//                                     </Typography>
//                                 </Box>
                                
//                                 <Grid container spacing={2.5}>
//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth size="small" required error={!!errors.qualification} sx={whiteBorderSx}>
//                                             <InputLabel>Highest Qualification</InputLabel>
//                                             <Select
//                                                 name="qualification"
//                                                 value={formData.qualification}
//                                                 onChange={handleChange}
//                                                 label="Highest Qualification"
//                                                 disabled={submitting}
//                                             >
//                                                 <MenuItem value="">Select</MenuItem>
//                                                 {qualifications.map((qual) => (
//                                                     <MenuItem key={qual} value={qual}>{qual}</MenuItem>
//                                                 ))}
//                                             </Select>
//                                             {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
//                                             <InputLabel>Select Main Course</InputLabel>
//                                             <Select
//                                                 name="course_name"
//                                                 value={formData.course_name}
//                                                 onChange={handleChange}
//                                                 label="Select Main Course"
//                                             >
//                                                 <MenuItem value="">Select Course</MenuItem>
//                                                 {courses.map((course) => (
//                                                     <MenuItem key={course.course_id || course.id} value={course.course_name}>
//                                                         {course.course_name} {course.fees ? `(₹${course.fees})` : ''}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                             {errors.course_name && <FormHelperText>{errors.course_name}</FormHelperText>}
//                                             {loading && <FormHelperText>Loading courses...</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>
//                                 </Grid>
//                             </CardContent>
//                         </Card>

//                         {/* Course Details Section */}
//                         <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
//                             <CardContent>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
//                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                         <BookIcon sx={{ mr: 1, color: '#1280ee' }} />
//                                         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>
//                                             Course Details
//                                         </Typography>
//                                     </Box>
                                    
//                                     {/* Course Type Toggle */}
//                                     <Paper elevation={0} sx={{ p: 1, borderRadius: 2, border: '1px solid #e0e0e0' }}>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Typography variant="body2" sx={{ 
//                                                 color: formData.course_type === 'enquiry' ? '#f9992b' : 'text.secondary',
//                                                 fontWeight: formData.course_type === 'enquiry' ? 'bold' : 'normal'
//                                             }}>
//                                                 Enquiry
//                                             </Typography>
//                                             <FormControlLabel
//                                                 control={
//                                                     <Switch
//                                                         checked={formData.course_type === 'admission'}
//                                                         onChange={handleCourseTypeChange}
//                                                         color="primary"
//                                                         size="medium"
//                                                         disabled={submitting}
//                                                     />
//                                                 }
//                                                 label=""
//                                             />
//                                             <Typography variant="body2" sx={{ 
//                                                 color: formData.course_type === 'admission' ? '#1976d2' : 'text.secondary',
//                                                 fontWeight: formData.course_type === 'admission' ? 'bold' : 'normal'
//                                             }}>
//                                                 Admission
//                                             </Typography>
//                                         </Box>
//                                     </Paper>
//                                 </Box>

//                                 {/* Info Alert for Enquiry */}
//                                 {formData.course_type === 'enquiry' && (
//                                     <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
//                                         <Typography variant="body2" >
//                                             You are submitting an enquiry. Please fill in the enquiry details below.
//                                         </Typography>
//                                     </Alert>
//                                 )}
                                
//                                 <Grid container spacing={2.5}>
//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth size="small" required error={!!errors.batch_time} sx={whiteBorderSx}>
//                                             <InputLabel>Course Select</InputLabel>
//                                             <Select
//                                                 name="batch_time"
//                                                 value={formData.batch_time  }
//                                                 onChange={handleChange}
//                                                 label="Batch Time"
//                                                 disabled={submitting}
//                                             >
//                                                 <MenuItem value="">Select Batch Time</MenuItem>
//                                                 {batchTimes.map((time) => (
//                                                     <MenuItem key={time} value={time}>{time}</MenuItem>
//                                                 ))}
//                                             </Select>
//                                             {errors.batch_time && <FormHelperText>{errors.batch_time}</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>

//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth size="small" required error={!!errors.batch_time} sx={whiteBorderSx}>
//                                             <InputLabel>Batch Time</InputLabel>
//                                             <Select
//                                                 name="batch_time"
//                                                 value={formData.batch_time}
//                                                 onChange={handleChange}
//                                                 label="Batch Time"
//                                                 disabled={submitting}
//                                             >
//                                                 <MenuItem value="">Select Batch Time</MenuItem>
//                                                 {batchTimes.map((time) => (
//                                                     <MenuItem key={time} value={time}>{time}</MenuItem>
//                                                 ))}
//                                             </Select>
//                                             {errors.batch_time && <FormHelperText>{errors.batch_time}</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="Start Date"
//                                             name="start_date"
//                                             type="date"
//                                             value={formData.start_date}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             InputLabelProps={{ shrink: true }}
//                                             error={!!errors.start_date}
//                                             helperText={errors.start_date}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <CalendarIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             label="End Date"
//                                             name="end_date"
//                                             type="date"
//                                             value={formData.end_date}
//                                             onChange={handleChange}
//                                             variant="outlined"
//                                             size="small"
//                                             InputLabelProps={{ shrink: true }}
//                                             error={!!errors.end_date}
//                                             helperText={errors.end_date}
//                                             disabled={submitting}
//                                             sx={whiteBorderSx}
//                                             InputProps={{
//                                                 startAdornment: <CalendarIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 20 }} />
//                                             }}
//                                         />
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth size="small" required error={!!errors.teacher_name} sx={whiteBorderSx}>
//                                             <InputLabel>Select Teacher</InputLabel>
//                                             <Select
//                                                 name="teacher_name"
//                                                 value={formData.teacher_name}
//                                                 onChange={handleChange}
//                                                 label="Select Teacher"
//                                                 disabled={submitting}
//                                             >
//                                                 <MenuItem value="">Select Teacher</MenuItem>
//                                                 {teachers.length > 0 ? (
//                                                     teachers.map((teacher) => (
//                                                         <MenuItem key={teacher.id || teacher.teacher_id} value={teacher.name}>
//                                                             {teacher.name}
//                                                         </MenuItem>
//                                                     ))
//                                                 ) 
//                                                 : (
//                                                     <MenuItem value="Not Assigned">Not Assigned</MenuItem>
//                                                 )}
//                                             </Select>
//                                             {errors.teacher_name && <FormHelperText>{errors.teacher_name}</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>
                                    
//                                     <Grid item xs={12} md={6}>
//                                         <FormControl fullWidth size="small" required error={!!errors.referrer} sx={whiteBorderSx}>
//                                             <InputLabel>How did you hear about us?</InputLabel>
//                                             <Select
//                                                 name="referrer"
//                                                 value={formData.referrer}
//                                                 onChange={handleChange}
//                                                 label="How did you hear about us?"
//                                                 disabled={submitting}
//                                             >
//                                                 <MenuItem value="">Select</MenuItem>
//                                                 {referrerOptions.map((option) => (
//                                                     <MenuItem key={option} value={option}>{option}</MenuItem>
//                                                 ))}
//                                             </Select>
//                                             {errors.referrer && <FormHelperText>{errors.referrer}</FormHelperText>}
//                                         </FormControl>
//                                     </Grid>

//                                     {/* Enquiry Specific Fields */}
//                                     {formData.course_type === 'enquiry' && (
//                                         <>
//                                             {/* <Grid item xs={12} md={6}>
//                                                 <FormControl fullWidth size="small" required error={!!errors.enquiry_type} sx={whiteBorderSx}>
//                                                     <InputLabel>Enquiry Type</InputLabel>
//                                                     <Select
//                                                         name="enquiry_type"
//                                                         value={formData.enquiry_type || ''}
//                                                         onChange={handleChange}
//                                                         label="Enquiry Type"
//                                                         disabled={submitting}
//                                                     >
//                                                         <MenuItem value="">Select Enquiry Type</MenuItem>
//                                                         {enquiryTypes.map((type) => (
//                                                             <MenuItem key={type} value={type}>{type}</MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                     {errors.enquiry_type && <FormHelperText>{errors.enquiry_type}</FormHelperText>}
//                                                 </FormControl>
//                                             </Grid> */}
                                            
//                                             {/* <Grid item xs={12} md={6}>
//                                                 <FormControl fullWidth size="small" sx={whiteBorderSx}>
//                                                     <InputLabel>Preferred Timing</InputLabel>
//                                                     <Select
//                                                         name="preferred_timing"
//                                                         value={formData.preferred_timing || ''}
//                                                         onChange={handleChange}
//                                                         label="Preferred Timing"
//                                                         disabled={submitting}
//                                                     >
//                                                         <MenuItem value="">Select Preferred Timing</MenuItem>
//                                                         {batchTimes.map((time) => (
//                                                             <MenuItem key={time} value={time}>{time}</MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid> */}
//                                         </>
//                                     )}
//                                 </Grid>

//                                 {/* Additional Courses Section */}
//                                 <Box sx={{ mt: 3 }}>
//                                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                             <AddIcon sx={{ mr: 1, color: '#1976d2' }} />
//                                             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d7d0d0' }}>
//                                                 Additional Courses (Optional)
//                                             </Typography>
//                                         </Box>
//                                         {!showAdditionalCourse && (
//                                             <Button
//                                                 variant="outlined"
//                                                 size="small"
//                                                 startIcon={<AddIcon />}
//                                                 onClick={() => setShowAdditionalCourse(true)}
//                                                 sx={{ borderRadius: 2 }}
//                                                 disabled={submitting}
//                                             >
//                                                 Add Course
//                                             </Button>
//                                         )}
//                                     </Box>

//                                     {showAdditionalCourse && (
//                                         <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
//                                             <FormControl sx={{ minWidth: 250, flex: 1 }} size="small">
//                                                 <InputLabel>Select Additional Course</InputLabel>
//                                                 <Select
//                                                     value={newAdditionalCourse}
//                                                     onChange={(e) => setNewAdditionalCourse(e.target.value)}
//                                                     label="Select Additional Course"
//                                                     sx={whiteBorderSx}
//                                                 >
//                                                     <MenuItem value="">Select Course</MenuItem>
//                                                     {courses
//                                                         .filter(course => !formData.additional_courses.includes(course.course_name))
//                                                         .map((course) => (
//                                                             <MenuItem key={course.course_id || course.id} value={course.course_name}>
//                                                                 {course.course_name}
//                                                             </MenuItem>
//                                                         ))
//                                                     }
//                                                 </Select>
//                                             </FormControl>
//                                             <Button
//                                                 variant="contained"
//                                                 onClick={handleAddAdditionalCourse}
//                                                 disabled={!newAdditionalCourse}
//                                                 sx={{ minWidth: '100px' }}
//                                             >
//                                                 Add
//                                             </Button>
//                                             <Button
//                                                 variant="outlined"
//                                                 onClick={() => {
//                                                     setShowAdditionalCourse(false);
//                                                     setNewAdditionalCourse('');
//                                                 }}
//                                                 sx={{ minWidth: '80px' }}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                         </Box>
//                                     )}

//                                     {/* Display Additional Courses */}
//                                     {formData.additional_courses.length > 0 && (
//                                         <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
//                                             {formData.additional_courses.map((course, index) => (
//                                                 <Chip
//                                                     key={index}
//                                                     label={course}
//                                                     onDelete={() => handleRemoveAdditionalCourse(course)}
//                                                     deleteIcon={<CloseIcon />}
//                                                     color="primary"
//                                                     variant="outlined"
//                                                     sx={{ 
//                                                         borderRadius: 2,
//                                                         '& .MuiChip-deleteIcon': {
//                                                             color: '#1976d2'
//                                                         }
//                                                     }}
//                                                 />
//                                             ))}
//                                         </Stack>
//                                     )}
//                                 </Box>
//                             </CardContent>
//                         </Card>

//                         {/* Fees Details Section - Only for Admission */}
//                         {formData.course_type === 'admission' && (
//                             <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
//                                 <CardContent>
//                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                                         <PaymentIcon sx={{ mr: 1, color: '#1976d2' }} />
//                                         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0', fontSize: '15px' }}>
//                                             Fees Structure
//                                         </Typography>
//                                     </Box>
                                    
//                                     <Grid container spacing={2.5}>
//                                         <Grid item xs={12} md={4}>
//                                             <TextField
//                                                 required
//                                                 fullWidth
//                                                 label="Total Course Fees"
//                                                 name="total_fees"
//                                                 type="number"
//                                                 value={formData.total_fees}
//                                                 onChange={handleChange}
//                                                 variant="outlined"
//                                                 size="small"
//                                                 error={!!errors.total_fees}
//                                                 helperText={errors.total_fees}
//                                                 disabled={submitting}
//                                                 sx={whiteBorderSx}
//                                                 InputProps={{
//                                                     startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>
//                                                 }}
//                                             />
//                                         </Grid>
                                        
//                                         <Grid item xs={12} md={4}>
//                                             <TextField
//                                                 fullWidth
//                                                 label="Fees Submitted"
//                                                 name="fees_submitted"
//                                                 type="number"
//                                                 value={formData.fees_submitted}
//                                                 onChange={handleChange}
//                                                 variant="outlined"
//                                                 size="small"
//                                                 error={!!errors.fees_submitted}
//                                                 helperText={errors.fees_submitted}
//                                                 disabled={submitting}
//                                                 sx={whiteBorderSx}
//                                                 InputProps={{
//                                                     startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>
//                                                 }}
//                                             />
//                                         </Grid>
                                        
//                                         <Grid item xs={12} md={4}>
//                                             <TextField
//                                                 fullWidth
//                                                 label="Fees Pending"
//                                                 name="fees_pending"
//                                                 value={formData.fees_pending}
//                                                 variant="outlined"
//                                                 size="small"
//                                                 sx={whiteBorderSx}
//                                                 InputProps={{
//                                                     readOnly: true,
//                                                     startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>,
//                                                     style: { 
//                                                         fontWeight: 'bold',
//                                                         color: parseFloat(formData.fees_pending || 0) > 0 ? '#d32f2f' : '#2e7d32'
//                                                     }
//                                                 }}
//                                                 disabled={submitting}
//                                             />
//                                         </Grid>
                                        
//                                         <Grid item xs={12} md={6}>
//                                             <FormControl fullWidth size="small" sx={whiteBorderSx}>
//                                                 <InputLabel>Payment Mode</InputLabel>
//                                                 <Select
//                                                     name="payment_mode"
//                                                     value={formData.payment_mode}
//                                                     onChange={handleChange}
//                                                     label="Payment Mode"
//                                                     disabled={submitting}
//                                                 >
//                                                     <MenuItem value="">Select</MenuItem>
//                                                     {paymentModes.map((mode) => (
//                                                         <MenuItem key={mode} value={mode}>{mode}</MenuItem>
//                                                     ))}
//                                                 </Select>
//                                             </FormControl>
//                                         </Grid>
                                        
//                                         <Grid item xs={12} md={6}>
//                                             <TextField
//                                                 fullWidth
//                                                 label="Payment Date"
//                                                 name="payment_date"
//                                                 type="date"
//                                                 value={formData.payment_date}
//                                                 onChange={handleChange}
//                                                 variant="outlined"
//                                                 size="small"
//                                                 InputLabelProps={{ shrink: true }}
//                                                 disabled={submitting}
//                                                 sx={whiteBorderSx}
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </Card>
//                         )}

//                         {/* Submit Button */}
//                         <Box sx={{ 
//                             display: 'flex', 
//                             justifyContent: 'center', 
//                             mt: 4
//                         }}>
//                             <Button
//                                 variant="contained"
//                                 color={formData.course_type === 'admission' ? 'primary' : 'warning'}
//                                 size="large"
//                                 type="submit"
//                                 disabled={submitting}
//                                 sx={{
//                                     px: 6,
//                                     py: 1.5,
//                                     borderRadius: 2,
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem'
//                                 }}
//                             >
//                                 {submitting ? <CircularProgress size={24} color="inherit" /> : 
//                                     (formData.course_type === 'admission' ? 'Submit Admission' : 'Submit Enquiry')
//                                 }
//                             </Button>
//                         </Box>
//                     </form>
//                 </CardContent>
//             </Card>
//         </Container>
//     );
// };

// export default AdmissionForm;


















































 

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



import { IconSchool  ,IconMessageCircleQuestion} from '@tabler/icons-react';

// White border style for all input fields
const whiteBorderSx = {
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#71707097',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
         borderColor: '#2d8bfdec',
    },
};

 const referrerOptions = [
        'Friends',
        'Family', 
        'Facebook',
        'Instagram',
        'Ad',
        'Advertisement',
        'Google',
        'YouTube',
        'Other'
    ];

     import {
     Add as AddIcon,
 } from '@mui/icons-material';
// Form Type Toggle Component
const FormTypeToggle = ({ isAdmissionForm, handleFormTypeChange, submitting }) => (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center'  }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, width: '100%', maxWidth: 500 ,border: isAdmissionForm ? '1px solid #0066ff92' : '1px solid #ff8c007f'}}>
            <Box sx={{ textAlign: 'center', mb: 2  }}>
                <Typography style={{fontSize : '20px' }} variant="h5" gutterBottom sx={{ 
                    color: isAdmissionForm ? '#1280ee' : '#f9992b',
                    fontWeight: 'bold'
                }}>
                   {isAdmissionForm ? <IconSchool size={24} color='#1280ee' /> : <IconMessageCircleQuestion size={24} />}
                     {isAdmissionForm ? ' Admission Portal' : ' Enquiry Portal'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {isAdmissionForm 
                        ? 'Complete the form below to enroll as a student' 
                        : 'Fill the enquiry form to get more information'}
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ color: !isAdmissionForm ? '#f9992b' : 'text.secondary', fontWeight: !isAdmissionForm ? 'bold' : 'normal' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 ,}}>
                <PersonIcon sx={{ mr: 1, color: isAdmissionForm ? '#1280ee' : '#f9992b',}} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0' , fontSize : '15px'}}>
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
                        sx={whiteBorderSx}
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
                        sx={whiteBorderSx}
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
                            startAdornment: <CalendarIcon sx={{ mr: 1, color: '#7f8c8d', fontSize: 17 }} />
                        }}
                        sx={{...whiteBorderSx,
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                         },
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
                            sx={{...whiteBorderSx,
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                         },
                                }}
                        />
                    </Grid>
                )}
                
                <Grid item xs={12} md={isAdmissionForm ? 4 : 6}>
                    <FormControl fullWidth size="small" required error={!!errors.gender} sx={whiteBorderSx}>
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
                        sx={whiteBorderSx}
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
                        sx={whiteBorderSx}
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
                        sx={whiteBorderSx}
                        InputProps={{
                           startAdornment: <LocationIcon sx={{ mb : 3, mr: 1, color: '#7f8c8d', fontSize: 20 }} />
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
    <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ mr: 1, color: isAdmissionForm ? '#1280ee' : '#f9992b',}} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0' , fontSize : '15px'}}>
                    {isAdmissionForm ? 'Academic Details' : 'Course Details'}
                </Typography>
            </Box>
            
            <Grid container spacing={2.5}>
                {isAdmissionForm ? (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.qualification} sx={whiteBorderSx}>
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
                        <FormControl fullWidth size="small" required error={!!errors.enquiry_type} sx={whiteBorderSx}>
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
                    <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
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
                        <FormControl fullWidth size="small" sx={whiteBorderSx}>
                            <InputLabel>Enquiry Timing</InputLabel>
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
                {!isAdmissionForm && (
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small"  error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
                        <InputLabel>Learning Mode</InputLabel>
                        <Select
                            name="Learning Type"
                            value={formData.course_name}
                            onChange={handleChange}
                            label="Learning Mode"
                        >
                            <MenuItem value="">Select Mode</MenuItem>
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
                )}

                {!isAdmissionForm && (
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small"  error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
                        <InputLabel>Session</InputLabel>
                        <Select
                            name="Session year"
                            value={formData.course_name}
                            onChange={handleChange}
                            label="Session"
                        >
                            <MenuItem value="">Select year</MenuItem>
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
                )}
                {!isAdmissionForm && (
                 <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" required error={!!errors.referrer} sx={whiteBorderSx}>
                        <InputLabel>How did you hear about us?</InputLabel>
                        <Select
                            name="referrer"
                            value={formData.referrer}
                            onChange={handleChange}
                            label="How did you hear about us?"
                            disabled={submitting}
                        >
                               <MenuItem value="">Select</MenuItem>
                               {/* {referrerOptions.map((option) => (
                                   <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))} */}
                        </Select>
                        {errors.referrer && <FormHelperText>{errors.referrer}</FormHelperText>}
                    </FormControl>
                </Grid>
                )}
            </Grid>
        </CardContent>
    </Card>
);


const CourseDetailsSection = ({ 
    formData, 
    errors, 
    handleChange, 
    isAdmissionForm, 
    submitting, 
    courses, 
    loading,
    programmingCourses ,
}) => (
    (isAdmissionForm ) && (
    <Card variant="outlined" sx={{ mb: 5, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ mr: 1, color: isAdmissionForm ? '#1280ee' : '#f9992b',}} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0' , fontSize : '15px'}}>
                    Course Details
                </Typography>
            </Box>
            <Grid container spacing={2.5}>
                
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required error={!!errors.qualification} sx={whiteBorderSx}>
                            <InputLabel>Course Select</InputLabel>
                            <Select
                                name="CourseSelect"
                                value={formData.qualification}
                                onChange={handleChange}
                                label="Course Details"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {programmingCourses .map((qual) => (
                                    <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                                ))}
                            </Select>
                            {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                        </FormControl>
                    </Grid>
        
                
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
                        <InputLabel> Batch Time</InputLabel>
                        <Select
                            name="Batch Time"
                            value={formData.course_name}
                            onChange={handleChange}
                            label="Batch Time"
                        >
                            <MenuItem value="">Select Timing</MenuItem>
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


                 <Grid item xs={12} md={6} mt={2}>
                        <TextField
                            required
                            fullWidth
                            label="Batch start Date"
                            name="Batch Time"
                            type="date"
                            value={formData.date_of_admission}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.date_of_admission}
                            helperText={errors.date_of_admission}
                            disabled={submitting}
                            sx={{...whiteBorderSx,
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                         },
                                }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} mt={2}>
                        <TextField
                            required
                            fullWidth
                            label="Batch End Date"
                            name="Batch Time"
                            type="date"
                            value={formData.date_of_admission}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.date_of_admission}
                            helperText={errors.date_of_admission}
                            disabled={submitting}
                            sx={{...whiteBorderSx,
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                         },
                                }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} mt={2}>
                        <FormControl fullWidth size="small" required error={!!errors.teacher_name} sx={whiteBorderSx}>
                            <InputLabel>Select Teacher</InputLabel>
                            <Select
                                name="teacher_name"
                                value={formData.teacher_name}
                                onChange={handleChange}
                                label="Select Teacher"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select Teacher</MenuItem>
                                <MenuItem value="">Select Teacher</MenuItem>
                                <MenuItem value="">Select Teacher</MenuItem>
                                {/* {teachers.length > 0 ? (
                                    teachers.map((teacher) => (
                                     <MenuItem key={teacher.id || teacher.teacher_id} value={teacher.name}>
                                       {teacher.name}
                               </MenuItem>
                                     ))) 
                                      : (
                               <MenuItem value="Not Assigned">Not Assigned</MenuItem>
                              )} */}
                            </Select>
                            {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                        </FormControl>
                    </Grid>
                     
                     <Grid item xs={12} md={6} mt={2}>
                    <FormControl fullWidth size="small" required error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
                        <InputLabel>Class Mode</InputLabel>
                        <Select
                            name="Class Type"
                            value={formData.course_name}
                            onChange={handleChange}
                            label="Class Mode"
                        >
                            <MenuItem value="">Select Mode</MenuItem>
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

                    <Grid item xs={12} md={6} mt={2}>
                        <FormControl fullWidth size="small" required error={!!errors.qualification} sx={whiteBorderSx}>
                            <InputLabel>Course Duration</InputLabel>
                            <Select
                                name="Duration"
                                value={formData.qualification}
                                onChange={handleChange}
                                label="Course Duration"
                                disabled={submitting}
                            >
                                <MenuItem value="">Select Months</MenuItem>
                                {/* {programmingCourses .map((qual) => (
                                    <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                                ))} */}
                            </Select>
                            {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                        </FormControl>
                    </Grid>
                      <Grid item xs={12} md={6} mt={2}>
                    <FormControl fullWidth size="small" required  error={!!errors.course_name} disabled={submitting || loading} sx={whiteBorderSx}>
                        <InputLabel>Session</InputLabel>
                        <Select
                            name="Session year"
                            value={formData.course_name}
                            onChange={handleChange}
                            label="Session"
                        >
                            <MenuItem value="">Select year</MenuItem>
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


                    
                   <Grid item xs={12} md={12} mt={2}>
                    <FormControl fullWidth size="small" required error={!!errors.referrer} sx={whiteBorderSx}>
                        <InputLabel>How did you hear about us?</InputLabel>
                        <Select
                            name="referrer"
                            value={formData.referrer}
                            onChange={handleChange}
                            label="How did you hear about us?"
                            disabled={submitting}
                        >
                               <MenuItem value="">Select</MenuItem>
                               {/* {referrerOptions.map((option) => (
                                   <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))} */}
                        </Select>
                        {errors.referrer && <FormHelperText>{errors.referrer}</FormHelperText>}
                    </FormControl>
                </Grid>
                    
                 <Box sx={{ mt: 2  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 , marginTop : "20px"  }}>
                       <Box sx={{ display: 'flex', alignItems: 'center' , marginLeft : "28px" }}>
                            <AddIcon sx={{ mr: 1, color: '#1976d2' }} />
                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d7d0d0'  }}>
                                         Additional Courses (Optional)
                                </Typography>
                             </Box>
                        </Box>
                            {/* {showAdditionalCourse && ( */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap'  , marginLeft : "22px"  }}>
                                 <FormControl sx={{ minWidth: 820, flex: 1 }} size="small">
                                     <InputLabel>Select Additional Course</InputLabel>
                                         <Select  label="Select Additional Course" sx={whiteBorderSx}>
                                             <MenuItem value="">Select Course</MenuItem>
                                             <MenuItem value="">Select Course</MenuItem>
                                             <MenuItem value="">Select Course</MenuItem>
                                             <MenuItem value="">Select Course</MenuItem>
                                             <MenuItem value="">Select Course</MenuItem>
                                         </Select>
                                             </FormControl>
                                                <Button
                                                 variant="contained"
                                                 sx={{ minWidth: '100px' }}
                                                 >
                                                 Add
                                                </Button>
                                                 <Button
                                                 variant="outlined"
                                                 sx={{ minWidth: '80px' }}
                                                >
                                                 Cancel
                                             </Button>
                            </Box>
                        </Box>                  
            </Grid>
            
        </CardContent>
    </Card>
    )
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
                    <PaymentIcon sx={{ mr: 1, color: isAdmissionForm ?'#1976d2' : '#f9992b' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d7d0d0' , fontSize : '15px'}}>
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
                                    sx={whiteBorderSx}
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
                                    sx={whiteBorderSx}
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
                                    sx={whiteBorderSx}
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
                                    sx={whiteBorderSx}
                                    InputProps={{
                                        readOnly: showRegistrationFee,
                                        startAdornment: <Typography sx={{ mr: 1, color: '#7f8c8d' }}>₹</Typography>,
                                        style: { 
                                            fontWeight: 'bold',
                                            color: '#f9992b'
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
                                    sx={whiteBorderSx}
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
                        <FormControl fullWidth size="small" sx={whiteBorderSx}>
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
                             sx={{...whiteBorderSx,
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                         },
                                }}
                        />
                    </Grid>

                       {!isAdmissionForm ||(
                      <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Next Instalment Date"
                            name="payment_date"
                            type="date"
                            value={formData.payment_date}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            disabled={submitting}
                             sx={{...whiteBorderSx,
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                         },
                                }}
                        />
                    </Grid>
                       )}

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
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#141414' , fontSize : '15px' }}>
                    Summary
                </Typography>
            </Box>
            
            <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                        <strong style={{ color: '#070707dc' }}>Student:</strong> {formData.name || 'Not provided'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                        <strong style={{ color: '#070707dc' }}>Contact:</strong> {formData.contact_number || 'Not provided'}
                    </Typography>
                </Grid>
                
                {isAdmissionForm ? (
                    <>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#070707dc' }}>Admission Date:</strong> {formData.date_of_admission || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#070707dc' }}>Course:</strong> {formData.course_name || 'Not selected'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                <strong style={{ color: '#070707dc' }}>Qualification:</strong> {formData.qualification || 'Not selected'}
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
                                        color: parseFloat(formData.fees_pending || 0) > 0 ? '#d32f2f' : '#f59037', 
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

    const programmingCourses = [
    "C Programming",
    "C++ Programming",
    "Java Programming",
    "Python Programming",
    "JavaScript",
    "TypeScript",
    "React.js",
    "Node.js",
    "Express.js",
    "Angular",
    "Vue.js",
    "Next.js",
    "PHP",
    "Laravel",
    "C# Programming",
    ".NET Development",
    "Go Programming",
    "Rust Programming",
    "Kotlin Programming",
    "Swift Programming",
    "Dart Programming",
    "Flutter Development",
    "Android Development",
    "Web Development",
    "Full Stack Development",
    "MERN Stack Development",
    "MEAN Stack Development",
    "Backend Development",
    "Frontend Development",
    "API Development",
    "REST API Development",
    "Database & SQL",
    "MySQL",
    "MongoDB",
    "Data Structures & Algorithms",
    "Git & GitHub",
    "DevOps",
    "Docker",
    "Cloud Computing",
    "Machine Learning",
    "Artificial Intelligence"
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
                        backgroundColor: '#83818163',
                        // border: '1px solid #b6d4fe',
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
            <Card elevation={0} sx={{ borderRadius: 2, border: isAdmissionForm ? '1px solid #0066ff92' : '1px solid #ff8c007f' }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Form Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            color: isAdmissionForm ? '#1976d2' : '#f9992b',
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

                         <CourseDetailsSection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            isAdmissionForm={isAdmissionForm}
                            submitting={submitting}
                            courses={courses}
                            loading={loading}
                            programmingCourses ={programmingCourses}
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
                                        borderColor: '#f9992b',
                                        color: '#f9992b',
                                        '&:hover': {
                                            borderColor: '#9b750c',
                                            backgroundColor: 'rgba(156, 39, 176, 0.04)'
                                        }
                                    }}
                                >
                                    Pay Registration Fee ₹100
                                </Button>
                            )}
                            
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                disabled={submitting}
                                sx={{
                                    px: 6,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                            >
                                {submitting ? <CircularProgress size={24} color="inherit" /> : 
                                    (isAdmissionForm ? 'Submit Admission' : 'Submit Enquiry')
                                
                                }
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdmissionForm;


