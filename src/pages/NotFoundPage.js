import {Typography} from "@material-ui/core";
import React, {useEffect} from "react";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthDispatch, useAuthState} from "../context";
import {checkAuth} from "../context/actions";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    font: {
        fontSize: 50
    }
}));

function NotFoundPage() {
    const classes = useStyles();
    const dispatch = useAuthDispatch();
    const userDetails = useAuthState();
    const auth = userDetails.token !== '';
    useEffect(() => checkAuth(dispatch), []);
    return (
        <Container maxWidth="sm">
            <div className={classes.paper}>
                <Typography component="h1" variant="h1" className={classes.font} color="textPrimary">
                   Page not found
                </Typography>
            </div>
        </Container>

    )
}

export default NotFoundPage;