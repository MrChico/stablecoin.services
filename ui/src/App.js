import React from 'react';
import { createStore } from '@spyna/react-store'

import NavContainer from './containers/NavContainer'
import IssueCheckContainer from './containers/IssueCheckContainer'

import theme from './theme/theme'

import { withStyles, ThemeProvider } from '@material-ui/styles';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'


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
    walletAddress: '',
    walletConnecting: false,
    walletType: '',
    daiBalance: '',
    dachApproved: false,
    dachAllowance: '',
    dachNonce: '',
    dachSwapApproved: false,
    // transfer
    'cheque.to': '',
    'cheque.toValid': false,
    'cheque.daiAmount': '',
    'cheque.fee': '',
    // swap
    'swap.daiAmount': ''
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
                            <IssueCheckContainer />
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        );
    }
}

export default createStore(withStyles(styles)(App), initialState)
