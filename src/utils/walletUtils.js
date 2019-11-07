import Web3 from "web3";
import daiABI from '../utils/daiABI.json';
import dachABI from '../utils/dachABI.json';

const daiAddress = "0xaaeb56503ceb8852f802bdf050b8ff7d567716ed";
const dachAddress = '0xc2433f48f1db3b5067dc412d403b57a3077a52c0';

export const initBrowserWallet = async function () {
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

    await window.ethereum.enable();
    const BN = web3.utils.BN;
    store.set('walletLoading', false)
    store.set('walletAddress', accounts[0])
    store.set('web3', web3)
    store.set('walletType', walletType)
    const dai = new web3.eth.Contract(daiABI, daiAddress);
    const dach = new web3.eth.Contract(dachABI, dachAddress);
    const daiBalanceRaw = await dai.methods.balanceOf(accounts[0]).call();
    const daiBalance = parseFloat(web3.utils.fromWei(daiBalanceRaw)).toFixed(2);
    
    const dachAllowance = await dai.methods.allowance(accounts[0], dachAddress).call();
    const dachNonce = await dach.methods.nonces(accounts[0]).call();
    const dachApproved = dachAllowance == "115792089237316195423570985008687907853269984665640564039457584007913129639935" ;
    store.set('daiObject', dai)
    store.set('daiBalance', daiBalance)
    store.set('dachApproved', dachApproved)
    store.set('dachAllowance', dachAllowance)
    store.set('dachNonce', dachNonce)
}

export const signCheque = async function () {
  const store = this.props.store
  const web3 = store.get('web3')
  const nonce = store.get('dachNonce')
  const accounts = store.get('accounts')
  const to = store.get('cheque.to')
  const amount = store.get('cheque.amount')
  const fee = store.get('cheque.fee')

  const typedData = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Cheque: [
        { name: 'sender', type: 'address' },
        { name: 'receiver', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'fee', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' }
      ],
    },
    primaryType: 'Cheque',
    domain: {
      name: 'Dai Automated Clearing House',
      version: '1',
      chainId: Number(web3.currentProvider.networkVersion),
      verifyingContract: dachAddress,
    },
    message: {
      sender: accounts[0],
      receiver: to,
      amount: amount,
      fee: fee,
      nonce: nonce,
      expiry: 0
    },
  });

  //TODO: WHY DOESN"T THIS WORK
  web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v3",
      params: [accounts[0], typedData],
      from: accounts[0]
    },
    function(err, result) {
      store.set(err, 'err')
      store.set(result, 'result')
    }
  );
}

export default {
  initBrowserWallet,
  signCheque
}
