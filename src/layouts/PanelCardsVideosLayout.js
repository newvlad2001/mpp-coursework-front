import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {Button} from "@material-ui/core";
import CardVideoWithViews from "../components/CardVideoWithViews";


export default function PanelCardsVideosLayout(props) {
    const videosData = props.videosData;
    const handleNextPage = props.handleNextPage;
    const nextPage = props.nextPage;
    return (
        <Grid container spacing={4} justify="center" alignItems="center">
            {videosData.length === 0 &&
            <Grid container item xs={12} justify="center">
                <Typography variant="h5" color="textSecondary">
                    Videos not found
                </Typography>
            </Grid>}
            {
                videosData.length !== 0 &&
                <React.Fragment>
                    {
                        Array.prototype.map.call(videosData, function (item) {
                            return <CardVideoWithViews key={item.id} item={item} />;
                        })
                    }
                    {nextPage &&
                    <Grid container item xs={12} justify="center">
                        <Button variant="outlined" onClick={handleNextPage}>
                            Show more
                        </Button>
                    </Grid>}
                </React.Fragment>
            }
        </Grid>
    )
}