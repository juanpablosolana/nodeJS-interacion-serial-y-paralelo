const express = require("express");
const cors = require('cors')
const app = express();
const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter');
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 2400
})
let bascula = []
app.use(cors())

const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
parser.on('data', function (data) {
  if (data.toString() !== bascula[bascula.length - 1])
  {
    console.log(bascula.length)
    bascula.push(data.toString())
  }
})

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ bascula: bascula[bascula.length - 1] })
  bascula=[]
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("server corriendo en el puerto", PORT);
});