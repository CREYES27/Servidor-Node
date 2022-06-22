const express = require('express')
const multer  = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const { Console } = require('console')

const storageStrategy =  multer.memoryStorage()
//const upload = multer({ dest: 'uploads/' })  guarda el archivo en la carpeta uloads
const upload = multer({ storage: storageStrategy }) //guarda el archivo en memoria (con la variable definida como: storageStrategy)
const app = express()

app.use(express.json())

app.get('/', function (req, res) {
  res.send('Hola Mundo desde HEROKU')
})

app.post('/imagen', upload.single('imagen'), async function(req, res){
  const body = req.body
  const imagen = req.file

  console.log({file: req.file}) //pra ver que esta trayendo

  const processedImage = sharp(imagen.buffer)
  const resizedImage = processedImage.resize(800, 200, {
    fit: "contain",
    background: "#FFF"
  })

  let resizedImageBuffer

  try {
    resizedImageBuffer = await resizedImage.toBuffer() 
  } catch (error) {
    console.log({error})
  }
  

  fs.writeFileSync('nuevaruta/prueba.png', resizedImageBuffer)
  console.log(resizedImageBuffer)
  //res.send({ resizedImage: resizedImageBuffer}) //devuelve un arreglo para postman
  res.send({ '$content-type': 'image/png', '$content': resizedImageBuffer.toString('base64')}) //base64 para poder enviar a word con power automate
})

const PORT = process.env.PORT || 3000

app.listen(PORT, function(){
  console.log("Servidor escuchando en el puerto:", PORT)
})
