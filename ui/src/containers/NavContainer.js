import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Bell from '../assets/bell_resized.png'
import bellsound from '../assets/bellsound.m4a'

const styles = () => ({
    navContainer: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        minHeight: 52
    },

    logo: {
        height: 44,
        width: 50,
        marginRight: theme.spacing(2)
    },
    headerText: {
      fontSize: 24,
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

const audio = new Audio(bellsound)
class NavContainer extends React.Component {
    playBellSound() {
        audio.currentTime=0;
        this.setState({play : true})
        audio.play()
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
                  <img className={classes.logo} src={Bell} onClick={this.playBellSound.bind(this)}/>
                        <Typography className={classes.headerText} variant='body'>stablecoin.services</Typography>
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
