import {useHistory, useLocation} from "react-router";
import {makeStyles} from "@material-ui/core/styles";
import {useSnackbar} from "notistack";
import React, {useRef, useState} from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import API from "../utils/API";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
    const query = useQuery();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const classes = useStyles();
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(false)

    const handleReset = () => {
        setLoading(true);
        const data = {
            id: query.get("id"),
            token: query.get("token"),
            newPassword: passwordRef.current.value
        }
        API.put("/reset", data)
            .then((data) => {
                setLoading(false);
                enqueueSnackbar("Password changed", {variant: "success"});
                history.push("/auth");
            }, (error) => {
                enqueueSnackbar(error.response.data.error, {variant: "error"});
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Password recovery
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="new-password"
                        label="Enter a new password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        disabled={loading}
                        inputRef={passwordRef}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Change password
                    </Button>
                </form>
            </div>
        </Container>
    )
}