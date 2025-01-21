import express from 'express'
import dotenv from 'dotenv'
import routers from './src/routes.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorMiddleware from './src/middlewares/error.js'
import getNfseAutomatic from './src/services/getNfseAutomatic.js'

dotenv.config()

const port = process.env.PORT
const app = express();

app.use(cors())
app.use(bodyParser.json({limit: '100mb'}))
app.use(express.json())
app.use(routers)
app.use(errorMiddleware)


getNfseAutomatic();

  
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})