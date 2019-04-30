const express        = require('express');
const bodyParser     = require('body-parser')
const path           = require('path');
const methodOverride = require('method-override');
const {execFile, execFileSync}   = require('child_process');

// Set up the express app
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname,'./index.html')))
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname,'./index.html')))
app.get('/dai.js', (req, res) => res.sendFile(path.join(__dirname,'./dai.js')))

//Submit a permit
app.post('/api/v1/permit', (req, res) => {
  if(!req.body               ||
     !req.body.permit        ||
     !req.body.permit.holder ||
     !req.body.permit.spender||
     !req.body.permit.v      ||
     !req.body.permit.r      ||
     !req.body.permit.s) {
    return res.status(400).send({
      success: 'false',
      message: 'Required fields; permit, holder, spender, v, r, s'
    });
  }
  if (req.body.permit.allowed === undefined) {
    req.body.permit.allowed = true;
  }
  if (req.body.permit.nonce === undefined) {
    req.body.permit.nonce = 0;
  }
  if (req.body.permit.deadline === undefined) {
    req.body.permit.deadline = 0;
  }
  try {
    let call = execFileSync('./bin/callPermit',
                            [req.body.permit.holder,
                             req.body.permit.spender,
                             req.body.permit.nonce,
                             req.body.permit.deadline,
                             req.body.permit.allowed,
                             req.body.permit.v,
                             req.body.permit.r,
                             req.body.permit.s]);
    data = call.toString();
    if (!(data == "\n")) {
      return res.status(400).send({
        success: 'false',
        message: data
      });
    }
    let send = execFileSync('./bin/execPermit',
                            [req.body.permit.holder,
                             req.body.permit.spender,
                             req.body.permit.nonce,
                             req.body.permit.deadline,
                             req.body.permit.allowed,
                             req.body.permit.v,
                             req.body.permit.r,
                             req.body.permit.s]);
    hash = send.toString().replace('\n','');
    return res.status(201).send({
      success: 'true',
      message: hash
    });

  } catch (e) {
    return res.status(400).send({
      success: 'false',
      message: e.toString()
    });
  }
});

//Submit a cheque
app.post('/api/v1/cheque', (req, res) => {
  if(!req.body                 ||
     !req.body.cheque          ||
     !req.body.cheque.sender   ||
     !req.body.cheque.receiver ||
     !req.body.cheque.amount   ||
     !req.body.cheque.fee      ||
     !req.body.cheque.v        ||
     !req.body.cheque.r        ||
     !req.body.cheque.s) {
    return res.status(400).send({
      success: 'false',
      message: 'Required fields; cheque, sender, receiver, amount, fee, v, r, s'
    });
  }
  if (req.body.cheque.nonce === undefined) {
    req.body.cheque.nonce = 0;
  }
  if (req.body.cheque.expiry === undefined) {
    req.body.cheque.expiry = 0;
  }
  try {
    let call = execFileSync('./bin/callCheque',
                            [req.body.cheque.sender,
                             req.body.cheque.receiver,
                             req.body.cheque.amount,
                             req.body.cheque.fee,
                             req.body.cheque.nonce,
                             req.body.cheque.expiry,
                             req.body.cheque.v,
                             req.body.cheque.r,
                             req.body.cheque.s]);
    data = call.toString();
    if (!(data == "\n")) {
      return res.status(400).send({
        success: 'false',
        message: data
      });
    }
    let send = execFileSync('./bin/execCheque',
                            [req.body.cheque.sender,
                             req.body.cheque.receiver,
                             req.body.cheque.amount,
                             req.body.cheque.fee,
                             req.body.cheque.nonce,
                             req.body.cheque.expiry,
                             req.body.cheque.v,
                             req.body.cheque.r,
                             req.body.cheque.s]);
    hash = send.toString().replace('\n','');
    return res.status(201).send({
      success: 'true',
      message: hash
    });

  } catch (e) {
    return res.status(400).send({
      success: 'false',
      message: e.toString()
    });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Server error')
})
