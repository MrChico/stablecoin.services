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


const styles = () => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      width: 360,
      maxWidth: '100%',
      padding: theme.spacing(2)
    },
    signInInput: {
      width: '100%'
    },
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
                <MenuList>
                    <MenuItem><div onClick={this.injected.bind(this)}>Metamask</div></MenuItem>
                    <MenuItem><div onClick={this.walletConnect.bind(this)}>Wallet Connect</div></MenuItem>
                    <MenuItem><div onClick={this.portis.bind(this)}>Portis</div></MenuItem>
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
