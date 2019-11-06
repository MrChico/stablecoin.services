import React from 'react';
import Web3 from "web3";
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'
import classNames from 'classnames'

import AccountIcon from '@material-ui/icons/AccountCircle';
import WifiIcon from '@material-ui/icons/Wifi';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';


const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
    actionsContainer: {
        marginTop: theme.spacing(3)
    },
    accountButton: {
      '& svg': {
        marginRight: theme.spacing(1)
      }
    },
  input: {
      width: '100%',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3)
  },
  account: {
  },
  panel: {
      padding: theme.spacing(3),
      border: '1px solid #eee',
      borderRadius: theme.spacing(1)
  },
  accountItem: {
      marginBottom: theme.spacing(2)
  },
  permit: {
      marginTop: 14
  },
  permitButton: {
      [theme.breakpoints.down('sm')]: {
          marginTop: theme.spacing(1)
      },
      [theme.breakpoints.up('md')]: {
          textAlign: 'right'
      },
  }
})

class IssueCheckContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
    }

    async initBrowserWallet() {
        const store = this.props.store

        store.set('walletLoading', true)

        let web3Provider;

        // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
        // Modern dApp browsers...
        if (window.ethereum) {
            web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dApp browsers...
        else if (window.web3) {
            web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            this.log("Please install MetaMask!");
        }

        const web3 = new Web3(web3Provider);
        const walletType = 'browser'
        const accounts = await web3.eth.getAccounts()

        await window.ethereum.enable();

        store.set('walletLoading', false)
        store.set('walletAddress', accounts[0])
        store.set('web3', web3)
        store.set('walletType', walletType)
    }

    render() {
        const {
            classes,
            store
        } = this.props

        const walletAddress = store.get('walletAddress')
        const daiBalance = store.get('daiBalance')
        const daiSupply = store.get('daiSupply')
        const dachAllowance = store.get('dachAllowance')
        const isSignedIn = walletAddress && walletAddress.length

        console.log(this.props, this.state, this.props.store.getState())

        return <Grid item xs={12}>
            {<Grid className={classes.container} container alignItems='center'>
                <Typography variant='h6'>Welcome to Stablecoin.services</Typography>
                <Typography variant='subtitle1'>The new version of the Dai contract allows for transfers via signatures, allowing you to send Dai without holding any eth.</Typography>

                <Grid className={classes.actionsContainer} spacing={4} container>

                    <Grid item sm={12} md={6} className={classes.account}>
                        <div className={classes.panel}>
                            <Typography variant='h6'>Your Account</Typography>
                            <Typography variant='subtitle1'>{walletAddress || '–'}</Typography>
                            <br />
                            <Grid container>
                                <Grid item xs={12} className={classes.accountItem}>
                                    <Typography variant='subtitle2'>DAI Balance</Typography>
                                    <Typography variant='subtitle2'>{daiBalance ? (daiBalance + ' DAI')  : '–'}</Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.accountItem}>
                                    <Typography variant='subtitle2'>Total DAI Supply</Typography>
                                    <Typography variant='subtitle2'>{daiSupply ? (daiSupply + ' DAI')  : '–'}</Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.accountItem}>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            <Typography variant='subtitle2'>DACH Allowance</Typography>
                                            <Typography variant='subtitle2'>{dachAllowance ? (dachAllowance + ' DAI')  : '–'}</Typography>
                                        </Grid>
                                        {isSignedIn && <Grid item md={4} className={classes.permitButton}>
                                            <Button
                                                color='primary'
                                                size={'small'}
                                                onClick={() => {}}
                                                variant="contained">
                                             Authorize
                                            </Button>
                                        </Grid>}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <div className={classes.permit}>
                                <Typography variant='subtitle2'>Permit Address</Typography>
                                <TextField
                                    placeholder='0x'
                                    className={classes.input}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={() => { }}
                                />
                            </div>
                            <Button
                                color='primary'
                                disabled={!isSignedIn || !dachAllowance}
                                onClick={() => {}}
                                variant="contained"
                                className={classes.permitButton}>
                              Permit
                            </Button>
                        </div>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <div className={classes.panel}>
                            <Typography variant='h6'>Issue cheque</Typography>
                            <br/>
                            <div>
                                <Typography variant='subtitle2'>To</Typography>
                                <TextField
                                    placeholder='0x'
                                    className={classes.input}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={() => { }}
                                />
                            </div>
                            <div>
                                <Typography variant='subtitle2'>Token Amount</Typography>
                                <TextField
                                    placeholder='4700'
                                    className={classes.input}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={() => { }}
                                    InputProps={{
                                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">DAI</InputAdornment>
                                    }}
                                    inputProps={{ 'aria-label': 'bare' }}
                                />
                            </div>
                            <div>
                                <Typography variant='subtitle2'>Clearing Fee</Typography>
                                <TextField
                                    placeholder='1'
                                    className={classes.input}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={() => { }}
                                    InputProps={{
                                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">DAI</InputAdornment>
                                    }}
                                    inputProps={{ 'aria-label': 'bare' }}
                                />
                            </div>
                            <Button
                                color='primary'
                                onClick={() => {}}
                                variant="contained"
                                disabled={!isSignedIn || !dachAllowance}
                                className={classes.permitButton}>
                             Transfer
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>}
        </Grid>
    }
}

export default withStyles(styles)(withStore(IssueCheckContainer))
