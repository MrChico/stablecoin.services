import { signDachTransferPermit, signCheque, signSwap } from '../utils/walletUtils';

export const transfer = async function() {
    const { store } = this.props
    const dachApproved = store.get('dachApproved')

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true)
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedCheque = await signCheque.bind(this)()
                    
                    // POST /permit_and_transfer
                }, 100)
            } catch(e) {
                console.log(e)
            }
        } catch(e) {
            console.log(e)
        }
    } else {
        try {
            const signedCheque = await signCheque.bind(this)()

            // POST /transfer
        } catch(e) {
            console.log(e)
        }
    }
}

export const swap = async function() {
    const { store } = this.props
    const dachSwapApproved = store.get('dachSwapApproved')

    if (!dachSwapApproved) {
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

export default {
    transfer,
    swap
}
