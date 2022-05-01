import { Container, makeStyles} from "@material-ui/core";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {useSnackbar} from "notistack";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import API from "../utils/API";
import {useAuthState} from "../context";
import {useHistory} from "react-router";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DialogContent from "@material-ui/core/DialogContent";

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" >{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const userStyle = makeStyles((theme) => ({
    input: {
        display: 'none'
    },
    paper: {
        marginTop: theme.spacing(3)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

export default function NewVideoPage() {
    const classes = userStyle();
    const { enqueueSnackbar } = useSnackbar();
    const userDetails = useAuthState();
    const history = useHistory();
    const [load, setLoad] = React.useState(false);
    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        about: '',
        isPrivate: false
    })

    const handleChange = (event) => {
        formData[event.target.name] = event.target.value;
        setFormData({...formData});
    }

    const handleNewVideo = async () => {
        setLoad(true);
        const f = new FormData();
        f.append("name", formData.name);
        f.append("about", formData.about);
        f.append("userId", userDetails.user.id);
	    f.append("isPrivate", formData.isPrivate.toString());
        f.append("file", document.getElementById("icon-button-file").files[0])
        await API.post("file/videos", f, {
            onUploadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) {
                    setProgress(Math.round((progressEvent.loaded * 100) / totalLength));
                }
            }
        }).then((response) => {
                console.log(response.data);
		        enqueueSnackbar("Uploaded", { variant: "success"});
                setLoad(false);
                setProgress(0);
                history.push("/video/" + response.data.data.id);
        },
            (error) => {
                enqueueSnackbar(error.response.data.error, { variant: "error"});
                setLoad(false);
                setProgress(0);
            }).catch((error) => {
                console.log(error);
        })
    }

    function handlePrivate() {
        formData.isPrivate = !formData.isPrivate;
        setFormData({...formData});
    }

    return (
        <Container maxWidth={"sm"}>
            <div className={classes.paper}>
                <ValidatorForm onSubmit={handleNewVideo}>
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={12}>
                            <input accept="video/mp4" className={classes.input} id="icon-button-file" type="file" />
                            <label htmlFor="icon-button-file">
                                <Button component="span" color="primary">
                                    Choose file
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="standard"
                                fullWidth
                                onChange={handleChange}
                                label="Name"
                                name="name"
                                autoComplete="off"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                value={formData.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                fullWidth
                                multiline
                                rowsMax={20}
                                rows={4}
                                onChange={handleChange}
                                label="Description"
                                name="about"
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <FormControlLabel
                                control={<Switch checked={formData.isPrivate} onChange={handlePrivate} name="privateVideo" />}
                                label="Private video"
                                color="textPrimary"
                            />
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                type="submit"
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
                <Backdrop className={classes.backdrop} open={load}>
                    <CircularProgressWithLabel value={progress} />
                </Backdrop>
            </div>
        </Container>
    )
}