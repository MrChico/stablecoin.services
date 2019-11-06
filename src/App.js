import React from 'react';
import { createStore, withStore } from '@spyna/react-store'

import NavContainer from './containers/NavContainer'

import theme from './theme/theme'
import classNames from 'classnames'

import { withStyles, ThemeProvider } from '@material-ui/styles';
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import NavigationIcon from '@material-ui/icons/Navigation';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import LoopIcon from '@material-ui/icons/Loop';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import LinearProgress from '@material-ui/core/LinearProgress';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';


const styles = () => ({
  root: {
    flexGrow: 1,
  },
  paper: {
  },
  navContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    minHeight: 52
  },
  contentContainer: {
      boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.05)',
      borderRadius: theme.shape.borderRadius,
      padding: 0,
      marginBottom: theme.spacing(3)
  }
})

const initialState = {
    web3: null,
    walletAddress: '',
    walletConnecting: false,
    walletType: ''
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
    }

    render() {
        const classes = this.props.classes

        console.log(this.state, this.props)

        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <Grid container>
                        <Grid item xs={12}><br/></Grid>

                        <NavContainer />

                        <Grid item xs={12} className={classes.contentContainer}>

                        </Grid>

                    </Grid>
                </Container>
            </ThemeProvider>
        );
    }
}

export default createStore(withStyles(styles)(App), initialState)
