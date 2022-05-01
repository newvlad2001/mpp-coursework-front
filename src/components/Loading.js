import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    center: {
        width: '100%'
    }
})

function Loading() {
    const classes = useStyles();

    return (
        <Card>
            <CardContent>
                <LinearProgress className={classes.center} />
            </CardContent>
        </Card>
    )
}

export default Loading;