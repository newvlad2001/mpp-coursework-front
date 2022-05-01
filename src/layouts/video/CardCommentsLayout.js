import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {Delete} from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {Button} from "@material-ui/core";
import {useSnackbar} from "notistack";
import API from "../../utils/API";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import {useHistory} from "react-router";
import CustomAvatar from "../../components/CustomAvatar";


function CardCommentsLayout(props) {
    const userId = props.userId;
    const videoId = props.videoId;
    const isAdmin = props.isAdmin;
    const { enqueueSnackbar } = useSnackbar();
    const auth = props.auth;
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");

    function loadComments() {
        setLoading(false);

        API.get("comments/video/" + videoId)
            .then((response) => {
                console.log(response.data.data);
                setList(response.data.data);
                setLoading(true);
            }, (error) => {
                console.log(error.data);
                enqueueSnackbar(error.response.data.error, {variant: "error"});
                setLoading(true);
            })

    }

    function handleChange(e) {
        setText(e.target.value);
    }

    function handleCreateComment() {
        const createCommentData = {
            text: text,
            video_id: videoId,
            user_id: userId
        }

        API.post("comments", createCommentData)
            .then(
                (response) => {
                    console.log(response.data.data)
                    setText("");
                    enqueueSnackbar("Comment added", {variant: "success"});
                    loadComments();
                },
                (error) => {
                    console.log(error.data);
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
                });
    }

    useEffect(loadComments, []);

    return (
        <Paper>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                style={{paddingLeft: 15, paddingRight: 15}}
                spacing={3}
            >
                {auth &&
                <Grid item xs >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth={true}
                        multiline
                        rowsMax={20}
                        rows={4}
                        onChange={handleChange}
                        placeholder="Post comment"
                        name="text"
                        value={text}
                        autoComplete="off"
                    />
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleCreateComment}
                    >
                        Send
                    </Button>
                </Grid>
                }
                <Grid item xs  >
                    { loading ? <ListComments isAdmin={isAdmin} list={list}  /> : <CircularProgress /> }
                </Grid>
            </Grid>
        </Paper>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

function ListComments(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const [list, setList] = useState(props.list.map((item) => {
        item.createDate = new Date(item.createDate);
        return item;
    }).sort((a, b) => {
        return new Date(b.createDate) - new Date(a.createDate);
    }));

    function deleteComment(item, index) {
        API.delete("/comments/" + item.id)
            .then((res) => {
                const l = list.slice();
                const removed = l.splice(index, 1);
                setList(l);
                enqueueSnackbar(`Comment ${removed[0].text} deleted`, { variant: "success" });
            },
                (error) => {
                enqueueSnackbar("Comment cannot be deleted", { variant: "warning" });
            })
    }

    return (
        <List className={classes.root} subheader={
            <React.Fragment>
                <ListSubheader>Comments</ListSubheader>
                <Divider variant="fullWidth" />
            </React.Fragment>
        }>
            {
                Array.prototype.map.call(list, function (item, index) {
                    return (
                        <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <CustomAvatar
                                    src={item.user.img}
                                    name={item.user.name}
                                    onClick={() => history.push("/user/" + item.user.id)}
                                    style={{cursor: 'pointer'}}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <div onClick={() => history.push("/user/" + item.user.id)} style={{cursor: 'pointer', display: 'inline'}}>
                                            {item.user.name}
                                        </div>
                                        <Typography
                                            component="span"
                                            variant="subtitle2"
                                            className={classes.inline}
                                            color="textSecondary"
                                            style={{marginLeft:15}}
                                        >
                                            {new Date(item.createDate).toLocaleString()}
                                        </Typography>
                                    </React.Fragment>
                                    }
                                secondary={
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {item.text}
                                    </Typography>
                                }
                            />
                            {props.isAdmin &&
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => deleteComment(item, index)}>
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction> }
                        </ListItem>
                            {index !== list.length - 1 && <Divider variant="fullWidth" />}
                        </React.Fragment>
                    )
                })
            }
        </List>
    )
}


export default CardCommentsLayout;