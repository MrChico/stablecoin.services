import {
  signDachTransferPermit,
  signDaiCheque,
  signChaiCheque,
  signSwap,
  signDaiConvert,
  signChaiConvert,
  batchSignData,
  createChequeMessageData,
  createPermitMessageData
} from '../utils/web3Utils';

import {
  daiCheque,
  daiPermitAndCheque,
  chaiCheque,
  chaiPermitAndCheque,
  daiSwap,
  chaiSwap,
  daiConvert,
  daiPermitAndConvert,
  chaiConvert,
  chaiPermitAndConvert
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
    const { store } = this.props
    store.set('swap.requesting', true)
    try {
        const signedSwap = await signSwap.bind(this)()
        console.log('signedSwap', signedSwap)
        const result = await chaiSwap({ swap: signedSwap })
        store.set('swap.result', result)
        store.set('swap.requesting', false)
    } catch(e) {
        console.log('swap error', e)
        store.set('swap.requesting', false)
    }
}

export const newDaiConvert = async function() {
    const { store } = this.props

    const dachApproved = store.get('dach.daiApproved')
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    store.set('convert.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'dai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedConvert = await signDaiConvert.bind(this)()
                    // POST /permit_and_transfer
                    const result = await daiPermitAndConvert({
                        permit: signedPermit,
                        join: signedConvert
                    })
                    store.set('convert.result', result)
                    store.set('convert.requesting', false)
                }, 10)
            } catch(e) {
                console.log(e)
                store.set('convert.requesting', false)
            }
        } catch(e) {
            console.log(e)
            store.set('convert.requesting', false)
        }
    } else {
        try {
            const signedConvert = await signDaiConvert.bind(this)()

            // POST /transfer
            const result = await daiConvert({ join: signedConvert })
            store.set('convert.result', result)
            store.set('convert.requesting', false)
        } catch(e) {
            console.log('cheque error', e)
            store.set('convert.requesting', false)
        }
    }
}

export const newChaiConvert = async function() {
    const { store } = this.props

    const dachApproved = store.get('dach.daiApproved')
    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')

    store.set('convert.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'chai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedConvert = await signChaiConvert.bind(this)()
                    // POST /permit_and_transfer
                    const result = await chaiPermitAndConvert({
                        permit: signedPermit,
                        join: signedConvert
                    })
                    store.set('convert.result', result)
                    store.set('convert.requesting', false)
                }, 10)
            } catch(e) {
                console.log(e)
                store.set('convert.requesting', false)
            }
        } catch(e) {
            console.log(e)
            store.set('convert.requesting', false)
        }
    } else {
        try {
            const signedConvert = await signChaiConvert.bind(this)()

            // POST /transfer
            const result = await chaiConvert({ join: signedConvert })
            store.set('convert.result', result)
            store.set('convert.requesting', false)
        } catch(e) {
            console.log('cheque error', e)
            store.set('convert.requesting', false)
        }
    }
}

export default {
}
