import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'
import classNames from 'classnames'
import {
  useWeb3React
} from "@web3-react/core";
import {
  initBrowserWallet,
  initInjected,
  initPortis,
  initWalletConnect
} from '../utils/web3Utils'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import Metamask from '../assets/metamask.png'
import Portis from '../assets/portis.png'
import WalletConnect from '../assets/walletConnect.svg'


const styles = () => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none'
    },
    modalContent: {
      backgroundColor: '#fff',
      width: 360,
      maxWidth: '100%',
      padding: theme.spacing(2),
      borderRadius: 4,
      outline: 'none'
    },
    signInInput: {
      width: '100%'
    },
    message: {
      textAlign: 'center',
      width: '100%',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    walletList: {
      width: '100%'
    },
    walletItem: {
      width: '100%',
      borderRadius: 4,
      padding: theme.spacing(2),
      '& img': {
        width: 36,
        height: 'auto',
        marginRight: theme.spacing(2)
      },
      '& div': {
        display: 'flex',
        alignItems: 'center'
      }
    }
})

class SignInContainer extends React.Component {

    constructor(props) {
        super(props);
        console.log(this)
    }

    injected(){
        const { store } = this.props
        store.set('showSignIn', false)
        initBrowserWallet.bind(this)()
        // initInjected.bind(this)()
    }

    portis() {
        const { store } = this.props
        store.set('showSignIn', false)
        initPortis.bind(this)()
    }

    walletConnect() {
        const { store } = this.props
        store.set('showSignIn', false)
        initWalletConnect.bind(this)()
    }

    render() {
        const {
            classes,
            store
        } = this.props

        const showSignIn = store.get('showSignIn')
        const signInMessage = store.get('signInMessage')

        // console.log(this.props, this.state)

        return <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={showSignIn}
          onClose={() => {
            store.set('showSignIn', false)
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showSignIn}>
            <Grid container className={classes.modalContent}>
                <div className={classes.message}>
                    {signInMessage ? <Typography variant='body1'>{signInMessage}</Typography> : <Typography variant='body1'>Connect a wallet to continue</Typography>}
                </div>
                <MenuList className={classes.walletList}>
                    <MenuItem className={classes.walletItem} onClick={this.injected.bind(this)}><div><img src={Metamask} /><span>Metamask</span></div></MenuItem>
                    <MenuItem className={classes.walletItem} onClick={this.walletConnect.bind(this)}><div><img src={WalletConnect} /><span>WalletConnect</span></div></MenuItem>
                    <MenuItem className={classes.walletItem} onClick={this.portis.bind(this)}><div><img src={Portis} /><span>Portis</span></div></MenuItem>
                </MenuList>
            </Grid>
          </Fade>
        </Modal>
    }
}

// const SignInContainerWithStore =

// function SignInContainerComponent(props) {
//     const { store } = props
//     const context = useWeb3React();
//     // console.log('context', context, props, this)
//     return <SignInContainerWithStore
//         connectInjected={() => {
//             store.set('showSignIn', false)
//             context.activate(injectedConnector)
//             // initBrowserWallet.bind({ props })()
//         }}
//         connectPortis={() => {
//             // initPortis.bind({ props })()
//             store.set('showSignIn', false)
//             // context.activate(portisConnector)
//             initPortis.bind({ props })()
//         }}
//         connectWalletConnect={() => {
//             store.set('showSignIn', false)
//             context.activate(walletConnectConnector)
//         }}/>
// }

export default withStore(withStyles(styles)(SignInContainer))
