import React from 'react';
import Web3 from 'web3';
import AddressValidator from 'wallet-address-validator';
import * as Uniswap from '@uniswap/sdk';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { signDachTransferPermit, getDaiData, getFeeData } from '../utils/web3Utils'
import { transfer, swap } from '../actions/main'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
    actionsContainer: {
        // marginTop: theme.spacing(3)
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
        border: '1px solid #eee',
        borderRadius: theme.spacing(1),
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
        margin: '0px auto'
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
})

class IssueCheckContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        // update data periodically
        this.watchDaiData()

        // for debugging
        window.resetDachPermit = () => {
            signDachTransferPermit.bind(this)(false)
        }

        console.log('uniswap', Uniswap)
    }

    async watchDaiData() {
        await getDaiData.bind(this)();
        await getFeeData.bind(this)();
        setInterval(() => {
            getDaiData.bind(this)();
            getFeeData.bind(this)();
        }, 10 * 1000);
    }

    transfer() {
        transfer.bind(this)()
    }

    swap() {
        swap.bind(this)()
    }

    async swapAmountChanged(amount) {
        const { store } =  this.props
        const web3 = store.get('web3')

        store.set('swap.daiAmount', amount)

        const reserves = await Uniswap.getTokenReserves('0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', 1)
        console.log('reserves', reserves)

        const details = await Uniswap.getMarketDetails(reserves)
        console.log('details', details)

        const trade = await Uniswap.getTradeDetails(false, amount, details)
        console.log('trade', trade)

        const input = trade.inputAmount.amount.toString() / 10000
        const output = trade.outputAmount.amount.toString()
        console.log('trade output', input, output)
    }

    render() {
        const {classes, store} = this.props

        const walletAddress = store.get('walletAddress')
        const daiBalance = store.get('daiBalance')
        // const daiBalance = '1000'
        const daiSupply = store.get('daiSupply')
        const dachApproved = store.get('dachApproved')
        const dachAllowance = store.get('dachAllowance');
        const chequeToValid = store.get('cheque.toValid');
        const chequeAmount = store.get('cheque.daiAmount')
        const chequeFee = store.get('cheque.fee')
        const swapAmount = store.get('swap.daiAmount');
        const swapFee = store.get('swap.fee')
        const isSignedIn = walletAddress && walletAddress.length

        const canTransfer = chequeToValid && (Number(chequeAmount) + Number(chequeFee) <= Number(daiBalance))
        const canSwap = swapAmount && (Number(swapAmount) + Number(swapFee) <= Number(daiBalance))

        // console.log('issue check render', this.props.store.getState())

        return <Grid item="item" xs={12}>
            {
                <Grid className={classes.container} container="container" alignItems='center'>
                        {/*<Typography variant='h6'>Welcome to Stablecoin.services<br /><Typography variant='subtitle1'>Transfer or swap DAI without holding any ETH</Typography></Typography>*/}
                        {/*<Typography variant='subtitle1'>The new version of the Dai contract allows for transfers via signatures, allowing you to send Dai without holding any eth.</Typography>*/}

                        <Grid className={classes.actionsContainer} spacing={4} container="container">


                            <Grid item="item" xs={12} sm={12} md={6}>
                                <div className={classes.panel}>
                                    <Typography variant='h6'>Send DAI</Typography>
                                    <br/>
                                    <div>
                                        <Typography variant='subtitle2'>Send to Address</Typography>
                                        <TextField placeholder='Enter address' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                store.set('cheque.to', event.target.value)
                                                store.set('cheque.toValid', AddressValidator.validate(event.target.value, 'ETH'))
                                            }}/>
                                    </div>
                                    <div>
                                        <Typography variant='subtitle2'>DAI Amount <span className={classes.transferDaiBalance}>{daiBalance ? `Balance: ${daiBalance} DAI` : '-'}</span></Typography>
                                        <TextField placeholder='0' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                store.set('cheque.amount', event.target.value)
                                            }} InputProps={{
                                                endAdornment: <InputAdornment className={classes.endAdornment} position="end">DAI</InputAdornment>
                                            }} inputProps={{
                                                'aria-label' : 'bare'
                                            }}/>
                                    </div>
                                    {/*<div>
                                        <Typography variant='subtitle2'>Clearing Fee</Typography>
                                        <TextField placeholder='1' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                store.set(event.target.value, 'cheque.fee')
                                            }} InputProps={{
                                                endAdornment: <InputAdornment className={classes.endAdornment} position="end">DAI</InputAdornment>
                                            }} inputProps={{
                                                'aria-label' : 'bare'
                                            }}/>
                                    </div>*/}
                                    <div>
                                        <Chip
                                            label={<div className={classes.breakdownWrapper}>
                                                    <Typography variant='caption'>Transfer Fee</Typography>
                                                    <Typography className={classes.transferFee} variant='caption'>{chequeFee ? `${chequeFee} DAI` : '-'}</Typography>
                                            </div>}
                                            className={classes.transferBreakdown}
                                          />
                                    </div>
                                    <div className={classes.actionButtonContainer}>
                                        <Button color='primary'
                                            size='large'
                                            disabled={!canSwap}
                                            onClick={() => {
                                                // signCheque.bind(this)()
                                                this.transfer()
                                            }} variant="contained" disabled={!isSignedIn || !canTransfer} className={classes.actionButton}>
                                            Transfer
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item="item" xs={12} sm={12} md={6}>
                                <div className={classes.panel}>
                                    <Typography variant='h6'>Swap DAI for ETH</Typography>
                                    <br/>
                                    <div>
                                        <Typography variant='subtitle2'>DAI Amount <span className={classes.swapDaiBalance}>{daiBalance ? `Balance: ${daiBalance} DAI` : '-'}</span></Typography>
                                        <TextField placeholder='Enter amount' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                                                this.swapAmountChanged(event.target.value)
                                            }} InputProps={{
                                                endAdornment: <InputAdornment className={classes.endAdornment} position="end">DAI</InputAdornment>
                                            }} inputProps={{
                                                'aria-label' : 'bare'
                                            }}/>
                                    </div>
                                    <div>
                                        <Typography variant='subtitle2'>ETH Amount</Typography>
                                        <TextField placeholder='Enter amount'
                                            className={classes.input}
                                            margin="normal"
                                            disabled={true}
                                            variant="outlined"
                                            value={'0'}
                                            onChange={(event) => {
                                                store.set('swap.ethAmount', event.target.value)
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
                                                    <Typography className={classes.exchangeRate} variant='caption'>-</Typography>
                                                </div>
                                                <div className={classes.breakdownWrapper}>
                                                    <Typography variant='caption'>Swap Fee</Typography>
                                                    <Typography className={classes.swapFee} variant='caption'>{swapFee ? `${swapFee} DAI` : '-'}</Typography>
                                                </div>
                                            </div>}
                                            className={classes.uniswapBreakdown}
                                          />
                                    </div>

                                    <div className={classes.actionButtonContainer}>
                                        <Button color='primary'
                                            size='large'
                                            onClick={() => {
                                                // signCheque.bind(this)()
                                                this.swap()
                                            }} variant="contained" disabled={!isSignedIn || !canSwap} className={classes.actionButton}>
                                            Swap
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
            }
        </Grid>
    }
}

export default withStyles(styles)(withStore(IssueCheckContainer))
