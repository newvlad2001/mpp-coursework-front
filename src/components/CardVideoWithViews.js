import {useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    card: {
        width: 355
    },
    card_img: {
        width: '100%',
        minHeight: 200,
        objectFit: 'contain'
    }
})

export default function CardVideoWithViews(props) {
    const classes = useStyles();
    const history = useHistory();


    return (
        <Grid item xs="auto">
            <Card className={classes.card}>
                <CardActionArea onClick={() => history.push("/video/" + props.item.id)}>
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            {props.item.name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {"Author: " + props.item.user.name}
                        </Typography>
                        <Grid container justify="flex-end" wrap="nowrap" alignItems="center" spacing={1}>
                            <Grid item>
                                <Typography variant="body2">{"Views: " + props.item.views}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}