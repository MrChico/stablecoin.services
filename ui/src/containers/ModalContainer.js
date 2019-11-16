import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'
import classNames from 'classnames'


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

class SignInContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.store.getState()
    }

    render() {
        const {
            classes,
            store
        } = this.props

        const localAddress = store.get('localAddress')
        const localPrivateKey = store.get('localPrivateKey')
        const showSignIn = store.get('showSignIn')

        const isSignedIn = localAddress && localPrivateKey

        console.log(this.props, this.state)

        return <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={showSignIn}
          onClose={() => {
            this.setState({
              showSignIn: false
            })
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showSignIn}>
            <Grid container className={classes.modalContent}>
              <TextField
                  placeholder='Username'
                  className={classes.signInInput}
                  margin="normal"
                  variant="outlined"
                  onChange={(event) => {
                      this.setState({
                          username: event.target.value
                      })
                  }}
              />
              <TextField
                  type='password'
                  placeholder='Password'
                  className={classes.signInInput}
                  margin="normal"
                  variant="outlined"
                  onChange={(event) => {
                      this.setState({
                          password: event.target.value
                      })
                  }}
              />
              <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  aria-label="add"
                  className={''}
                  onClick={() => {}}
                  >
                  Sign In
              </Button>
            </Grid>
          </Fade>
        </Modal>
    }
}

export default withStyles(styles)(withStore(SignInContainer))
