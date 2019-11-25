//const API_URL = 'http://andrew-mac.local:8000'
import config from '../config.json';
const API_URL = config.API_URL;

export const chequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/cheque/fee`)
    return request.json()
}

export const permitAndChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/permitAndCheque/fee`)
    return request.json()
}

export const swapFee = async function() {
    const request = await fetch(`${API_URL}/v1/cheque/fee`)
    return request.json()
}

export const permitAndSwapFee = async function() {
    const request = await fetch(`${API_URL}/v1/permitAndCheque/fee`)
    return request.json()
}

export const cheque = async function(data) {
    const request = await fetch(`${API_URL}/v1/cheque`, {
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

export const permitAndCheque = async function(data) {
    const request = await fetch(`${API_URL}/v1/permitAndCheque`, {
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

export default {
    chequeFee,
    swapFee
}
