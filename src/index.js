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
  // La conexión con el puerto siempre está abierta por lo que solo guardo los valores que cambian
  data.toString() !== bascula[bascula.length - 1]? bascula.push(data.toString()): null
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