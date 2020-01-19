import React from 'react';
import { createStore } from '@spyna/react-store'

import NavContainer from './containers/NavContainer'
import IssueCheckContainer from './containers/IssueCheckContainer'
import SignInContainer from './containers/SignInContainer'
import Web3StoreUpdater from './containers/Web3StoreUpdater'

import theme from './theme/theme'

import { withStyles, ThemeProvider } from '@material-ui/styles';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import {
  Web3ReactProvider,
  useWeb3React
} from "@web3-react/core";

import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}


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
      // boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.05)',
      borderRadius: theme.shape.borderRadius,
      padding: 0,
      marginBottom: theme.spacing(3)
  }
})

const initialState = {
    web3: null,
    web3Context: null,
    walletAddress: '',
    walletConnecting: false,
    balancesLoading: false,
    walletType: '',
    showSignIn: false,
    selectedActionTab: 0,
    // wallet balances and nonces
    daiBalance: '',
    chaiBalance: '',
    daiNonce: '',
    chaiNonce: '',
    // dach
    'dach.daiApproved': false,
    'dach.daiAllowance': '',
    'dach.nonce': '',
    'dach.daiSwapApproved': false,
    'dach.chaiApproved': false,
    'dach.chaiAllowance': '',
    'dach.chaiSwapApproved': false,
    // transfer
    'cheque.to': '',
    'cheque.toValid': false,
    'cheque.amount': '',
    'cheque.fee': '',
    'cheque.expiry': 0,
    'cheque.selectedCurrency': 'dai',
    'cheque.result': null,
    'cheque.requesting': false,
    'cheque.networkRequesting': false,
    // swap
    'swap.inputAmount': '',
    'swap.outputAmount': '',
    'swap.exchangeRate': '',
    'swap.fee': '',
    'swap.selectedCurrency': 'dai',
    'swap.result': null,
    'swap.requesting': false,
    'swap.networkRequesting': false,
    // convert
    'convert.amount': '',
    'convert.fee': '',
    'convert.selectedCurrency': 'dai',
    'convert.result': null,
    'convert.requesting': false,
    'convert.networkRequesting': false
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

        return (
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3StoreUpdater web3Context={this.props.web3Context} />
                <ThemeProvider theme={theme}>
                    <SignInContainer />
                    <NavContainer />
                    <Container maxWidth="md">
                        <Grid container>
                            <Grid item xs={12}><br/></Grid>
                            <Grid item xs={12} className={classes.contentContainer}>
                                <IssueCheckContainer />
                            </Grid>
                        </Grid>
                    </Container>
                </ThemeProvider>
            </Web3ReactProvider>
        );
    }
}

const AppComponent = createStore(withStyles(styles)(App), initialState)

function AppWrapper() {
    const context = useWeb3React();
    return <AppComponent web3Context={context} />
}

export default withStyles(styles)(AppWrapper)
