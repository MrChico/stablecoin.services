const express        = require('express');
const {execFile, execFileSync}   = require('child_process');
const path   = require("path");

// Set up the express app
const app = express();
//app.use(bodyParser.urlencoded({
//    extended: true
//}));
//app.use(bodyParser.json());
//app.use(methodOverride());
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname,'./token-wallet.html')))
app.get('/dai.js', (req, res) => res.sendFile(path.join(__dirname,'./dai.js')))
