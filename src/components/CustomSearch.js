import IconButton from "@material-ui/core/IconButton";
import React, {useState} from "react";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SearchIcon from '@material-ui/icons/Search';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {orange} from "@material-ui/core/colors";
import grey from "@material-ui/core/colors/grey";
import {Container} from "@material-ui/core";
import {useHistory, useLocation} from "react-router";
import {Star} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: 400,
        background: theme.palette.primary.light
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const innerTheme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: orange,
        info: grey,
    },
});

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function CustomizedSearch() {
    const classes = useStyles();
    const query = useQuery();
    const [str, setStr] = useState(query.get("name") ? query.get("name") : "");
    const history = useHistory();

    function searchSubmit(event) {
        event.preventDefault();
        if (!(!str || /^\s*$/.test(str))) {
            history.push("/?name=" + str);
            history.go(0)
        } else {
            setStr("");
        }
    }

    function changeString(event) {
        setStr(event.target.value);
    }

    function sortByLikes() {
        history.push("/?sort=views");
        window.location.reload();
    }

    return (
        <ThemeProvider theme={innerTheme}>
            <Container component="form" className={classes.root} onSubmit={searchSubmit}>
                <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'Search' }}
                    onChange={changeString}
                    value={str}
                />
                <IconButton color="inherit" type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton color="inherit" className={classes.iconButton} aria-label="directions" onClick={sortByLikes}>
                    <Star fontSize="small" />
                </IconButton>
            </Container>
        </ThemeProvider>
    );
}