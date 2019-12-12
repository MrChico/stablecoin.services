import React from 'react';
import Web3 from 'web3';
import { withStore, store } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'
import classNames from 'classnames'
import {
  Web3ReactProvider,
  useWeb3React
} from "@web3-react/core";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';


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

class Web3StoreUpdater extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        // console.log('web3Context should update', nextProps, store.getState())
        const newContext = nextProps.web3Context
        const currentContext = store.get('web3Context')

        if (!currentContext) {
            this.updateStore(newContext)
            return true
        } else if (newContext) {
          const current = {
              account: currentContext.account,
              active: currentContext.active,
              chainId: currentContext.chainId,
              connector: newContext.connector
          }

          const newer = {
              account: newContext.account,
              active: newContext.active,
              chainId: newContext.chainId,
              connector: newContext.connector
          }

          // console.log('web3Context should update', current, newer)

          const diff = current.account !== newer.account
            || current.active !== newer.active
            || current.chainId !== newer.chainId
            // || current.connector !== newer.connector

          if (diff) {
              this.updateStore(newContext)
              return true
          }
          return false
        }
        return false
    }

    updateStore(context){
        store.set('web3Context', context)
        if (context.library) {
            store.set('walletAddress', context.account)
            store.set('web3', new Web3(context.library.provider))
        }
    }

    render() {
        return <div />
    }
}

const Web3StoreUpdaterWithStore = withStyles(styles)(withStore(Web3StoreUpdater))

function Web3StoreUpdaterComponent(props) {
    const context = useWeb3React();
    return <Web3StoreUpdaterWithStore web3Context={context} />
}

export default Web3StoreUpdaterComponent
