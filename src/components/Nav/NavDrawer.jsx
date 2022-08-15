import * as React from 'react';
import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from 'react-router-dom';

import LogOutButton from '../LogOutButton/LogOutButton'
import "./Nav.css";

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StyleIcon from '@mui/icons-material/Style';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/base/ClickAwayListener';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NavDrawer() {

  useEffect(() => {
  }, []);

  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //when a link is clicked on the side nav bar use history.push to associated link
  //close the drawer
  const handleClick = (link) => {
    console.log('in handleClick',link)
      history.push(link);
      setOpen(false);
  }
  
  //Array of objects for each list item of the side nav bar
  //each object contains the text, link to push to, user type to render for
  //where to render, and which icon to render with it.
    const links = [
        {
            text: 'Dashboard',
            link: '/',
            userType: ['host', 'vendor'],
            upperLowerNav: 'upper',
            icon: <CalendarMonthIcon />
        },
        {
            text: 'Dashboard',
            link: '/',
            userType: ['admin'],
            upperLowerNav: 'upper',
            icon: <DashboardIcon />
        },
        {
            text: 'Add Event',
            link: '/addEventForm',
            userType: ['host', 'admin'],
            upperLowerNav: 'upper',
            icon: <AddCircleIcon />
        },
        {
            text: 'All Events',
            link: '/admin/events',
            userType: ['admin'],
            upperLowerNav: 'upper',
            icon: <CalendarMonthIcon />
        },
        {
            text: 'All Vendors',
            link: '/allvendors',
            userType: ['admin'],
            upperLowerNav: 'upper',
            icon: <ShoppingBagIcon />
        },
        {
            text: 'All Venues',
            link: '/allVenues',
            userType: ['none'],
            upperLowerNav: 'upper',
            icon: <StorefrontIcon />
        },
        {
            text: 'Manage Tags',
            link: '/manageTags',
            userType: ['admin'],
            upperLowerNav: 'upper',
            icon: <StyleIcon />
        },
        {
          text: 'Manage Venues',
          link: '/manageVenues',
          userType: ['admin'],
          upperLowerNav: 'upper',
          icon: <BusinessIcon />
        },
        {
            text: 'Profile',
            link: `/profile/${user.id}`,
            userType: ['host', 'vendor'],
            upperLowerNav: 'lower',
            icon: <PersonIcon />
        }
    ]

    // sets the profile image variable to display the first letter of their username/email
    let profileLetter = user.email && user.email.charAt(0).toUpperCase()

  return (
    <Box sx={{ display: 'flex', padding:0 }}>
      <AppBar position="fixed" open={open} sx={{ flexDirection:'row', justifyContent:'space-between', backgroundColor: '#5246A6'  }}>
      <ClickAwayListener onClickAway={handleDrawerClose}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* <Typography variant="h6" noWrap component="div" > */}
            <Link to='/'><img className='nav_ven' src='../Images/whiteVenboo.png'></img></Link> <br/>
            <p className='p_nav'>Connecting Passionate vendors to the best opportunities</p>
          {/* </Typography> */}
        </Toolbar>
        
        </ClickAwayListener>
        <Avatar 
        sx={{ margin:'10px', cursor:'pointer' }} 
        onClick={() => {history.push(`/profile/${user.id}`)}} 
        >
          {profileLetter}
        </Avatar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            {/* map through array links specified above to render side nav links */}
            {user && links.filter(item => {if (item.userType.indexOf(user.type) >= 0){return item}else{return}}).map((item, index) => (
                // item.userType.indexof('host') >= 0 ?
                    <ListItem key={index} disablePadding onClick={() => {handleClick(item.link)}}>
                    <ListItemButton>
                        <ListItemIcon>
                        {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                    </ListItem>
                    ))}
        </List>
        <Divider />
        <List>
            {!user.type ?
            <ListItem key='login' disablePadding onClick={() => {
              history.push("/login")
              setOpen(false);
              }}
            >
            <ListItemButton>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon >
              <ListItemText primary='Login' />
            </ListItemButton>
            </ListItem>
            :
            <ListItem key='logout' disablePadding onClick={() => {
              dispatch({ type: 'LOGOUT' })
              history.push("/")
              setOpen(false);
              }}
            >
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon >
              <ListItemText primary='Logout' />
            </ListItemButton>
            </ListItem>
            }
        </List>

      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>

  );
}
