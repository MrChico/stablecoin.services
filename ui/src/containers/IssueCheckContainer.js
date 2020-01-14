import React from 'react';
import AddressValidator from 'wallet-address-validator';
// import * as Uniswap from '@uniswap/sdk';

import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import { amber, blue, green } from '@material-ui/core/colors';
import theme from '../theme/theme'
import { signDachTransferPermit, getDaiData, getChaiData, getFeeData } from '../utils/web3Utils'
import { getSwapOutput } from '../utils/uniswapUtils'
import { newDaiTransfer, newDaiSwap, newDaiConvert, newChaiTransfer, newChaiSwap, newChaiConvert } from '../actions/main'

import ButlerLoading from '../assets/walking_start_resized.gif'

import ButlerLoader from '../components/ButlerLoader'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import LoopIcon from '@material-ui/icons/Loop';
import SwapIcon from '@material-ui/icons/SwapHoriz';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAlt';

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
    actionsContainer: {
        // marginTop: theme.spacing(3)
    },
    contentContainer: {
        border: '1px solid #eee',
        borderRadius: theme.spacing(1),
        boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.05)'
    },
    accountButton: {
        '& svg': {
            marginRight: theme.spacing(1)
        }
    },
    input: {
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    account: {},
    panel: {
        padding: theme.spacing(3),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        // border: '1px solid #eee',
        // borderRadius: theme.spacing(1),
        minHeight: '100%'
    },
    accountItem: {
        marginBottom: theme.spacing(2)
    },
    permit: {
        marginTop: 14
    },
    actionButton: {
        marginTop: theme.spacing(2),
        margin: '0px auto',
        minHeight: 42,
        minWidth: 140
        // [theme.breakpoints.down('sm')]: {
        //     marginTop: theme.spacing(1)
        // },
        // [theme.breakpoints.up('md')]: {
        //     textAlign: 'right'
        // }
    },
    actionButtonContainer: {
        width: '100%',
        textAlign: 'center'
    },
    swapDaiBalance: {
        float: 'right'
    },
    transferDaiBalance: {
        float: 'right'
    },
    uniswapBreakdown: {
        width: '100%',
        height: 'auto',
        padding: theme.spacing(1),
        minHeight: 32,
        borderRadius: 4,
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(2),
        '& .MuiChip-label': {
            width: '100%',
            padding: 0
        },
        '& div': {
            width: '100%'
        }
    },
    transferBreakdown: {
        width: '100%',
        height: 'auto',
        padding: theme.spacing(1),
        minHeight: 32,
        borderRadius: 4,
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(2),
        '& .MuiChip-label': {
            width: '100%',
            padding: 0
        },
        '& div': {
            width: '100%'
        }
    },
    breakdownWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    tabs: {
      backgroundColor: '#fafafa',
      margin: '0px auto',
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      '& .MuiTab-labelIcon': {
        minHeight: 100
      },
      '& button': {
        borderBottom: '1px solid #eee'
      }
    },
    toggleHeader: {
      width: '100%',
      marginBottom: theme.spacing(3),
      '& button': {
        width: '50%'
      }
    },
    error: {
      marginTop: theme.spacing(4),
      // backgroundColor: theme.palette.error.dark
    },
    errorApi: {
      marginTop: theme.spacing(4),
      backgroundColor: amber[700],
    },
    success: {
      marginTop: theme.spacing(4),
      backgroundColor: blue[600],
      '& a': {
        color: '#fff'
      }
    },
    spinner: {
      color: 'inherit'
    }
})

class IssueCheckContainer extends React.Component {

    async componentDidMount() {
        // update data periodically
        this.watchDaiData()

        // for debugging
        window.resetDachPermit = () => {
            signDachTransferPermit.bind(this)(false)
        }
    }

    async watchDaiData() {
        await getDaiData.bind(this)();
        await getChaiData.bind(this)();
        await getFeeData.bind(this)();
        setInterval(() => {
            getDaiData.bind(this)();
            getChaiData.bind(this)();
            getFeeData.bind(this)();
            console.log(this.props.store.getState())
        }, 20 * 1000);
    }

    transfer() {
        const { store } = this.props
        const selectedCurrency = store.get('cheque.selectedCurrency')
        if (selectedCurrency === 'dai') {
            newDaiTransfer.bind(this)()
        } else {
            newChaiTransfer.bind(this)()
        }
    }

