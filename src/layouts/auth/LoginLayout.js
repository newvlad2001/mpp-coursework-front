import React, {useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {loginUser, useAuthDispatch, useAuthState} from "../../context";
import {useHistory} from "react-router";
import {useSnackbar} from "notistack";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import API from "../../utils/API";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    input: {
        WebkitBoxShadow: "0 0 0 1000px #303030 inset"
    }
}));

export default function LoginLayout(props) {
    const classes = useStyles();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        login: '',
        password: ''
    })

    const dispatch = useAuthDispatch();
    const { loading } = useAuthState();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            let username = formData.login;
            let password = formData.password;
            let user = await loginUser(dispatch, { username, password });
            console.log('alo', user);
            if (user) {
                enqueueSnackbar("Success!", { variant: 'success' });
                history.push('/');
            } else {
                enqueueSnackbar("Incorrect login/password", { variant: 'error' });
            }

        } catch (error) {
            console.log(error);
        }
    };



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const formData1 = {
            password: formData.password,
            login: formData.login
        };
        formData1[event.target.name] = event.target.value;
        setFormData(formData1);
    }

    return (
        <Container maxWidth="sm">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5" color="textPrimary">
                    Log in
                </Typography>
                <ValidatorForm className={classes.form} onSubmit={handleLogin}>
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="login"
                        label="Login"
                        name="login"
                        autoComplete="username"
                        autoFocus
                        disabled={loading}
                        validators={['required']}
                        errorMessages={['This field is required']}
                        value={formData.login}
                        onChange={handleChange}
                        inputProps={{ className: classes.input }}
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        disabled={loading}
                        validators={['required']}
                        errorMessages={['This field is required']}
                        value={formData.password}
                        onChange={handleChange}
                        inputProps={{ className: classes.input }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                        disabled={loading}
                    >
                        Sign in
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link style={{cursor: 'pointer'}} variant="body2" onClick={handleClickOpen}>
                                Forgot your password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link style={{cursor: 'pointer'}} variant="body2" onClick={() => props.handleLink()}>
                                {"No account? Register"}
                            </Link>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
            <ResetPassword handleClose={handleClose} open={open} />
        </Container>
    );
}


function ResetPassword(props) {
    const { enqueueSnackbar } = useSnackbar();
    const emailRef = useRef(null);

    const handleButton = async () => {

        const data = {
            email: emailRef.current.value
        }

        await API.post('reset', data)
            .then((data) => {
                    enqueueSnackbar("Check email", { variant: 'success' });
            },
                (error) => {
                    enqueueSnackbar("User with such email does not exist", { variant: 'error' });
            });


        props.handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Password recovery</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your email
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    inputRef={emailRef}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleButton} color="primary">
                    Recover my password
                </Button>
            </DialogActions>
        </Dialog>
    )
}