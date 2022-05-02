import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {useAuthState} from "../../context";
import {useSnackbar} from "notistack";
import API from "../../utils/API";
import {useHistory} from "react-router";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Divider} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function createData(id,name, views, likes, dislikes, about, isPrivate) {
    return { id ,name, views, likes, dislikes, about, isPrivate };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'views', numeric: true, disablePadding: false, label: 'Views' },
    { id: 'likes', numeric: true, disablePadding: false, label: 'Likes' },
    { id: 'dislikes', numeric: true, disablePadding: false, label: 'Dislikes' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="right">
                    Type
                </TableCell>
                <TableCell>
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function TableVideosLayout() {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [openEditVideoState, setOpenEditVideoState] = useState(false);
    const [currentRow, setCurrentRow] = useState({
        name: '',
        id: 0,
        about: '',
        isPrivate: false
    });
    const userDetails = useAuthState();
    const { enqueueSnackbar } = useSnackbar();
    const rowsPerPage = 8;
    const history = useHistory();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    function loadRows() {
        API.get("videos/user/" + userDetails.user.id)
            .then((response) => {
                    console.log(response.data.data);
                    const r = [];
                    Array.prototype.map.call(response.data.data, function (item) {
                        r.push(createData(item.id, item.name, item.views, item.likes, item.dislikes, item.about, item.isPrivate))
                    })
                    setRows(r);
                },
                (error) => {
                    console.log(error);
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
                })
    }

    useEffect(() => {
        loadRows();
    },[])

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    function deleteVideo(id) {
        API.delete("videos/" + id)
            .then((response) => {
                enqueueSnackbar("Deleted", {variant: "success"});
                loadRows();
            },
                (error) => {
                    console.log(error);
                    enqueueSnackbar(error.response.data.error, {variant: "error"});
                })
    }

    function openEditVideo(row) {
        setCurrentRow(row);
        setOpenEditVideoState(true);
    }

    function closeEditVideo() {
        setOpenEditVideoState(false);
        loadRows();
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='medium'
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell style={{cursor: "pointer"}} onClick={() => { history.push("/video/" + row.id);}}>{row.name}</TableCell>
                                            <TableCell align="right">{row.views}</TableCell>
                                            <TableCell align="right">{row.likes}</TableCell>
                                            <TableCell align="right">{row.dislikes}</TableCell>
                                            <TableCell align="right">{row.isPrivate === false ? "Public" : "Private"}</TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => {openEditVideo(row)}}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {deleteVideo(row.id)}}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={rowsPerPage}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                />
            </Paper>
            <EditVideo
                handleClose={closeEditVideo}
                open={openEditVideoState}
                row={currentRow}
                handleChangeInput={(event) => {
                    currentRow[event.target.name] = event.target.value;
                    setCurrentRow({...currentRow});
                }}
                handlePrivate={() => {
                    currentRow.isPrivate = !currentRow.isPrivate;
                    setCurrentRow({...currentRow});
                    console.log(currentRow)
                }}
                handleButton={() => {
                    console.log(currentRow)
                    API.put(`/videos/${currentRow.id}`, currentRow)
                        .then((data) => {
                                enqueueSnackbar("Success!", { variant: 'success' });
                                closeEditVideo();
                            },
                            (error) => {
                                enqueueSnackbar("Something went wrong", { variant: 'error' });
                                closeEditVideo();
                            });
                }}
            />
        </div>
    );
}

function EditVideo(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            fullWidth={true}
            fullScreen={fullScreen}
        >
            <DialogTitle id="form-dialog-title">{"Editing video '" + props.row.name + "'"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Video fields editing
                </DialogContentText>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    onChange={props.handleChangeInput}
                    name="name"
                    style={{marginBottom: 10}}
                    value={props.row.name}
                >
                </TextField>
                <Divider variant={"fullWidth"} style={{marginBottom: 10}}/>
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    onChange={props.handleChangeInput}
                    name="about"
                    multiline
                    rowsMax={10}
                    value={props.row.about}
                >
                </TextField>
                <FormControlLabel
                    control={<Switch color="primary" checked={props.row.isPrivate} onChange={props.handlePrivate} name="privateVideo" />}
                    label="Private video"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.handleButton} color="primary">
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}