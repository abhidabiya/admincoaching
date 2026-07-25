import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';
import { MENU_OPEN } from 'store/actions';
import { APP_LOGO } from 'config/constant';
import logo_image from '../../../assets/images/logo.png'

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      <img src={logo_image} alt="App Logo Abhi 1"  style={{ width: '65px', height: '65px', borderRadius: "15px", marginTop: "20px" , marginBottom: "10px" }}  /> 
    </ButtonBase>
  );
};

export default LogoSection;
