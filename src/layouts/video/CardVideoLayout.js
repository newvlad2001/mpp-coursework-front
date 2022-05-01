import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {CardContent, IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import API from "../../utils/API";
import {ThumbDown, ThumbUp} from "@material-ui/icons";
import {useAuthState} from "../../context";
import {useSnackbar} from "notistack";
import Divider from "@material-ui/core/Divider";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router";
import Loading from "../../components/Loading";
import CustomAvatar from "../../components/CustomAvatar";

const useStyles = makeStyles({
    video: {
        width: '100%',
        outline: 'none'
    }
})

function CardVideoLayout(props) {

    const [videoToken] = useState(props.videoToken);
    const userDetails = useAuthState();
    const auth = userDetails.token !== '';
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    const [isLoaded, setIsLoaded] = useState(false);
    const [videoData, setVideoData] = useState({
        id: 0,
        video: 'unknow',
        user: {
            id: 0,
            name: 'name',
            img: 'img'
        }
    })
    const [mark, setMark] = useState({
        likes: 0,
        dislikes: 0
    })
    const [like, setLike] = useState(0);
    const [token] = useState(videoToken);
    const [markLoad, setMarkLoad] = useState(false);


    function loadMarks() {
        setMarkLoad(true);
        if (auth) {
            API.get(`/marks/${videoToken}/user/${userDetails.user.id}`)
                .then((response) => {
                        const mark = response.data.data;
                        setMarkLoad(false);
                        setMark({
                            likes: mark.likes,
                            dislikes: mark.dislikes
                        });
                        setLike(mark.markOwner);
                    },
                    (error) => {
                        enqueueSnackbar(error.response.data.error, { variant: "error"})
                    })
        } else {
            API.get(`/marks/${videoToken}`)
                .then((response) => {
                        const mark = response.data.data;
                        setMarkLoad(false);
                        setMark({
                            likes: mark.likes,
                            dislikes: mark.dislikes
                        });
                        setLike(0);
                    },
                    (error) => {
                        enqueueSnackbar(error.response.data.error, { variant: "error"})
                    })
        }
    }

    function changeMark(mark) {
        setMarkLoad(true);
        const data = {
            videoId: videoToken,
            userId: userDetails.user.id,
            mark: mark
        }
        API.post('/marks/', data)
            .then((response) => {
                    const mark = response.data.data;
                    setMarkLoad(false);
                    setMark({
                        likes: mark.likes,
                        dislikes: mark.dislikes
                    });
                    setLike(mark.markOwner);
            },
                (error) => {
                    enqueueSnackbar(error.response.data.error, { variant: "error"})
                    setMarkLoad(false);
                    setLike(0);
                    setMarkLoad(false);
                });
    }

    function deleteVideo() {
        API.delete("videos/" + videoToken)
            .then((response) => {
                    enqueueSnackbar("Deleted", {variant: "success"});
                    history.push("/");
                },
                (error) => {
                    console.log(error);
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
                })
    }


    useEffect(() => {
        API.get('/videos/' + token)
            .then((res) => {
                setVideoData(res.data.data);
                setIsLoaded(true);
                loadMarks();
            },
                (error) => {
                    enqueueSnackbar(error.response.data.error, { variant: "error"})
                })
            .catch(() => {
            });
    }, []);

    function handleLike() {
        if (like === 1) {
            changeMark(0);
        }
        else {
            changeMark(1);
        }
    }

    function handleDislike() {
        if (like === -1) {
            changeMark(0);
        }
        else {
            changeMark(-1);
        }
    }

    const Video = (
        <Card>
            <CardMedia>
                <video className={classes.video} controls autoplay>
                    <source src={"http://localhost:3000/api/file/videos/" + videoData.video} type="video/mp4"/>
                </video>
            </CardMedia>
            <CardHeader
                title={videoData.name}
                subheader={
                    <React.Fragment>
                        <Typography
                            gutterBottom
                            variant="subtitle1"
                        >
                            {videoData.views + " views"}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                        >
                            {new Date(videoData.createDate).toLocaleDateString()}
                        </Typography>
                        {videoData.isPrivate &&
                        <Typography
                            variant="subtitle2"
                        >
                            {"This is a private video"}
                        </Typography>
                        }
                    </React.Fragment>
                }
                action={
                    <React.Fragment>
                        <IconButton
                            color={like === 1 ? "primary" : "default"}
                            disabled={!auth || markLoad}
                            onClick={handleLike}
                        >
                            <ThumbUp />
                        </IconButton>
                        <Typography
                            variant="subtitle2"
                            style={{display: 'inline'}}
                            color="textSecondary"
                        >
                            {mark.likes}
                        </Typography>
                        <IconButton
                            color={like === -1 ? "primary" : "default"}
                            disabled={!auth || markLoad}
                            onClick={handleDislike}
                        >
                            <ThumbDown />
                        </IconButton>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            style={{display: 'inline'}}
                        >
                            {mark.dislikes}
                        </Typography>
                    </React.Fragment>
                }
            />
            <Divider variant="middle" />
            <CardHeader
                avatar={
                    <CustomAvatar
                        src={videoData.user.img}
                        name={videoData.user.name}
                        onClick={() => history.push("/user/" + videoData.user.id)}
                        style={{cursor: 'pointer'}}
                    />
                }
                title={<div onClick={() => history.push("/user/" + videoData.user.id)} style={{cursor: 'pointer'}}>{videoData.user.name}</div>}/>
            <CardContent>
                <Typography>
                    {videoData.about}
                </Typography>
            </CardContent>
            {userDetails.user.isAdmin === true &&
            <CardActions>
                <Button color="primary" onClick={deleteVideo}>Delete video</Button>
            </CardActions>}
        </Card>
    );

    return !isLoaded ? <Loading /> : Video;

}

export default CardVideoLayout;