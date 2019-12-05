import Web3 from "web3";
import daiABI from '../utils/daiABI.json';
import chaiABI from '../utils/chaiABI.json';
import dachABI from '../utils/dachABI.json';
import config from '../config.json';
import { daiChequeFee, daiPermitAndChequeFee, swapFee, daiPermitAndSwapFee } from '../utils/apiUtils';

const daiAddress = config.DAI;
const chaiAddress = config.CHAI;
const dachAddress = config.DACH;
const relayer = config.RELAYER;

export const getDaiData = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    if (!web3 || !walletAddress) return

    const dai = new web3.eth.Contract(daiABI, daiAddress);
    const dach = new web3.eth.Contract(dachABI, dachAddress);
    const daiBalanceRaw = await dai.methods.balanceOf(walletAddress).call();
    const daiBalance = parseFloat(web3.utils.fromWei(daiBalanceRaw)).toFixed(2);
    const daiNonce = await dai.methods.nonces(walletAddress).call();

    const dachAllowance = await dai.methods.allowance(walletAddress, dachAddress).call();
    const dachNonce = await dach.methods.nonces(walletAddress).call();
    const dachApproved = Number(dachAllowance) > 0

    // store.set('daiObject', dai)
    store.set('daiBalance', daiBalance)
    store.set('daiNonce', daiNonce)

    store.set('dach.daiApproved', dachApproved)
    store.set('dach.daiAllowance', dachAllowance)
    store.set('dach.daiNonce', dachNonce)
}

export const getChaiData = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    if (!web3 || !walletAddress) return

    const chai = new web3.eth.Contract(chaiABI, chaiAddress);
    const dach = new web3.eth.Contract(dachABI, dachAddress);
    const chaiBalanceRaw = await chai.methods.balanceOf(walletAddress).call();
    const chaiBalance = parseFloat(web3.utils.fromWei(chaiBalanceRaw)).toFixed(2);
    const chaiNonce = await chai.methods.nonces(walletAddress).call();

    const dachAllowance = await chai.methods.allowance(walletAddress, dachAddress).call();
    const dachNonce = await dach.methods.nonces(walletAddress).call();
    const dachApproved = Number(dachAllowance) > 0

    // store.set('daiObject', chai)
    store.set('chaiBalance', chaiBalance)
    store.set('chaiNonce', chaiNonce)

    store.set('dach.chaiApproved', dachApproved)
    store.set('dach.chaiAllowance', dachAllowance)
    store.set('dach.chaiNonce', dachNonce)
}

export const getFeeData = async function() {
    const { store } = this.props
    const permitted = store.get('dachApproved')
    const daichequeFeeData = permitted ? await daiChequeFee() : await daiPermitAndChequeFee()
    const swapFeeData =  permitted ? await swapFee() : await daiPermitAndSwapFee()

    if (daichequeFeeData.message) {
        const fee = Web3.utils.fromWei(String(daichequeFeeData.message))
        store.set('daicheque.fee', fee)
    }

    if (swapFeeData.message) {
        const fee = Web3.utils.fromWei(String(swapFeeData.message))
        store.set('swap.fee', fee)
    }
}

export const signData = async function(web3, fromAddress, data) {
    return new Promise(function(resolve, reject) {
        web3.currentProvider.sendAsync({
                method: "eth_signTypedData_v3",
                params: [fromAddress, data],
                from: fromAddress
            },
            function(err, result) {
                if (err) {
                  reject(err) //TODO
                } else {
                    const r = result.result.slice(0,66)
                    const s = '0x' + result.result.slice(66,130)
                    const v = Number('0x' + result.result.slice(130,132))
                    resolve({
                        v,
                        r,
                        s
                    })
                }
            }
        );
    });
}

export const signDachTransferPermit = async function(allowed) {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const daiNonce = store.get('daiNonce')

    const message = {
        holder: walletAddress,
        spender: dachAddress,
        nonce: daiNonce,
        expiry: 0,
        allowed: allowed
    }

    const typedData = JSON.stringify({
        types: {
            EIP712Domain: [{
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'version',
                    type: 'string'
                },
                {
                    name: 'chainId',
                    type: 'uint256'
                },
                {
                    name: 'verifyingContract',
                    type: 'address'
                },
            ],
            Permit: [{
                    name: 'holder',
                    type: 'address'
                },
                {
                    name: 'spender',
                    type: 'address'
                },
                {
                    name: 'nonce',
                    type: 'uint256'
                },
                {
                    name: 'expiry',
                    type: 'uint256'
                },
                {
                    name: 'allowed',
                    type: 'bool'
                },
            ],
        },
        primaryType: 'Permit',
        domain: {
            name: 'Dai Stablecoin',
            version: '1',
            chainId: Number(web3.currentProvider.networkVersion),
            verifyingContract: daiAddress,
        },
        message: message
    });

    const sig = await signData(web3, walletAddress, typedData)
    return Object.assign({}, sig, message)

    // const permit = await dai.methods.permit(
    //     walletAddress,
    //     dachAddress,
    //     daiNonce,
    //     0,
    //     allowed,
    //     v,
    //     r,
    //     s
    // ).send({
    //     from: walletAddress
    // })

    // console.log('permit dach', result, permit)
}

