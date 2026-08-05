import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icons for Modals
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';

import './login.css'; // Keeping your custom css if needed for other things

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // 1. Check if email exists
      const checkResponse = await axios.post(`${API_URL}Check_admin_email`, { email: values.email });

      if (checkResponse.data.success) {
        // 2. Email exists, send reset link
        const resetResponse = await axios.post(`${API_URL}Admin_forget_password`, { email: values.email });
        setShowModal(true); // Show Success Modal
        setError('');
      } else {
        // Email doesn't exist
        setError('This email is not registered with us, please try again.');
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('Error checking or sending reset link:', err);
      setError('Something went wrong, please try again later.');
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            
            {/* --- PROFESSIONAL HEADER --- */}
            <Grid container spacing={1} sx={{ mb: 4 }}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.text.primary,
                    letterSpacing: -0.5 
                  }}
                >
                  Forgot Password?
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1, 
                    color: theme.palette.text.secondary 
                  }}
                >
                  Enter your email address below and we'll send you a link to reset your password.
                </Typography>
              </Grid>
            </Grid>

            {/* --- EMAIL FIELD --- */}
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput, mb: 3 }}>
              <InputLabel htmlFor="outlined-adornment-email-forgot">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-forgot"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setError(''); // Clear custom API errors when user types
                }}
                label="Email Address"
                inputProps={{ maxLength: 30 }}
              />
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </FormControl>

            {/* --- SUBMIT BUTTON --- */}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ 
                    py: 1.5, 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    borderRadius: '8px' 
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </AnimateButton>
            </Box>

            {/* --- BACK TO LOGIN LINK --- */}
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                component={Link} 
                to={`${APP_PREFIX_PATH}/`}
                sx={{ 
                  textDecoration: 'none', 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                 '&?hover': { textDecoration: 'underline' }
                }}
              >
                Back to Sign In
              </Typography>
            </Grid>

          </form>
        )}
      </Formik>

      {/* --- SUCCESS MODAL (MUI Dialog) --- */}
      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        PaperProps={{ sx: { borderRadius: '12px', p: 2, minWidth: '300px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem' }}>Success</DialogTitle>
       <DialogContent sx={{ textAlign: 'center' }}>
           <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="body1">
               Password reset link has been sent to your email successfully.
              </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setShowModal(false);
              navigate(`${APP_PREFIX_PATH}/`); // Navigate back to login
            }}
            sx={{ py: 1, px: 4, borderRadius: '8px' }}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- ERROR MODAL (MUI Dialog) --- */}
      <Dialog 
        open={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        PaperProps={{ sx: { borderRadius: '12px', p: 2, minWidth: '300px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', color: 'error.main' }}>Error</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="body1">
            {error}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => setShowErrorModal(false)}
            sx={{ py: 1, px: 4, borderRadius: '8px' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthForgotPassword;