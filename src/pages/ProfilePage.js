import React, {useEffect} from "react";
import {Button, Container, Grid, makeStyles, Typography} from "@material-ui/core";
import {useHistory} from "react-router";
import TableVideosLayout from "../layouts/profile/TableVideosLayout";
import EditProfileLayout from "../layouts/profile/EditProfileLayout";
import {useAuthDispatch} from "../context";
import {checkAuth} from "../context/actions";


const useStyle = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2)
    },
    headers: {
        marginBottom: theme.spacing(2)
    },
    addVideo: {
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: "center",
        justifyContent: 'space-between'
    }
}));

export default function ProfilePage() {
    const classes = useStyle();
    const dispatch = useAuthDispatch();
    const history = useHistory();
    useEffect(() => checkAuth(dispatch), []);

    return (
        <Container maxWidth="lg">
            <Grid container className={classes.paper} spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" className={classes.headers} color="textPrimary">
                        Your profile
                    </Typography>
                    <EditProfileLayout />
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.addVideo}>
                        <Typography variant="h4" color="textPrimary">
                            Your videos
                        </Typography>
                        <Button color="primary" variant="text" onClick={() => history.push("/new")}>Add video</Button>
                    </div>
                    <TableVideosLayout />
                </Grid>
            </Grid>
        </Container>
    )
}