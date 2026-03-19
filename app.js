import express, { json } from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { corsMidlleware } from './middlewares/cors.js'
import { createMovieRouter } from './routes/movies.js'

import dotenv from 'dotenv'
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicPath = join(__dirname, 'public')

export const createAPP = ({movieModel}) => {
    const PORT = process.env.PORT ?? 1234

    const app = express()
    app.disable('x-powered-by')
    app.use(corsMidlleware())
    app.use(json())
    app.use(express.static(publicPath))

    app.options('/movie/:id', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    })

    app.use('/movies', createMovieRouter({movieModel}))

    app.listen(PORT, () => {
        console.log(`Server listening on https://localhost:${PORT}`)
    })

}
