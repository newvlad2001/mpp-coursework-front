import {useAuthDispatch, useAuthState} from "../context";
import React, {useEffect, useState} from "react";
import {checkAuth} from "../context/actions";
import {Button, ButtonGroup, Container, Divider, Grid, Typography} from "@material-ui/core";
import PanelCardsVideosLayout from "../layouts/PanelCardsVideosLayout";
import API from "../utils/API";
import {useHistory, useParams} from "react-router-dom";
import Loading from "../components/Loading";
import {useSnackbar} from "notistack";
import Fade from "@material-ui/core/Fade";
import CustomAvatar from "../components/CustomAvatar";

export default function UserPage()
{
    const { userId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAuthDispatch();
    const userDetails = useAuthState();
    const history = useHistory();
    const [videosData, setVideosData] = useState([]);
    const [userData, setUserData] = useState({
        id: 0,
        name: "name",
        isAdmin: false,
        img: "asd"
    })
    const [loading, setLoading] = useState(true)
    useEffect(() => checkAuth(dispatch), []);

    useEffect(() => {
        API.get("videos/user/" + userId)
            .then((response) => {
                    const v = [];
                    Array.prototype.map.call(response.data.data, function (item) {
                        v.push(item)
                    })
                    setVideosData(v);
                    loadUserData();
                }, (error) => {
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
                })
    }, [])

    function loadUserData() {
        setLoading(true);
        API.get("users/" + userId)
            .then((response) => {
                    setUserData(response.data.data);
                    setLoading(false);
                }, (error) => {
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
                })
    }

    function handleChangeRole() {
        const data = {
            userId: userId,
            isAdmin: !userData.isAdmin
        }
        console.log(data)
        API.put("users/admin", data)
            .then((response) => {
                enqueueSnackbar("Role changed", {variant: "info"});
                loadUserData();
            }, (error) => {
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
            });
    }

    function handleDeleteUser() {
        API.delete("users/" + userId)
            .then((res) => {
                enqueueSnackbar("User with id = " + userId + " deleted", {variant: "info"});
                history.push("/");
            }, (error) => {
                enqueueSnackbar(error.response.data.error, {variant: "error"});
            });
    }

    const main =
        <Container maxWidth={"lg"} style={{marginTop: 40}}>
            <Grid container spacing={4} direction="column" justify="flex-start" alignItems="center">
                <Grid item container spacing={3} xs={12} justify="space-between" alignItems="center">
                    <Grid item container spacing={3} xs={12} md={8} justify="flex-start" alignItems="center">
                        <CustomAvatar
                            src={userData.img}
                            name={userData.name}
                            style={{marginRight:25}}
                        />
                        <Typography variant="h6" color="textPrimary">
                            {userData.name}
                        </Typography>
                    </Grid>
                    {userDetails.user.isAdmin === true &&
                    <Grid item xs={12} md={4} >
                        <ButtonGroup variant="outlined" size="small" color="primary">
                            <Button onClick={handleChangeRole}>
                                {userData.isAdmin ? "Delete admin rights" : "Grant admin rights"}
                            </Button>
                            <Button onClick={handleDeleteUser}>
                                Delete user
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    }
                </Grid>
                <Grid item sx={12}>
                    <Divider variant="fullWidth" />
                </Grid>
                <Grid item xs={12} container justify="flex-start">
                    <Typography variant="h6" color="textPrimary">
                        User`s videos
                    </Typography>
                    <Divider variant="fullWidth" />
                </Grid>
                <Divider variant="fullWidth" color={"#ffffff"} />
                <Grid item xs={12}>
                    <Fade>
                        <PanelCardsVideosLayout
                            handleNextPage={() => {}}
                            nextPage={false}
                            videosData={videosData}
                        />
                    </Fade>
                </Grid>
            </Grid>
        </Container>

    return loading ? <Loading /> : main;
}