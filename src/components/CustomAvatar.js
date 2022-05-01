import {Avatar, makeStyles} from "@material-ui/core";
import React, {useState} from "react";
import deepOrange from "@material-ui/core/colors/deepOrange";
import deepPurple from "@material-ui/core/colors/deepPurple";

const useStyle = makeStyles((theme) => ({
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
}))

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export default function CustomAvatar(props) {
    const src = props.src;
    const name = props.name;
    const classes = useStyle();
    const [isOrange] = useState(props.orange !== 1 ? getRandomInt(2) : 0);

    return (
        <Avatar
            src={src !== "default.png" ? src : ""}
            alt={name[0].toUpperCase()}
            onClick={props.onClick}
            style={{...props.style}}
            className={isOrange === 0 ? classes.orange : classes.purple}
        >
            {name[0].toUpperCase()}
        </Avatar>
    )
}