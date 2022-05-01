import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import {ExitToApp, VideoCall} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {logout, useAuthDispatch, useAuthState} from "../context";
import {checkAuth} from "../context/actions";
import CustomizedSearch from "../components/CustomSearch";
import CustomAvatar from "../components/CustomAvatar";
import API from "../utils/API";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        cursor: 'pointer'
    },
    titleOne: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
        cursor: 'pointer'
    },
    search: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export default function PrimarySearchAppBar() {
    const classes = useStyles();
    const dispatch = useAuthDispatch();
    const userDetails = useAuthState();
    const auth = userDetails.token !== '';
    useEffect(() => checkAuth(dispatch), []);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();



    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const history = useHistory();

    const handleProfileMenuOpen = (event) => {
        if (!auth) {
            history.push("/auth");
        } else {
            history.push("/profile");
        }
        handleMobileMenuClose()
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleExit = async () => {
        await API.delete("/auth")
            .then((res) => {
                logout(dispatch);
                enqueueSnackbar("Logged out", {variant: "success"})
            }, (error) => {
                enqueueSnackbar(error.response.data.error, {variant: "error"})
            })

        handleMobileMenuClose()
    };

    const handleNewVideo = () => {
        if (auth) {
            history.push("/new");
        }
        handleMobileMenuClose()
    }


    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {auth &&
            <MenuItem onClick={handleNewVideo}>
                <IconButton color="inherit">
                    <Badge color="secondary">
                        <VideoCall />
                    </Badge>
                </IconButton>
                <p>Add video</p>
            </MenuItem>
            }
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            {auth && <MenuItem onClick={handleExit}>
                <IconButton
                    aria-label="Log out"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <ExitToApp/>
                </IconButton>
                <p>Exit</p>
            </MenuItem>
            }
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap onClick={() => {
                        const go = window.location.pathname === "/";
                        history.push("/");
                        if (go) history.go(0);
                    }}>
                        MyTube
                    </Typography>
                    <Typography className={classes.titleOne} variant="h5" onClick={() => {
                        const go = window.location.pathname === "/";
                        history.push("/");
                        if (go) history.go(0);
                    }}>
                        T
                    </Typography>
                    <div className={classes.search}>
                        <CustomizedSearch />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {auth &&
                        <IconButton aria-label="Add new video" color="inherit" onClick={handleNewVideo}>
                            <Badge color="secondary">
                                <VideoCall />
                            </Badge>
                        </IconButton>
                        }

                        <IconButton
                            aria-label="Your account"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {auth ?
                                <CustomAvatar
                                src={userDetails.user.img}
                                name={userDetails.user.username}
                                style={{height:30, width: 30}}
                                orange={1}
                                />
                            :
                                <AccountCircle />
                            }
                        </IconButton>
                        {auth &&
                        <IconButton
                            edge="end"
                            aria-label="Log out"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleExit}
                            color="inherit"
                        >
                            <ExitToApp/>
                        </IconButton>
                        }
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </div>
    );
}