import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// import axios from 'axios'; // Uncomment when using API

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import Authentication from 'views/pages/auth/authentication';

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Authentication />
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .trim()
            .email('Please enter a valid email')
            .matches(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i, {
              message: 'Please enter a valid email address',
              excludeEmptyString: true
            })
            .max(255)
            .required('Please enter email'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').max(15).required('Please enter password')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            // --- MOCK LOGIN (Temporary) ---
            const mockUser = {
              user_id: 1,
              username: 'Demo Admin',
              email: values.email || 'demo@admin.com',
              mobile: '9876543210',
              address: 'Demo Address',
              user_type: '0'
            };

            sessionStorage.setItem('token', 'demo-token-' + Date.now());
            sessionStorage.setItem('id', mockUser.user_id);
            sessionStorage.setItem('name', mockUser.username);
            sessionStorage.setItem('email', mockUser.email);
            sessionStorage.setItem('mobile', mockUser.mobile);
            sessionStorage.setItem('address', mockUser.address);
            sessionStorage.setItem('user_type', mockUser.user_type);

            const sessionDuration = 30 * 60 * 1000;
            const expirationTime = new Date().getTime() + sessionDuration;
            sessionStorage.setItem('expirationTime', expirationTime);

            if (checked) {
              sessionStorage.setItem('rememberedEmail', values.email);
              sessionStorage.setItem('rememberedPassword', values.password);
            } else {
              sessionStorage.removeItem('rememberedEmail');
              sessionStorage.removeItem('rememberedPassword');
            }
            
            navigate(APP_PREFIX_PATH + '/dashboard');
            
            // --- ORIGINAL API CODE (Uncomment when ready) ---
            /*
            const trimmedEmail = values.email.trim();
            const trimmedPassword = values.password.trim();
            const response = await axios.post(`${API_URL}admin_login`, {
              headers: { 'Content-Type': 'application/json', Authorization: '' },
              email: trimmedEmail,
              password: trimmedPassword
            });

            if (response.data.success) {
              const user = response.data.info[0];
              sessionStorage.setItem('token', response.data.token);
              sessionStorage.setItem('id', user.user_id);
              sessionStorage.setItem('name', user.username);
              sessionStorage.setItem('email', user.email);
              sessionStorage.setItem('mobile', user.mobile);
              sessionStorage.setItem('address', user.address);
              sessionStorage.setItem('user_type', user.user_type);

              const sessionDuration = 30 * 60 * 1000;
              const expirationTime = new Date().getTime() + sessionDuration;
              sessionStorage.setItem('expirationTime', expirationTime);

              if (checked) {
                sessionStorage.setItem('rememberedEmail', trimmedEmail);
                sessionStorage.setItem('rememberedPassword', trimmedPassword);
              } else {
                sessionStorage.removeItem('rememberedEmail');
                sessionStorage.removeItem('rememberedPassword');
              }
              navigate(APP_PREFIX_PATH + '/dashboard');
            } else {
              if (response.data.key === 'email') {
                setErrors({ email: 'Email address is not correct', password: '' });
              } else if (response.data.key === 'password') {
                setErrors({ password: 'Password is not correct', email: '' });
              } else {
                setErrors({ submit: 'Email address and password are invalid' });
              }
            }
            */
          } catch (error) {
            console.error('Login error:', error);
            sessionStorage.setItem('token', 'demo-token-error-' + Date.now());
            sessionStorage.setItem('user_type', '0');
            navigate(APP_PREFIX_PATH + '/dashboard');
          }
          setSubmitting(false);
        }}
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
                 Login Desk
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1, 
                    color: theme.palette.text.secondary 
                  }}
                >
                  Enter your credentials to access admin panel
                </Typography>
              </Grid>
            </Grid>

            {/* --- EMAIL FIELD --- */}
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput, mb: 3 }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
                inputProps={{ maxLength: 30 }}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            {/* --- PASSWORD FIELD --- */}
            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput, mb: 1 }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                      sx={{ color: theme.palette.grey[500] }} // Dynamic icon color
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {/* --- REMEMBER ME & FORGOT PASSWORD --- */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mt: 1, mb: 3 }}>
             <FormControlLabel
                control={
                  <Checkbox 
                    checked={checked} 
                    onChange={(event) => setChecked(event.target.checked)} 
                    name="checked" 
                    color="primary" 
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} // Slightly smaller checkbox
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />

              <Link 
                to={`${APP_PREFIX_PATH}/forgotpassword`} 
                style={{ 
                  textDecoration: 'none', 
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}
              >
                Forgot Password?
              </Link>
            </Stack>

            {errors.submit && (
              <Box sx={{ mt: 3, mb: 2 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            {/* --- LOGIN BUTTON --- */}
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
                    py: 1.5,    // Better height padding
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '8px' // Slightly rounded corners for modern look
                  }}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;