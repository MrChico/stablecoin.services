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
  chaiPermitAndCheque
} from '../utils/apiUtils';

export const daiTransfer = async function() {
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

export const chaiTransfer = async function() {
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

export const daiSwap = async function() {
    const { store } = this.props
    const dachApproved = store.get('dachApproved')

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true)
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedSwap = await signSwap.bind(this)()

                    // POST /permit_and_swap
                }, 100)
            } catch(e) {
                console.log(e)
            }
        } catch(e) {
            console.log(e)
        }
    } else {
        try {
            const signedSwap = await signSwap.bind(this)()

            // POST /swap
        } catch(e) {
            console.log(e)
        }
    }
}

export const chaiSwap = async function() {

}

export const daiConvert = async function() {

}

export const chaiConvert = async function() {

}

export default {
    daiTransfer,
    chaiTransfer,
    daiSwap,
    chaiSwap,
    daiConvert,
    chaiConvert
}
