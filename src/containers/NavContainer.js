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


const styles = () => ({
    navContainer: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
    logo: {
        height: 22,
        width: 25,
        marginRight: theme.spacing(1)
    },
    accountButton: {
      '& svg': {
        marginRight: theme.spacing(1)
      }
    }
})

class NavContainer extends React.Component {

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
        const isSignedIn = walletAddress && walletAddress.length

        console.log(this.props, this.state, this.props.store.getState())

        return <Grid item xs={12}>
            {<Grid className={classes.navContainer} container alignItems='center'>
              <Grid item xs={6}>
                  <Grid container alignItems='center'>
                      <Typography variant='h6'>Stablecoin.services</Typography>
                  </Grid>
              </Grid>
              <Grid item xs={6}>
                  <Grid container justify='flex-end'>
                  <Button color='primary' onClick={this.initBrowserWallet.bind(this)} variant="outlined" className={classes.accountButton}>
                    {walletAddress ? (walletAddress.slice(0,7) + '...' + walletAddress.slice(walletAddress.length - 5)) : 'Connect wallet'}
                  </Button>
                  </Grid>
              </Grid>
            </Grid>}
        </Grid>
    }
}

export default withStyles(styles)(withStore(NavContainer))