    swap() {
        const { store } = this.props
        const selectedCurrency = store.get('swap.selectedCurrency')
        if (selectedCurrency === 'dai') {
            newDaiSwap.bind(this)()
        } else {
            newChaiSwap.bind(this)()
        }

    }

    convert() {
        const { store } = this.props
        const selectedCurrency = store.get('convert.selectedCurrency')
        if (selectedCurrency === 'dai') {
            newDaiConvert.bind(this)()
        } else {
            newChaiConvert.bind(this)()
        }
    }

    switchActionTab(event, newValue) {
        const { store } = this.props
        store.set('selectedActionTab', newValue)
    }

    switchSendTab(event, newValue) {
        const { store } = this.props
        if (!newValue) return
        store.set('cheque.selectedCurrency', newValue)
        store.set('cheque.result', null)
        getFeeData.bind(this)();
        // store.set('cheque.requesting', false)
    }

    switchSwapTab(event, newValue) {
        const { store } = this.props
        if (!newValue) return
        store.set('swap.selectedCurrency', newValue)
        store.set('swap.result', null)
        getFeeData.bind(this)();
        this.swapAmountChanged.bind(this)(store.get('swap.inputAmount'))
    }

    switchConvertTab(event, newValue) {
        const { store } = this.props
        if (!newValue) return
        store.set('convert.selectedCurrency', newValue)
        store.set('convert.result', null)
        getFeeData.bind(this)();
        // store.set('convert.requesting', false)
    }



    async swapAmountChanged(amount) {
        const { store } =  this.props
        const web3 = store.get('web3')
        const selectedCurrency = store.get('swap.selectedCurrency')

        store.set('swap.inputAmount', amount)
        store.set('swap.result', null)

        // TO-DO: run logic on the same network as the app
        if (!web3) return

        const ethOutput = await getSwapOutput(web3, amount, selectedCurrency.toUpperCase(), 'ETH')
        store.set('swap.outputAmount', ethOutput.toFixed(8))

        if (ethOutput) {
            const exchangeRate = (Number(amount) / Number(ethOutput)).toFixed(8)
            store.set('swap.exchangeRate', exchangeRate)
        } else {
            store.set('swap.exchangeRate', '')
        }

        // console.log('swap.ethOutput', ethOutput)
    }

