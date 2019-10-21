var eth = new Eth(new Eth.HttpProvider('https://kovan.infura.io'));
var el = function(id){ return document.querySelector(id); };
var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

// uncomment to enable MetaMask support:
if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
  eth.setProvider(window.web3.currentProvider);
} else {
  eth.setProvider(provider); // set to TestRPC if not available
}

var DachABI = [{"constant":true,"inputs":[],"name":"CHEQUE_TYPEHASH","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"SWAP_TYPEHASH","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"expiry","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"taxMan","type":"address"}],"name":"clear","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"amount","type":"uint256"},{"name":"min_eth","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"expiry","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"taxMan","type":"address"}],"name":"swapToEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_dai","type":"address"},{"name":"_uniswap","type":"address"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var DaiABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"holder","type":"address"},{"name":"spender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"},{"name":"allowed","type":"bool"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"wards","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"symbol_","type":"string"},{"name":"name_","type":"string"},{"name":"version_","type":"string"},{"name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"}];

var DaiAddress = '0xaaeb56503ceb8852f802bdf050b8ff7d567716ed';

var DachAddress = '0xc2433f48f1db3b5067dc412d403b57a3077a52c0';

var tokenInstance = eth.contract(DaiABI).at(DaiAddress);

var DachInstance = eth.contract(DachABI).at(DachAddress);

eth.accounts().then(function(accounts){
  tokenInstance.allowance(accounts[0], DachAddress).then(function(allowance){
    el('#allowance').innerHTML = "Current dach allowance:" + Eth.fromWei(allowance[0].toString(), 'ether');
  });

    el('#accountAddress').innerHTML = accounts[0];

  function updateBalanceHTML() {
    if(!tokenInstance) { return; }

    tokenInstance.balanceOf(accounts[0]).then(function(tokenBalance){
      el('#tokenBalance').innerHTML = Eth.fromWei(tokenBalance[0].toString(), 'ether');
    });
  }

  updateBalanceHTML();

  el('#balanceOf').addEventListener('click', function(){
    el('#balanceResponse').style.display = 'block';

    tokenInstance.balanceOf(el('#balanceAddress').value)
      .then(function(tokenBalance){
        el('#balanceResponse').innerHTML = 'Token balance is: ' + Eth.fromWei(tokenBalance[0].toString(), 'ether')
      })
      .catch(function(balanceError){
        el('#balanceResponse').innerHTML = 'Hmm.. there was an error: ' + String(balanceError);
      });
  });

  el('#authDach').addEventListener('click', function(){
    el('#permitResponse').style.display = 'block';
    el('#permitResponse').innerHTML = 'Signing permit...';
    tokenInstance.nonces(accounts[0]).then(function(accNonce) {

      var spender = DachAddress;
      var nonce = Number(accNonce[0]);

      var typedData = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Permit: [
            { name: 'holder', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }, //"s/expiry/deadline/g"
            { name: 'allowed', type: 'bool' },
          ],
        },
        primaryType: 'Permit',
        domain: {
          name: 'Dai Semi-Automated Permit Office',
          version: '1',
          chainId: Number(web3.currentProvider.networkVersion),
          verifyingContract: DaiAddress,
        },
        message: {
          holder: accounts[0],
          spender: spender,
          nonce: nonce,
          deadline: 0,
          allowed: true
        },
      });
      var from = accounts[0]
      var params = [from, typedData]
      var method = 'eth_signTypedData_v3'

      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function (err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          el('#permitResponse').innerHTML = 'Signing failed'
          return console.error('ERROR', result)
        }
        else {
          var r = result.result.slice(0,66)
          var s = '0x' + result.result.slice(66,130)
          var v = Number('0x' + result.result.slice(130,132))

          el('#permitResponse').innerHTML = 'Signing successful! Submitting permit... '
          var Permit = {"permit" :
                        { "holder"  : from,
                          "spender" : spender,
                          "nonce"   : nonce,
                          "deadline": 0,
                          "allowed" : true,
                          "v" : v,
                          "r" : r,
                          "s" : s}};
          console.log(JSON.stringify(Permit))
//          console.log($)
          $.ajax({
            url: '/api/v1/permit',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              console.log(data)
              el('#permitResponse').innerHTML = '<a target="_blank" rel="noopener noreferrer" href=https://kovan.etherscan.io/tx/' + data.message + '>Submitting permit with tx hash: ' + data.message + '</a>';
            },
            data: JSON.stringify(Permit)
          });
        }
      });
    })

  });
  
  el('#transferTokens').addEventListener('click', function(){
    el('#transferResponse').style.display = 'block';
    DachInstance.nonces(accounts[0]).then(function(accNonce) {

      var sender = accounts[0]
      var nonce = Number(accNonce[0]);
      var receiver = el('#transferAddress').value;
      var amount = el('#transferAmount').value;
      var fee = el('#transferFee').value;
      var typedData = JSON.stringify({
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
            { name: 'expiry', type: 'uint256' } //"s/expiry/deadline/g"
          ],
        },
        primaryType: 'Cheque',
        domain: {
          name: 'Dai Automated Clearing House',
          version: '1',
          chainId: Number(web3.currentProvider.networkVersion),
          verifyingContract: DachAddress,
        },
        message: {
          sender: accounts[0],
          receiver: receiver,
          amount: amount,
          fee: fee,
          nonce: nonce,
          expiry: 0
        },
      });
      var from = accounts[0]
      var params = [from, typedData]
      console.log(JSON.stringify(params))
      var method = 'eth_signTypedData_v3'

      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function (err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          el('#transferResponse').innerHTML = 'Signing failed'
          return console.error('ERROR', result)
        }
        else {
          var r = result.result.slice(0,66)
          var s = '0x' + result.result.slice(66,130)
          var v = Number('0x' + result.result.slice(130,132))

          el('#transferResponse').innerHTML = 'Signing successful! Submitting permit... '
          var Cheque = {"cheque" :
                        { "sender"   : from,
                          "receiver" : receiver,
                          "amount"   : amount,
                          "fee"     : fee,
                          "nonce"   : nonce,
                          "expiry": 0,
                          "v" : v,
                          "r" : r,
                          "s" : s}};
          console.log(JSON.stringify(Cheque))
          $.ajax({
            url: '/api/v1/cheque',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              console.log(data)
              el('#transferResponse').innerHTML = '<a target="_blank" rel="noopener noreferrer" href=https://kovan.etherscan.io/tx/' + data.message + '>Submitting permit with tx hash: ' + data.message + '</a>';
            },
            data: JSON.stringify(Cheque)
          });
        }
      });
    })
  })

  el('#permit').addEventListener('click', function(){
    el('#permitResponse').style.display = 'block';
    el('#permitResponse').innerHTML = 'Signing permit...';
    
    tokenInstance.nonces(accounts[0]).then(function(accNonce) {

      var spender = el('#permitAddress').value;
      var nonce = Number(accNonce[0]);

      var typedData = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Permit: [
            { name: 'holder', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }, //"s/expiry/deadline/g"
            { name: 'allowed', type: 'bool' },
          ],
        },
        primaryType: 'Permit',
        domain: {
          name: 'Dai Semi-Automated Permit Office',
          version: '1',
          chainId: Number(web3.currentProvider.networkVersion),
          verifyingContract: DaiAddress,
        },
        message: {
          holder: accounts[0],
          spender: spender,
          nonce: nonce,
          deadline: 0,
          allowed: true
        },
      });
      var from = accounts[0]
      var params = [from, typedData]
      var method = 'eth_signTypedData_v3'

      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function (err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          el('#permitResponse').innerHTML = 'Signing failed'
          return console.error('ERROR', result)
        }
        else {
          var r = result.result.slice(0,66)
          var s = '0x' + result.result.slice(66,130)
          var v = Number('0x' + result.result.slice(130,132))

          el('#permitResponse').innerHTML = 'Signing successful! Submitting permit... '
          var Permit = {"permit" :
                        { "holder"  : from,
                          "spender" : spender,
                          "nonce"   : nonce,
                          "deadline": 0,
                          "allowed" : true,
                          "v" : v,
                          "r" : r,
                          "s" : s}};
          console.log(JSON.stringify(Permit))
//          console.log($)
          $.ajax({
            url: '/api/v1/permit',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              console.log(data)
              el('#permitResponse').innerHTML = '<a target="_blank" rel="noopener noreferrer" href=https://kovan.etherscan.io/tx/' + data.message + '>Submitting permit with tx hash: ' + data.message + '</a>';
            },
            data: JSON.stringify(Permit)
          });
        }
      });
    })
  });

  tokenInstance.symbol().then(function(tokenSymbol){
    el('.tokenSymbol').innerHTML = tokenSymbol[0];
  });

  tokenInstance.name().then(function(tokenName){
    el('#tokenName').innerHTML = tokenName[0];
  });
  tokenInstance.totalSupply().then(function(tokenSupply){
    el('#totalSupply').innerHTML = Eth.fromWei(tokenSupply[0].toString(), 'ether');
  });

});
