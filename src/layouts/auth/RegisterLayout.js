import React, { useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import API from "../../utils/API";
import {useSnackbar} from "notistack";
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    input: {
        WebkitBoxShadow: "0 0 0 1000px #303030 inset"
    }
}));

export default function RegisterLayout(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        login: ''
    })
    const [loading, setLoading] = useState(false);

    const handleSignUp = () => {
        setLoading(true);
        const data = {
            username: formData.login,
            email: formData.email,
            password: formData.password
        }
        API
            .post('register', data)
            .then((res) => {
                setLoading(false);
                enqueueSnackbar("You are registered!", { variant: 'success' });
                props.handleLink();
            }, (error) => {
                setLoading(false);
                const response = error.response.data;
                enqueueSnackbar(response.error, { variant: 'error' });
                console.log(response);
            });
    }

    const handleChange = (event) => {
        const formData1 = {
            email: formData.email,
            password: formData.password,
            login: formData.login
        };
        formData1[event.target.name] = event.target.value;
        setFormData(formData1);
    }


    return (
        <Container maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <ValidatorForm className={classes.form}
                               onSubmit={handleSignUp}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                label="Login"
                                name="login"
                                autoComplete="username"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                value={formData.login}
                                disabled={loading}
                                inputProps={{ className: classes.input }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                label="Email"
                                name="email"
                                autoComplete="email"
                                validators={['required', 'isEmail']}
                                errorMessages={['This field is required', 'Wrong format']}
                                value={formData.email}
                                disabled={loading}
                                inputProps={{ className: classes.input }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                value={formData.password}
                                disabled={loading}
                                inputProps={{ className: classes.input }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        className={classes.submit}
                    >
                        Sign up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link style={{cursor: 'pointer'}} variant="body2" onClick={() => props.handleLink()}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        </Container>
    );
}