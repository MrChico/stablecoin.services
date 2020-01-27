import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Bell from '../assets/bell_resized.png'

const styles = () => ({
    navContainer: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        minHeight: 52
    },

    logo: {
        height: 22,
        width: 25,
        marginRight: theme.spacing(1)
    },
    headerText: {
        fontSize: 18
    },
    accountButton: {
      minWidth: 140,
      [theme.breakpoints.down('xs')]: {
        width: '100%'
      },
      '& svg': {
        marginRight: theme.spacing(1)
      }
    },
    spinner: {
      color: 'inherit'
    },
    buttonContainer: {
      justifyContent: 'flex-end',
      [theme.breakpoints.down('xs')]: {
          justifyContent: 'flex-start',
          paddingTop: theme.spacing(3)
      }
    }
})

class NavContainer extends React.Component {
    async componentDidMount() {
        console.log(this)
    }

    render() {
        const {
            classes,
            store
        } = this.props

        const walletAddress = store.get('walletAddress')
        const balancesLoading = store.get('balancesLoading')
        const walletConnecting = store.get('walletConnecting')

        return <Grid item xs={12}>
            {<Grid className={classes.navContainer} container alignItems='center'>
              <Grid item xs={12} sm={6}>
                  <Grid container alignItems='center'>
                        <img className={classes.logo} src={Bell} />
                        <Typography className={classes.headerText} variant='body'>Stablecoin.services{/*<br /><Typography variant='subtitle1'>Transfer or swap DAI without holding&nbsp;ETH</Typography>*/}</Typography>
                  </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Grid container className={classes.buttonContainer}>
                  {walletConnecting ? <Button color='primary' size='large' disabled className={classes.accountButton} variant='contained'>Connecting...</Button> : <Button color='primary' size='large' onClick={() => {
                        store.set('signInMessage', '')
                        store.set('showSignIn', true)
                    }} variant={walletAddress ? 'text' : "contained"} className={classes.accountButton}>
                    {walletAddress ? (walletAddress.slice(0,7) + '...' + walletAddress.slice(walletAddress.length - 5)) : 'Connect wallet'}
                  </Button>}
                  </Grid>
              </Grid>
            </Grid>}
        </Grid>
    }
}

export default withStyles(styles)(withStore(NavContainer))
