import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletConnect from "@walletconnect/browser";
import Portis from "@portis/web3";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { PortisConnector } from "@web3-react/portis-connector";

import daiABI from '../utils/daiABI.json';
import chaiABI from '../utils/chaiABI.json';
import dachABI from '../utils/dachABI.json';
import config from '../config.json';
import {
  gasPrice
} from '../utils/apiUtils';

const daiAddress = config.DAI;
const chaiAddress = config.CHAI;
const dachAddress = config.DACH;
const relayer = config.RELAYER;
const chain_id = config.CHAIN_ID;
const POLLING_INTERVAL = 8000;
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
  4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213",
  42: "https://kovan.infura.io/v3/84842078b09946638c03157f83405213"
};

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1]
})

export const walletConnectConnector = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const portisConnector = new PortisConnector({
  dAppId: "211b48db-e8cc-4b68-82ad-bf781727ea9e",
  networks: [chain_id]
});

// network data
export const getDaiData = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    // console.log('get dai data', store.getState())

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
    store.set('dach.nonce', dachNonce)
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
    store.set('dach.nonce', dachNonce)

    if (store.get('balancesLoading')) {
        store.set('balancesLoading', false)
    }
}

export const getFeeData = async function() {
    const { store } = this.props
    const daiPermitted = store.get('dach.daiApproved')
    const chaiPermitted = store.get('dach.chaiApproved')
    const chequeCurrency = store.get('cheque.currency')
    const swapCurrency = store.get('swap.currency')
    const convertCurrency = store.get('convert.currency')
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    if (!web3 || !walletAddress) return
    // gas price data from gasstationnetwork
    const gasPriceData = await gasPrice()
    const gasPriceInGwei = Math.floor(gasPriceData.fast / 10)
    // price of eth in dai from ESM (with 18 decimals)
    const rawEthUSDPrice = await web3.eth.getStorageAt('0x81fe72b5a8d1a857d176c3e7d5bd2679a9b85763', 4);
    const GweiUSDPrice = parseInt(rawEthUSDPrice.slice(34), 16) / 10 ** 9
    const fastDaiPrice = GweiUSDPrice * gasPriceInGwei
    const PERMIT_GAS = 100000;
    const CHEQUE_GAS = 100000;
    const SWAP_GAS = 200000;
    const JOIN_GAS = 300000;
    const EXIT_GAS = 300000;

    const daiChequeFee = web3.utils.fromWei(String(fastDaiPrice * (!daiPermitted ? CHEQUE_GAS + PERMIT_GAS : CHEQUE_GAS)))
    const chaiChequeFee = web3.utils.fromWei(String(fastDaiPrice * (!chaiPermitted ? CHEQUE_GAS + PERMIT_GAS : CHEQUE_GAS)))

    const daiSwapFee = web3.utils.fromWei(String(fastDaiPrice * (!daiPermitted ? SWAP_GAS + PERMIT_GAS : SWAP_GAS)))
    const chaiSwapFee = web3.utils.fromWei(String(fastDaiPrice * (!chaiPermitted ? SWAP_GAS + PERMIT_GAS : SWAP_GAS)))

    const daiConvertFee = web3.utils.fromWei(String(fastDaiPrice * (!daiPermitted ? JOIN_GAS + PERMIT_GAS : JOIN_GAS)))
    const chaiConvertFee = web3.utils.fromWei(String(fastDaiPrice * (!chaiPermitted ? EXIT_GAS + PERMIT_GAS : EXIT_GAS)))

    store.set('cheque.fee',  chequeCurrency === 'dai' ? daiChequeFee : chaiChequeFee)
    store.set('swap.fee',    swapCurrency === 'dai' ? daiSwapFee : chaiSwapFee)
    store.set('convert.fee', convertCurrency === 'dai' ? daiConvertFee : chaiConvertFee)
}

// message signing
export const createChequeMessageData = function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const nonce = Number(store.get('dach.nonce'))
    const to = store.get('cheque.to')
    const amount = Web3.utils.toWei(store.get('cheque.amount'))
    const fee = Web3.utils.toWei(store.get('cheque.fee'))
    const expiry = store.get('cheque.expiry') || 0;
    const walletAddress = store.get('walletAddress')
    const currency = store.get('cheque.selectedCurrency')

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

    const type = currency === 'dai' ? 'DaiCheque' : 'ChaiCheque'
    let messageData = {
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
            ]
        },
        primaryType: type,
        domain: {
            name: 'Dai Automated Clearing House',
            version: '1',
            chainId: chain_id,
            verifyingContract: dachAddress,
        },
        message: message,
    }
    messageData.types[type] = [{
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
    ]

    console.log('createChequeMessageData', messageData)

    const typedData = JSON.stringify(messageData);

    return {
        typedData,
        message
    }
}

