import React, {useEffect} from 'react';
import 'fontsource-roboto';
import Grid from "@material-ui/core/Grid";
import {useParams} from "react-router-dom";
import CardCommentsLayout from "../layouts/video/CardCommentsLayout";
import VerticalPanelCardsVideosLayout from "../layouts/VerticalPanelCardsVideosLayout";
import CardVideoLayout from "../layouts/video/CardVideoLayout";
import {useAuthDispatch, useAuthState} from "../context";
import {checkAuth} from "../context/actions";


function VideoPage() {
    const { videoToken } = useParams();
    const dispatch = useAuthDispatch();
    const userDetails = useAuthState();
    const auth = userDetails.token !== '';
    useEffect(() => checkAuth(dispatch), []);
    return (
        <Grid container spacing={4} justify="center">
            <Grid item lg={11} md={9} xs={12}>
                <CardVideoLayout videoToken={videoToken} />
            </Grid>
            <Grid item xs={12} md={6} lg={7} sm={7}>
                <CardCommentsLayout isAdmin={userDetails.user.isAdmin === true} videoId={videoToken} userId={userDetails.user.id} auth={auth} />
            </Grid>
            <Grid item xs={10} md={3} lg={4} sm={5}>
                <VerticalPanelCardsVideosLayout />
            </Grid>
        </Grid>
    );
}

export default VideoPage;