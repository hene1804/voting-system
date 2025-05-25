import React, { useState } from 'react';
import "./navBar.scss";
import { Link, useNavigate } from 'react-router-dom';
import {
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Home as HomeIcon } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';

//context
import { useAuth } from '../../AuthContext';

const NavBar = () => {
    const { logout } = useAuth();

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
    logout();
    navigate('/');
    };

    const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
    };
    return (
        <Toolbar disableGutters>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/home" style={{display:"flex", justifyContent: "center"}}>
                <img className="navbarLogo" src={process.env.PUBLIC_URL + '/img/mmu-evotingeLogoSmallVersionCircular.png'} alt="" />
            </Link>
            </Typography>
            <div className="navbar-links">
            <Link to="/home" color="inherit" className="nav-link" sx={{ marginRight: 2 }}><HomeIcon style={{fontSize: "1.7rem", marginBottom: "2px"}} /> <p>Home</p></Link>
            <Link to="/security" color="inherit" className="nav-link" sx={{ marginRight: 2 }}><LockIcon style={{marginBottom: "2.5px"}} /> <p>Security</p></Link>
            <Link to="/calendar" color="inherit" className="nav-link" sx={{ marginRight: 2 }}><CalendarMonthIcon style={{marginBottom: "2px"}} /> <p>Calendar</p></Link>
            <Link to="/history" color="inherit" className="nav-link" sx={{ marginRight: 2 }}><HistoryIcon style={{fontSize: "1.7rem", marginBottom: "2px"}} /> <p>History</p></Link>
            <Link to="/profile" color="inherit" className="nav-link" sx={{ marginRight: 2 }}><AccountBoxIcon /> <p>Profile</p></Link>
            <Button className='navbar-button' color="inherit" onClick={handleLogout}>Logout</Button>
            </div>
            <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            >
            <MenuIcon />
            </IconButton>
            <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            >
            <MenuItem onClick={handleMenuClose}><Link to="/home" color="inherit" className="nav-link">Home</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/security" color="inherit" className="nav-link">Security</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/calendar" color="inherit" className="nav-link">Calendar</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/history" color="inherit" className="nav-link">History</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/profile" color="inherit" className="nav-link">Profile</Link></MenuItem>
            <MenuItem onClick={handleLogout}><Typography color="inherit">Logout</Typography></MenuItem>
            </Menu>
        </Toolbar>
    )
}

export default NavBar