import React from 'react';
import { withStore } from '@spyna/react-store'
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

    componentDidMount() {
        const { store } = this.props
        setInterval(() => {
          store.set('web3Context', this.props.web3Context)
        }, 10)
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

export default withStore(Web3StoreUpdaterComponent)
