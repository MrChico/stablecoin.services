import {
  signDachTransferPermit,
  signDaiCheque,
  signChaiCheque,
  signSwap,
  batchSignData,
  createChequeMessageData,
  createPermitMessageData
} from '../utils/web3Utils';

import {
  daiCheque,
  daiPermitAndCheque,
  chaiCheque,
  chaiPermitAndCheque,
  daiSwap
} from '../utils/apiUtils';

export const newDaiTransfer = async function() {
    const { store } = this.props
    // const dachApproved = false
    const dachApproved = store.get('dach.daiApproved')
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    store.set('cheque.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'dai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedCheque = await signDaiCheque.bind(this)()
                    // POST /permit_and_transfer
                    const result = await daiPermitAndCheque({
                        permit: signedPermit,
                        cheque: signedCheque
                    })
                    store.set('cheque.result', result)
                    store.set('cheque.requesting', false)
                    console.log('daiPermitAndCheque', result)
                }, 10)
            } catch(e) {
                console.log(e)
                store.set('cheque.requesting', false)
            }
        } catch(e) {
            console.log(e)
            store.set('cheque.requesting', false)
        }
    } else {
        try {
            const signedCheque = await signDaiCheque.bind(this)()
            console.log('signedCheque', signedCheque)
            // POST /transfer
            const result = await daiCheque({ cheque: signedCheque })
            store.set('cheque.result', result)
            store.set('cheque.requesting', false)
        } catch(e) {
            console.log('cheque error', e)
            store.set('cheque.requesting', false)
        }
    }
}

export const newChaiTransfer = async function() {
    const { store } = this.props
    // const dachApproved = false
    const dachApproved = store.get('dach.chaiApproved')
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    store.set('cheque.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'chai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedCheque = await signChaiCheque.bind(this)()
                    // POST /permit_and_transfer
                    const result = await chaiPermitAndCheque({
                        permit: signedPermit,
                        cheque: signedCheque
                    })
                    store.set('cheque.result', result)
                    store.set('cheque.requesting', false)
                    console.log('chaiPermitAndCheque', result)
                }, 10)
            } catch(e) {
                console.log(e)
                store.set('cheque.requesting', false)
            }
        } catch(e) {
            console.log(e)
            store.set('cheque.requesting', false)
        }
    } else {
        try {
            const signedCheque = await signChaiCheque.bind(this)()
            console.log('signedCheque', signedCheque)
            // POST /transfer
            const result = await chaiCheque({ cheque: signedCheque })
            store.set('cheque.result', result)
            store.set('cheque.requesting', false)
        } catch(e) {
            console.log('cheque error', e)
            store.set('cheque.requesting', false)
        }
    }
}

export const newDaiSwap = async function() {
    const { store } = this.props
    store.set('swap.requesting', true)
    try {
        const signedSwap = await signSwap.bind(this)()
        console.log('signedSwap', signedSwap)
        const result = await daiSwap({ swap: signedSwap })
        store.set('swap.result', result)
        store.set('swap.requesting', false)
    } catch(e) {
        console.log('swap error', e)
        store.set('swap.requesting', false)
    }
}

export const newChaiSwap = async function() {

}

export const newDaiConvert = async function() {

}

export const newChaiConvert = async function() {

}

export default {
}