export const createPermitMessageData = function(allowed, currency) {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const nonce = Number(currency === 'dai' ? store.get('daiNonce') : store.get('chaiNonce'))

    // console.log('createPermitMessageData', allowed, currency)

    const message = {
        holder: walletAddress,
        spender: dachAddress,
        nonce: nonce,
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
            name: currency === 'dai' ? 'Dai Stablecoin' : 'Chai',
            // name: 'Dai Stablecoin',
            version: '1',
            chainId: chain_id,
            verifyingContract: currency === 'dai' ? daiAddress : chaiAddress,
        },
        message: message
    });

    console.log('createPermitMessageData', JSON.parse(typedData))

    return {
        typedData,
        message
    }
}

export const createSwapMessageData = function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const nonce = Number(store.get('dach.nonce'))
    const input = Web3.utils.toWei(store.get('swap.inputAmount'))
    const output = Web3.utils.toWei(store.get('swap.outputAmount'))
    const fee = Web3.utils.toWei(store.get('swap.fee'))
    const expiry = store.get('swap.expiry') || 0;
    const walletAddress = store.get('walletAddress')
    const currency = store.get('swap.selectedCurrency')

    const message = {
        sender: walletAddress,
        amount: input,
        min_eth: Math.floor(output * 0.99).toString(),
        fee: fee,
        nonce: nonce,
        expiry: expiry,
        relayer: relayer
    }

    console.log('message', message)

    const type = currency === 'dai' ? 'DaiSwap' : 'ChaiSwap'
    let messageData = {
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
            ]
        },
        primaryType: type,
        domain: {
            name: 'Dai Automated Clearing House',
            version: '1',
            chainId: chain_id,
            verifyingContract: dachAddress,
        },
        message: message,
    }
    messageData.types[type] = [{
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
        },
    ]

    console.log('createSwapMessageData', messageData)

    const typedData = JSON.stringify(messageData);

    return {
        typedData,
        message
    }
}

export const createConvertMessageData = function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const nonce = Number(store.get('dach.nonce'))
    const amount = Web3.utils.toWei(store.get('convert.amount'))
    const fee = Web3.utils.toWei(store.get('convert.fee'))
    const expiry = store.get('convert.expiry') || 0;
    const walletAddress = store.get('walletAddress')
    const currency = store.get('convert.selectedCurrency')

    const message = {
        sender: walletAddress,
        receiver: walletAddress,
        amount: amount,
        fee: fee,
        nonce: nonce,
        expiry: expiry,
        relayer: relayer
    }

    console.log('message', message)

    const type = currency === 'dai' ? 'ChaiJoin' : 'ChaiExit'
    let messageData = {
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
            ]
        },
        primaryType: type,
        domain: {
            name: 'Dai Automated Clearing House',
            version: '1',
            chainId: chain_id,
            verifyingContract: dachAddress,
        },
        message: message,
    }
    messageData.types[type] = [{
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
    ]

    console.log('createConvertMessageData', messageData)

    const typedData = JSON.stringify(messageData);

    return {
        typedData,
        message
    }
}

export const signData = async function(web3, fromAddress, data, walletType, store) {
    console.log(web3, fromAddress)
    if (walletType === 'injected' || walletType === 'portis') {
        return new Promise(function(resolve, reject) {
            web3.currentProvider.sendAsync({
                    id: 1,
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
    } else if (walletType === 'wallet-connect') {
        // use wallet connector instead of web3 provider
        const walletConnector = store.get('walletConnector')
        return new Promise(async function (resolve, reject) {
            walletConnector
                .signTypedData([fromAddress, data])
                .then(result => {
                    // Returns signature.
                    console.log(result);
                    const r = result.slice(0,66)
                    const s = '0x' + result.slice(66,130)
                    const v = Number('0x' + result.slice(130,132))
                    resolve({
                        v,
                        r,
                        s
                    })
                })
                .catch(error => {
                    // Error returned when rejected
                    console.error(error);
                    reject(error)
                });
        });
    }
}

export const batchSignData = async function(batch, web3, fromAddress, data) {
    batch.add(web3.currentProvider.sendAsync({
        method: "eth_signTypedData_v3",
        params: [fromAddress, data],
        from: fromAddress
    }))
}

export const signDachTransferPermit = async function(allowed, currency) {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const walletType = store.get('walletType')

    const messageData = createPermitMessageData.bind(this)(allowed, currency)

    console.log(messageData)

    const sig = await signData(web3, walletAddress, messageData.typedData, walletType, store)
    return Object.assign({}, sig, messageData.message)
}

export const signDaiCheque = async function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const walletType = store.get('walletType')

    const messageData = createChequeMessageData.bind(this)()

    const sig = await signData(web3, walletAddress, messageData.typedData, walletType, store)

    return Object.assign({}, sig, messageData.message)
}

export const signChaiCheque = async function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const walletType = store.get('walletType')

    const messageData = createChequeMessageData.bind(this)()

    const sig = await signData(web3, walletAddress, messageData.typedData, walletType, store)

    return Object.assign({}, sig, messageData.message)
}

export const signSwap = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const walletType = store.get('walletType')

    const messageData = createSwapMessageData.bind(this)()

    console.log(messageData)

    const sig = await signData(web3, walletAddress, messageData.typedData, walletType, store)
    return Object.assign({}, sig, messageData.message)
}

export const signDaiConvert = async function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const walletType = store.get('walletType')

    const messageData = createConvertMessageData.bind(this)()

    const sig = await signData(web3, walletAddress, messageData.typedData, walletType, store)

    return Object.assign({}, sig, messageData.message)
}

