import { signDachTransferPermit, signDaiCheque, signSwap } from '../utils/web3Utils';
import { daiCheque, daiPermitAndCheque } from '../utils/apiUtils';

export const daiTransfer = async function() {
    const { store } = this.props
    const dachApproved = store.get('dachApproved')


    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true)
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedCheque = await signDaiCheque.bind(this)()
                    // POST /permit_and_transfer
                    const result = await daiPermitAndCheque({
                        permit: signedPermit,
                        cheque: signedCheque
                    })
                    console.log('daiPermitAndCheque', result)
                }, 100)
            } catch(e) {
                console.log(e)
            }
        } catch(e) {
            console.log(e)
        }
    } else {
        try {
            const signedCheque = await signDaiCheque.bind(this)()
            // POST /transfer
            const result = await daiCheque({ cheque: signedCheque })
        } catch(e) {
            console.log(e)
        }
    }
}

export const chaiTransfer = async function() {}

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

export const chaiSwap = async function() {}

export const daiConvert = async function() {}

export const chaiConvert = async function() {}

export default {
    daiTransfer,
    chaiTransfer,
    daiSwap,
    chaiSwap,
    daiConvert,
    chaiConvert
}
