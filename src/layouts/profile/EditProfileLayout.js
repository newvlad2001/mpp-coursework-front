import {Avatar, Container, Divider, makeStyles} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Button from "@material-ui/core/Button";
import {PhotoCamera} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {useSnackbar} from "notistack";
import IconButton from "@material-ui/core/IconButton";
import {useAuthDispatch, useAuthState} from "../../context";
import API from "../../utils/API";
import {changeUsername} from "../../context/actions";
import CustomAvatar from "../../components/CustomAvatar";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";


const useStyle = makeStyles((theme) => ({
    input: {
        display: 'none',
    },
    flex: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'space-around'
    }
}));

export default function EditProfileLayout() {
    const classes = useStyle();
    const userDetails = useAuthState();
    const dispatch = useAuthDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: userDetails.user.username,
        img: userDetails.user.img
    })
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleEditProfile = () => {
        setLoading(true);
        API.put("users", formData)
            .then((response) => {
                console.log(response);
                changeUsername(dispatch, response.data.data);
                enqueueSnackbar("Profile successfully changed", { variant: "success"});
                setLoading(false);
            },
                (error) => {
                    enqueueSnackbar(error.response.data.error, { variant: "error"});
                    setLoading(false);
                })
    }

    const handleChange = (event) => {
        const formData1 = {
            ...formData,
            email: formData.email,
            password: formData.password,
            username: formData.username
        };
        formData1[event.target.name] = event.target.value;
        console.log(formData1);
        setFormData(formData1);
    }

    function handleLoadImg(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        setLoading(true);
        reader.onload = () => {
            setFormData({
                ...formData,
                img: reader.result
            })
            setLoading(false);
        }
        reader.onerror = error => {
            enqueueSnackbar("Error while encoding the image", { variant: "warning"});
            setLoading(false);
        };
    }

    function closeChangePassword() {
        setOpen(false);
    }

    function openChangePassword() {
        setOpen(true);
    }

    return (
        <Container maxWidth={"sm"}>
            <div className={classes.paper}>
                <ValidatorForm onSubmit={handleEditProfile}>
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={12}>
                            <div className={classes.flex}>
                                <CustomAvatar src={formData.img} name={userDetails.user.username} />
                                <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={handleLoadImg} />
                                <label htmlFor="icon-button-file">
                                    <IconButton color="primary" size="small" aria-label="upload picture" component="span" disabled={loading}>
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                varint="standard"
                                fullWidth
                                onChange={handleChange}
                                label="Login"
                                name="username"
                                autoComplete="off"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                value={formData.username}
                                disabled={loading}
                            >
                            </TextValidator>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                varint="standard"
                                fullWidth
                                label="Email"
                                name="email"
                                disabled
                                value={userDetails.user.email}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                type="submit"
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                disabled={loading}
                                onClick={openChangePassword}
                            >
                                Change password
                            </Button>
                        </Grid>
                    </Grid>

                </ValidatorForm>
            </div>
            <ChangePassword
                handleClose={closeChangePassword}
                open={open}
            />
        </Container>
    )
}

function ChangePassword(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [passwordData, setPasswordData] = useState({
        password: '',
        newPassword: ''
    })
    const [load, setLoad] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!props.open) {
            passwordData.password = '';
            passwordData.newPassword = '';
            setPasswordData({...passwordData});
        }
    }, [props.open])


    function changeInput(event) {
        const newData = {...passwordData};
        newData[event.target.name] = event.target.value;
        setPasswordData(newData);
    }

    function handleButton() {
        setLoad(true);
        console.log(passwordData);
        API.put("/change-password", {...passwordData})
            .then((res) => {
                enqueueSnackbar("Password changed", { variant: "success" });
                setLoad(false);
                props.handleClose();
            }, (error) => {
                enqueueSnackbar(error.response.data.error, { variant: "error" });
                setLoad(false);
            })
    }

    return(
        <Dialog
            open={props.open}
            onClose={() => { if (!load) props.handleClose()}}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            fullWidth={true}
            fullScreen={fullScreen}
        >
            <DialogTitle id="form-dialog-title">Password changing</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Password changing
                </DialogContentText>
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    onChange={changeInput}
                    type="password"
                    name="password"
                    style={{marginBottom: 10}}
                    value={passwordData.password}
                    disabled={load}
                >
                </TextField>
                <Divider variant={"fullWidth"} style={{marginBottom: 10}}/>
                <TextField
                    label="New password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    onChange={changeInput}
                    name="newPassword"
                    value={passwordData.newPassword}
                    disabled={load}
                >
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { if (!load) props.handleClose()}} color="primary" disabled={load}>
                    Cancel
                </Button>
                <Button onClick={handleButton} color="primary" disabled={load}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )


}