export const signChaiConvert = async function() {
    const store = this.props.store
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const walletType = store.get('walletType')

    const messageData = createConvertMessageData.bind(this)()

    const sig = await signData(web3, walletAddress, messageData.typedData, walletType, store)

    return Object.assign({}, sig, messageData.message)
}

// tx mined monitoring
export const clearTxMinedInterval = async function(actionType, store) {
    const interval = store.get(`${actionType}.receiptInterval`)
    if (interval) {
        clearInterval(interval)
    }
}

export const clearTxMinedIntervals = async function(store) {
    ['cheque', 'swap', 'convert'].map(actionType => {
        clearTxMinedInterval(actionType, store)
    })
}

export const setTxMinedInterval = async function(actionType, hash, store) {
    const web3 = store.get('web3')
    const interval = setInterval(async () => {
        const result = await web3.eth.getTransactionReceipt(hash)
        if (result) {
            store.set(`${actionType}.resultMined`, true)
            // clear when it's mined
            clearTxMinedInterval(actionType, store)
        }
    }, 1000)
    store.set(`${actionType}.receiptInterval`, interval)
}



// wallets
export const initPortis = async function() {
    const { store } = this.props

    store.set('walletConnecting', true)
    const portis = new Portis('211b48db-e8cc-4b68-82ad-bf781727ea9e', 'mainnet');
    const web3 = new Web3(portis.provider);

    try {
      const accounts = await web3.eth.getAccounts()
      store.set('walletConnecting', false)
      store.set('walletAddress', accounts[0])
      store.set('web3', web3)
      store.set('walletType', 'portis')

      getDaiData.bind(this)()
      getChaiData.bind(this)()
      getFeeData.bind(this)()
    } catch(e) {
        store.set('walletConnecting', false)
    }
}

export const initWalletConnect = async function() {
    const { store } = this.props

    store.set('walletConnecting', true)

    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      infuraId: "84842078b09946638c03157f83405213" // Required
    });

    //  Enable session (triggers QR Code modal)
    try {
        await provider.enable();
        // Create a walletConnector
        const walletConnector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org" // Required
        });

        console.log('wallet connect', provider, walletConnector)

        //  Create Web3
        const web3 = new Web3(provider);
        console.log('wallet connect web3', web3, web3.eth, web3.eth.signTypedData)
        const accounts = await web3.eth.getAccounts()

        store.set('walletConnecting', false)
        store.set('walletAddress', accounts[0])
        store.set('web3', web3)
        store.set('walletConnector', walletConnector)
        store.set('walletType', 'wallet-connect')

        getDaiData.bind(this)()
        getChaiData.bind(this)()
        getFeeData.bind(this)()
    } catch(e) {
        store.set('walletConnecting', false)
    }
}


export const initBrowserWallet = async function() {
    const store = this.props.store

    store.set('walletLoading', true)
    store.set('balancesLoading', true)

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
        setWeb3.bind(this)(web3Provider)
    }
    // Legacy dApp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider;
        setWeb3.bind(this)(web3Provider)
    }
    // If no injected web3 instance is detected, display err
    else {
      store.set('showSignIn', true)
      store.set('signInMessage', 'Wallet not found')
    }
}

export const setWeb3 = async function(web3Provider) {
    const store = this.props.store
    if(web3Provider.networkVersion !== '1') {
        store.set('showSignIn', true)
        store.set('signInMessage', 'Please switch wallet to mainnet')
    } else {
        const web3 = new Web3(web3Provider);
        const walletType = 'injected'
        const accounts = await web3.eth.getAccounts()

        // await window.ethereum.enable();
        store.set('walletLoading', false)
        store.set('walletAddress', accounts[0])
        store.set('web3', web3)
        store.set('walletType', walletType)

        getDaiData.bind(this)()
        getChaiData.bind(this)()
        getFeeData.bind(this)()
    }
}

export default {
    initBrowserWallet,
    signDaiCheque,
    batchSignData
}
