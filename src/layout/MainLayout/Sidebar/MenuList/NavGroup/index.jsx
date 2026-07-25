// // import PropTypes from 'prop-types';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import Divider from '@mui/material/Divider';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';

// // project imports
// import NavItem from '../NavItem';
// import NavCollapse from '../NavCollapse';

// // ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

// const NavGroup = ({ item }) => {
//   const theme = useTheme();

//   // menu list collapse & items
//   const items = item.children?.map((menu) => {
//     switch (menu.type) {
//       case 'collapse':
//         return <NavCollapse key={menu.id} menu={menu} level={1} />;
//       case 'item':
//         return <NavItem key={menu.id} item={menu} level={1} />;
//       default:
//         return (
//           <Typography key={menu.id} variant="h6" color="error" align="center">
//             Menu Items Error
//           </Typography>
//         );
//     }
//   });

//   return (
//     <>
//       <List
//         subheader={
//           item.title && (
//             <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
//               {item.title}
//               {item.caption && (
//                 <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
//                   {item.caption}
//                 </Typography>
//               )}
//             </Typography>
//           )
//         }
//       >
//         {items}
//       </List>

//       {/* group divider */}
//       <Divider sx={{ mt: 0.25, mb: 1.25 }} />
//     </>
//   );
// };

// // NavGroup.propTypes = {
// //   item: PropTypes.object
// // };

// export default NavGroup;
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import Authentication from 'views/pages/auth/authentication';

const NavGroup = ({ item }) => {
  const theme = useTheme();
  
  // State to track active menu
  const [activeMenu, setActiveMenu] = useState(null);

  // Handle click on menu items
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  // menu list collapse & items
  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={menu.id}
            menu={menu}
            level={1}
            isActive={activeMenu === menu.id}
            onMenuClick={() => handleMenuClick(menu.id)}
          />
        );
      case 'item':
        return (
          <NavItem
            key={menu.id}
            item={menu}
            level={1}
            isActive={activeMenu === menu.id}
            onMenuClick={() => handleMenuClick(menu.id)}
          />
        );
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (

    <>
      <Authentication />
      <List
        subheader={
          item.title && (
            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
              {item.title}
              {item.caption && (
                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {/* group divider */}
      <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </>
  );
};

export default NavGroup;
