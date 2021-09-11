// La bascula modelo


const express = require("express");
const cors = require('cors')
const app = express();
const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter');
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 2400
})
// El arreglo almacena los valores de la bascula
let bascula = []
// ------> Iniciando el server   <------
app.use(cors())

// Estoy utilizando delimiter para guardar los datos por renglon
const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
parser.on('data', function (data) {
  // La conexión con el puerto siempre está abierta por lo que solo guardo los valores que cambian
  data.toString() !== bascula[bascula.length - 1]? bascula.push(data.toString()): null
})

// Al entrar a la url recupero el ultimo valor de la bascula
app.get("/API/v1/bascula", (req, res) => {
  res.status(200).json({ bascula: bascula[bascula.length - 1] })
  //limpio el arreglo para mejorar el rendimiento
  bascula.length=0
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("server corriendo en el puerto", PORT);
});