    render() {
        const {classes, store} = this.props

        const selectedActionTab = store.get('selectedActionTab')

        const walletAddress = store.get('walletAddress')
        const daiBalance = store.get('daiBalance')
        const chaiBalance = store.get('chaiBalance')

        const chequeToValid = store.get('cheque.toValid');
        const chequeAmount = store.get('cheque.amount')
        const chequeFee = store.get('cheque.fee')
        const chequeCurrency = store.get('cheque.selectedCurrency')
        const chequeCurrencyFormatted = chequeCurrency.toUpperCase()
        const chequeResult = store.get('cheque.result')
        const chequeRequesting = store.get('cheque.requesting');

        const swapInputAmount = store.get('swap.inputAmount');
        const swapOutputAmount = store.get('swap.outputAmount');
        const swapExchangeRate = store.get('swap.exchangeRate');
        const swapFee = store.get('swap.fee')
        const swapCurrency = store.get('swap.selectedCurrency')
        const swapCurrencyFormatted = swapCurrency.toUpperCase()
        const swapRequesting = store.get('swap.requesting');
        const swapResult = store.get('swap.result');

        const convertAmount = store.get('convert.amount')
        const convertCurrency = store.get('convert.selectedCurrency')
        const convertCurrencyFormatted = convertCurrency.toUpperCase()
        const convertRequesting = store.get('convert.requesting');
        const convertFee = store.get('convert.fee')
        const convertResult = store.get('convert.result')

        const walletLoading = store.get('walletLoading')
        const balancesLoaded = daiBalance.length && chaiBalance.length
        const isSignedIn = walletAddress && walletAddress.length && !walletLoading && balancesLoaded;
        const insufficientTransferBalance = (Number(chequeAmount) + Number(chequeFee)) > Number(chequeCurrency === 'dai' ? daiBalance : chaiBalance);
        const insufficientConvertBalance = (Number(convertAmount) + Number(convertFee)) > Number(convertCurrency === 'dai' ? daiBalance : chaiBalance);
        const insufficientSwapBalance = ((Number(swapInputAmount) + Number(swapFee)) > Number(swapCurrency === 'dai' ? daiBalance : chaiBalance))

        const showChequeSuccess = chequeResult && chequeResult.success === 'true'
        const showChequeError = chequeResult && chequeResult.success === 'false'
        const showChequeValidationError = !showChequeSuccess && chequeAmount && insufficientTransferBalance && isSignedIn

        const showSwapSuccess = swapResult && swapResult.success === 'true'
        const showSwapError = swapResult && swapResult.success === 'false'
        const showSwapValidationError = !showSwapSuccess && swapInputAmount && insufficientSwapBalance && isSignedIn

        const showConvertSuccess = convertResult && convertResult.success === 'true'
        const showConvertError = convertResult && convertResult.success === 'false'
        const showConvertValidationError = !showConvertSuccess && convertAmount && insufficientTransferBalance && isSignedIn

        const canDaiTransfer = chequeFee && chequeAmount && chequeToValid && !insufficientTransferBalance;
        const canSwap = swapFee && swapInputAmount && !insufficientSwapBalance
        const canConvert = convertFee && convertAmount && !insufficientConvertBalance;

        // console.log('issue check render', this.props.store.getState())

        return <Grid item xs={12}>
            {
                <Grid className={classes.container} container="container" alignItems='center'>
                        {/*<Typography variant='h6'>Welcome to Stablecoin.services<br /><Typography variant='subtitle1'>Transfer or swap DAI without holding any ETH</Typography></Typography>*/}
                        {/*<Typography variant='subtitle1'>The new version of the Dai contract allows for transfers via signatures, allowing you to send Dai without holding any eth.</Typography>*/}

                        <Grid className={classes.actionsContainer} container="container" justify='center'>
                            <Grid item xs={12} sm={12} md={7} className={classes.contentContainer}>
                                <Grid container justify='center'>
                                    <Grid item xs={12} className={classes.tabs}>
                                        <Tabs
                                          orientation="horizontal"
                                          variant="fullWidth"
                                          value={selectedActionTab}
                                          onChange={this.switchActionTab.bind(this)}
                                        >
                                          <Tab label="Send" icon={<ArrowRightIcon />} />
                                          <Tab label="Swap" icon={<SwapIcon />} />
                                          <Tab label="Convert" icon={<LoopIcon />} />
                                        </Tabs>
                                    </Grid>
                                    {selectedActionTab === 0 && <Grid item xs={12} sm={12} md={12}>
                                        <div className={classes.panel}>
                                            <ToggleButtonGroup className={classes.toggleHeader} size="large" value={chequeCurrency} exclusive onChange={this.switchSendTab.bind(this)}>
                                                <ToggleButton value={'dai'}>Send DAI</ToggleButton>
                                                <ToggleButton value={'chai'}>Send CHAI</ToggleButton>
                                            </ToggleButtonGroup>
                                            <div>
                                                <Typography variant='subtitle2'>Send to Address</Typography>
                                                <TextField placeholder='Enter address' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                        store.set('cheque.to', event.target.value)
                                                        store.set('cheque.toValid', AddressValidator.validate(event.target.value, 'ETH'))
                                                        store.set('cheque.result', null)
                                                        // store.set('cheque.requesting', false)
                                                    }}/>
                                            </div>
                                            <div>
                                                <Typography variant='subtitle2'>{chequeCurrencyFormatted} Amount <span className={classes.transferDaiBalance}>{isSignedIn ? `Balance: ${chequeCurrency === 'dai' ? daiBalance : chaiBalance} ${chequeCurrencyFormatted}` : '-'}</span></Typography>
                                                <TextField placeholder='0' className={classes.input} margin="normal" type='number' variant="outlined" onChange={(event) => {
                                                      store.set('cheque.amount', event.target.value)
                                                      store.set('cheque.result', null)
                                                      // store.set('cheque.requesting', false)
                                                    }} InputProps={{
                                                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">{chequeCurrencyFormatted}</InputAdornment>
                                                    }} inputProps={{
                                                        'aria-label' : 'bare'
                                                    }}/>
                                            </div>
                                            <div>
                                                <Chip
                                                    label={<div className={classes.breakdownWrapper}>
                                                            <Typography variant='caption'>Transfer Fee</Typography>
                                                            <Typography className={classes.transferFee} variant='caption'>{chequeFee ? `${chequeFee} ${chequeCurrencyFormatted}` : '-'}</Typography>
                                                    </div>}
                                                    className={classes.transferBreakdown}
                                                  />
                                            </div>
                                            <div className={classes.actionButtonContainer}>
                                                {chequeRequesting || showChequeSuccess ? <ButlerLoader success={showChequeSuccess} /> : <Button color='primary'
                                                    size='large'
                                                    disabled={!isSignedIn || !canDaiTransfer || showChequeError || showChequeValidationError || chequeRequesting}
                                                    onClick={this.transfer.bind(this)} variant="contained" className={classes.actionButton}>
                                                    Transfer
                                                </Button>}
                                            </div>

                                            {showChequeSuccess ? <SnackbarContent
                                              className={classes.success}
                                              message={<Grid item xs={12}>
                                                <span>Transfer started. <a href={`https://kovan.etherscan.io/tx/${chequeResult.message.chequeHash}`} target='_blank'>View transaction</a></span>
                                              </Grid>}
                                            /> : null}

                                            {showChequeError ? <SnackbarContent
                                              className={classes.errorApi}
                                              message={<Grid item xs={12}>
                                                <span>{chequeResult.message}</span>
                                              </Grid>}
                                            /> : null}

                                            {showChequeValidationError ? <SnackbarContent
                                              className={classes.error}
                                              message={<Grid item xs={12}>
                                                <span>Insufficient {chequeCurrencyFormatted} balance</span>
                                              </Grid>}
                                            /> : null}
                                        </div>
                                    </Grid>}