export const signSwap = async function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const nonce = store.get('dachNonce')

    const amount = store.get('swap.amount')
    const fee = store.get('swap.fee')
    const minEth = store.get('swap.minEth')

    const walletAddress = store.get('walletAddress')

    const typedData = JSON.stringify({
        types: {
            EIP712Domain: [{
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'version',
                    type: 'string'
                },
                {
                    name: 'chainId',
                    type: 'uint256'
                },
                {
                    name: 'verifyingContract',
                    type: 'address'
                },
            ],
            DaiCheque: [{
                    name: 'sender',
                    type: 'address'
                },
                {
                    name: 'amount',
                    type: 'uint256'
                },
                {
                    name: 'min_eth',
                    type: 'uint256'
                },
                {
                    name: 'fee',
                    type: 'uint256'
                },
                {
                    name: 'nonce',
                    type: 'uint256'
                },
                {
                    name: 'expiry',
                    type: 'uint256'
                },
                {
                    name: 'relayer',
                    type: 'address'
                }

            ],
        },
        primaryType: 'DaiCheque',
        domain: {
            name: 'Dai Automated Clearing House',
            version: '1',
            chainId: Number(web3.currentProvider.networkVersion),
            verifyingContract: dachAddress,
        },
        message: {
            sender: walletAddress,
            amount: amount,
            min_eth: minEth,
            fee: fee,
            nonce: nonce,
            expiry: 0,
            relayer: relayer
        },
    });

    return await signData(web3, walletAddress, typedData)
}

export const signDaiCheque = async function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const nonce = store.get('dachNonce')
    const to = store.get('daicheque.to')
    const amount = Web3.utils.toWei(store.get('daicheque.amount'))
    const fee = Web3.utils.toWei(store.get('daicheque.fee'))
    const expiry = store.get('daicheque.expiry') || 0;
    const walletAddress = store.get('walletAddress')

    const message = {
        sender: walletAddress,
        receiver: to,
        amount: amount,
        fee: fee,
        nonce: nonce,
        expiry: expiry,
        relayer: relayer
    }

    console.log('message', message)

    const typedData = JSON.stringify({
        types: {
            EIP712Domain: [{
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'version',
                    type: 'string'
                },
                {
                    name: 'chainId',
                    type: 'uint256'
                },
                {
                    name: 'verifyingContract',
                    type: 'address'
                },
            ],
            DaiCheque: [{
                    name: 'sender',
                    type: 'address'
                },
                {
                    name: 'receiver',
                    type: 'address'
                },
                {
                    name: 'amount',
                    type: 'uint256'
                },
                {
                    name: 'fee',
                    type: 'uint256'
                },
                {
                    name: 'nonce',
                    type: 'uint256'
                },
                {
                    name: 'expiry',
                    type: 'uint256'
                },
                {
                    name: 'relayer',
                    type: 'address'
                },
            ],
        },
        primaryType: 'DaiCheque',
        domain: {
            name: 'Dai Automated Clearing House',
            version: '1',
            chainId: Number(web3.currentProvider.networkVersion),
            verifyingContract: dachAddress,
        },
        message: message,
    });

    const sig = await signData(web3, walletAddress, typedData)

    return Object.assign({}, sig, message)
}

export const initBrowserWallet = async function() {
    const store = this.props.store

    store.set('walletLoading', true)

    let web3Provider;

    // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
    // Modern dApp browsers...
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            // Request account access
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }

        window.ethereum.on('accountsChanged', (accounts) => {
            initBrowserWallet.bind(this)()
        })
    }
    // Legacy dApp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, display err
    else {
        this.log("Please install MetaMask!");
    }

    const web3 = new Web3(web3Provider);
    const walletType = 'browser'
    const accounts = await web3.eth.getAccounts()

    // await window.ethereum.enable();
    store.set('walletLoading', false)
    store.set('walletAddress', accounts[0])
    store.set('web3', web3)
    store.set('walletType', walletType)

    getDaiData.bind(this)()
}

export default {
    initBrowserWallet,
    signDaiCheque
}
