import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles({
    add: {
        width: '100%',
        marginBottom: 10
    },
    media: {
        height: 140
    }
})

export default function CardVideoWithAbout(props) {
    const classes = useStyles();
    const history = useHistory();


    return (
        <Card className={classes.add}>
            <CardActionArea onClick={() => {
                history.push("/video/" + props.item.id);
                history.go(0)
            }}>
                <CardContent>
                    <Typography gutterBottom variant="subtitle1">
                        {props.item.name}
                    </Typography>
                    <Typography gutterBottom variant="body2">
                        {props.item.about}
                    </Typography>
                    <Typography variant="subtitle2">
                        {props.item.user.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}