                                    {selectedActionTab === 1 && <Grid item xs={12} sm={12} md={12}>
                                        <div className={classes.panel}>
                                            <ToggleButtonGroup className={classes.toggleHeader} size="large" value={swapCurrency} exclusive onChange={this.switchSwapTab.bind(this)}>
                                                <ToggleButton value={'dai'}>DAI <ArrowRightIcon /> ETH</ToggleButton>
                                                <ToggleButton value={'chai'}>CHAI <ArrowRightIcon /> ETH</ToggleButton>
                                            </ToggleButtonGroup>
                                            <div>
                                                <Typography variant='subtitle2'>{swapCurrencyFormatted} Amount <span className={classes.swapDaiBalance}>{isSignedIn ? `Balance: ${swapCurrency === 'dai' ? daiBalance : chaiBalance} ${swapCurrencyFormatted}` : '-'}</span></Typography>
                                                <TextField placeholder='Enter amount' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                        this.swapAmountChanged(event.target.value)
                                                    }} InputProps={{
                                                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">{swapCurrencyFormatted}</InputAdornment>
                                                    }} inputProps={{
                                                        'aria-label' : 'bare'
                                                    }}/>
                                            </div>
                                            <div>
                                                <Typography variant='subtitle2'>ETH Amount</Typography>
                                                <TextField placeholder='0'
                                                    className={classes.input}
                                                    margin="normal"
                                                    disabled={true}
                                                    variant="outlined"
                                                    value={swapOutputAmount}
                                                    onChange={(event) => {
                                                        store.set('swap.outputAmount', event.target.value)
                                                    }} InputProps={{
                                                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">ETH</InputAdornment>
                                                    }} inputProps={{
                                                        'aria-label' : 'bare'
                                                    }}/>
                                            </div>

                                            <div>
                                                <Chip
                                                    label={<div>
                                                        <div className={classes.breakdownWrapper}>
                                                            <Typography variant='caption'>Exchange Rate</Typography>
                                                            <Typography className={classes.exchangeRate} variant='caption'>{swapExchangeRate ? `${swapExchangeRate} ${swapCurrencyFormatted}/ETH` : '-'}</Typography>
                                                        </div>
                                                        <div className={classes.breakdownWrapper}>
                                                            <Typography variant='caption'>Swap Fee</Typography>
                                                            <Typography className={classes.swapFee} variant='caption'>{swapFee ? `${swapFee} ${swapCurrencyFormatted}` : '-'}</Typography>
                                                        </div>
                                                    </div>}
                                                    className={classes.uniswapBreakdown}
                                                  />
                                            </div>

                                            <div className={classes.actionButtonContainer}>
                                                {swapRequesting || showSwapSuccess ? <ButlerLoader success={showSwapSuccess} /> : <Button color='primary'
                                                    size='large'
                                                    onClick={this.swap.bind(this)} variant="contained" disabled={!isSignedIn || !canSwap || showSwapError || showSwapValidationError || swapRequesting} className={classes.actionButton}>
                                                    Swap
                                                </Button>}
                                            </div>

                                            {showSwapSuccess ? <SnackbarContent
                                              className={classes.success}
                                              message={<Grid item xs={12}>
                                                <span>Swap started. <a href={`https://kovan.etherscan.io/tx/${swapResult.message.swapHash}`} target='_blank'>View transaction</a></span>
                                              </Grid>}
                                            /> : null}

                                            {showSwapError ? <SnackbarContent
                                              className={classes.errorApi}
                                              message={<Grid item xs={12}>
                                                <span>{swapResult.message}</span>
                                              </Grid>}
                                            /> : null}

                                            {showSwapValidationError ? <SnackbarContent
                                              className={classes.error}
                                              message={<Grid item xs={12}>
                                                <span>Insufficient {swapCurrencyFormatted} balance</span>
                                              </Grid>}
                                            /> : null}

                                        </div>
                                    </Grid>}

                                    {selectedActionTab === 2 && <Grid item xs={12} sm={12} md={12}>
                                        <div className={classes.panel}>
                                            <ToggleButtonGroup className={classes.toggleHeader} size="large" value={convertCurrency} exclusive onChange={this.switchConvertTab.bind(this)}>
                                                <ToggleButton value={'dai'}>DAI <ArrowRightIcon /> CHAI</ToggleButton>
                                                <ToggleButton value={'chai'}>CHAI <ArrowRightIcon /> DAI</ToggleButton>
                                            </ToggleButtonGroup>
                                            <div>
                                                <Typography variant='subtitle2'>{convertCurrencyFormatted} Amount <span className={classes.transferDaiBalance}>{isSignedIn ? `Balance: ${convertCurrency === 'dai' ? daiBalance : chaiBalance} ${convertCurrencyFormatted}` : '-'}</span></Typography>
                                                <TextField placeholder='0' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                        store.set('convert.amount', event.target.value)
                                                        store.set('convert.result', null)
                                                        // store.set('convert.requesting', false)
                                                    }} InputProps={{
                                                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">{convertCurrencyFormatted}</InputAdornment>
                                                    }} inputProps={{
                                                        'aria-label' : 'bare'
                                                    }}/>
                                            </div>
                                            <div>
                                                <Chip
                                                    label={<div className={classes.breakdownWrapper}>
                                                            <Typography variant='caption'>Convert Fee</Typography>
                                                            <Typography className={classes.transferFee} variant='caption'>{convertFee ? `${convertFee} ${convertCurrencyFormatted}` : '-'}</Typography>
                                                    </div>}
                                                    className={classes.transferBreakdown}
                                                  />
                                            </div>

                                            <div className={classes.actionButtonContainer}>
                                                {convertRequesting || showConvertSuccess ? <ButlerLoader success={showConvertSuccess} /> : <Button color='primary'
                                                    size='large'
                                                    onClick={this.convert.bind(this)} variant="contained" disabled={!isSignedIn || !canConvert || showConvertError || showConvertValidationError || convertRequesting} className={classes.actionButton}>
                                                    Convert
                                                </Button>}
                                            </div>

                                            {showConvertSuccess ? <SnackbarContent
                                              className={classes.success}
                                              message={<Grid item xs={12}>
                                                <span>Conversion started. <a href={`https://kovan.etherscan.io/tx/${convertResult.message.joinHash}`} target='_blank'>View transaction</a></span>
                                              </Grid>}
                                            /> : null}

                                            {showConvertError ? <SnackbarContent
                                              className={classes.errorApi}
                                              message={<Grid item xs={12}>
                                                <span>{convertResult.message}</span>
                                              </Grid>}
                                            /> : null}

                                            {showConvertValidationError ? <SnackbarContent
                                              className={classes.error}
                                              message={<Grid item xs={12}>
                                                <span>Insufficient {convertCurrencyFormatted} balance</span>
                                              </Grid>}
                                            /> : null}

                                        </div>
                                    </Grid>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
            }
        </Grid>
    }
}

// const IssueCheckContainerComponent = withStyles(styles)(withStore(IssueCheckContainer))
//
// function ContainerWrapper() {
//     const context = useWeb3React();
//     console.log(context)
//     return <IssueCheckContainerComponent />
// }

export default withStyles(styles)(withStore(IssueCheckContainer))
