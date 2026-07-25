// // material-ui
// import { Typography } from '@mui/material';

// // project imports
// import NavGroup from './NavGroup';
// import menuItem from 'menu-items';

// // ==============================|| SIDEBAR MENU LIST ||============================== //

// const MenuList = () => {
//   const navItems = menuItem.items.map((item) => {
//     console.log(item ,"item");
    
//     switch (item.type) {
//       case 'group':
//         return <NavGroup key={item.id} item={item} />;
//       default:
//         return (
//           <Typography key={item.id} variant="h6" color="error" align="center">
//             Menu Items Error
//           </Typography>
//         );
//     }
//   });

//   return <>{navItems}</>;
// };

// export default MenuList;




// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //



const MenuList = () => {
  const filterHiddenItems = (items) =>
    items
      .filter((item) => !item.hidden) // Filter top-level hidden items
      .map((item) => ({
        ...item,
        children: item.children ? filterHiddenItems(item.children) : [], // Recursively filter hidden children
      }));
  // Apply the filter to remove hidden items
  const navItems = filterHiddenItems(menuItem.items).map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};



export default MenuList;

