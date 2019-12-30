import config from '../config.json';
const API_URL = config.API_URL;

// FEES
// transfer
export const daiChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiCheque/fee`)
    return request.json()
}

export const chaiChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/chaiCheque/fee`)
    return request.json()
}

export const daiPermitAndChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiPermitAndCheque/fee`)
    return request.json()
}

export const chaiPermitAndChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/chaiPermitAndCheque/fee`)
    return request.json()
}

// swap
export const daiSwapFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiSwap/fee`)
    return request.json()
}

export const chaiSwapFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiSwap/fee`)
    return request.json()
}

export const daiPermitAndSwapFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiSwap/fee`)
    return request.json()
}

export const chaiPermitAndSwapFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiSwap/fee`)
    return request.json()
}

// convert
export const daiConvertFee = async function() {
    const request = await fetch(`${API_URL}/v1/chaiJoin/fee`)
    return request.json()
}

export const chaiConvertFee = async function() {
    const request = await fetch(`${API_URL}/v1/chaiExit/fee`)
    return request.json()
}

export const daiPermitAndConvertFee = async function() {
    const request = await fetch(`${API_URL}/v1/chaiJoin/fee`)
    return request.json()
}

export const chaiPermitAndConvertFee = async function() {
    const request = await fetch(`${API_URL}/v1/chaiExit/fee`)
    return request.json()
}

// ACTIONS
// transfer
export const daiCheque = async function(data) {
    // console.log('daiCheque', data)
    const request = await fetch(`${API_URL}/v1/daiCheque`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

export const daiPermitAndCheque = async function(data) {
    const request = await fetch(`${API_URL}/v1/daiPermitAndCheque`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

export const chaiCheque = async function(data) {
    // console.log('daiCheque', data)
    const request = await fetch(`${API_URL}/v1/chaiCheque`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

export const chaiPermitAndCheque = async function(data) {
    const request = await fetch(`${API_URL}/v1/chaiPermitAndCheque`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

// swap
export const daiSwap = async function(data) {
    // console.log('daiCheque', data)
    const request = await fetch(`${API_URL}/v1/daiSwap`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

export const chaiSwap = async function(data) {
    // console.log('daiCheque', data)
    const request = await fetch(`${API_URL}/v1/chaiSwap`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

// convert
export const daiConvert = async function(data) {
    const request = await fetch(`${API_URL}/v1/chaiJoin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return request.json()
}

export const daiPermitAndConvert = async function(data) {
    const request = await fetch(`${API_URL}/v1/chaiPermitAndJoin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return request.json()
}

export const chaiConvert = async function(data) {
    const request = await fetch(`${API_URL}/v1/chaiExit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return request.json()
}

export const chaiPermitAndConvert = async function(data) {
    const request = await fetch(`${API_URL}/v1/chaiPermitAndExit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return request.json()
}

export default {
    daiChequeFee
}
