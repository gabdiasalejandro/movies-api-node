import mysql from 'mysql2/promise'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config();

const dbPassword = process.env.SQL_PASSWORD
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbName = process.env.DB_NAME

const config = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
}

const connection = await mysql.createConnection(config)


export class MovieModel{
    static async getAll({ genre }) {

        if (genre) {
        const lowerCaseGenre = genre.toLowerCase()

        const [genres] = await connection.query(
            'SELECT name FROM genre'
        )

        const validGenres = genres.map(g => g.name.toLowerCase())

        if (!validGenres.includes(lowerCaseGenre)) {
            return `The genre must be one of ${validGenres.join(', ')}`
        }

        const [movies] = await connection.query(
            `SELECT 
            BIN_TO_UUID(movie.id) as id,
            movie.title,
            movie.year,
            movie.director,
            movie.poster,
            movie.rate,
            movie.duration,
            genre.name as genre
            FROM movie_genres
            JOIN movie ON movie.id = movie_genres.movie_id
            JOIN genre ON genre.id = movie_genres.genre_id
            WHERE LOWER(genre.name) = ?;`,
            [lowerCaseGenre]
        )

        return movies
        }

        const [movies] = await connection.query(
        `SELECT 
            BIN_TO_UUID(id) as id,
            title,
            year,
            director,
            poster,
            rate,
            duration 
        FROM movie;`
        )

        return movies
    }

    static async getById({id}){

        const [movies] = await connection.query(
        `SELECT 
            BIN_TO_UUID(id) as id,
            title,
            year,
            director,
            poster,
            rate,
            duration 
        FROM movie
        WHERE id = UUID_TO_BIN(?);`,
        [id]
        )

        if(movies.length === 0) return null

        return movies
    }


static async create({ input }) {

    const {
        genre: genreInput,
        title,
        year,
        duration,
        director,
        rate,
        poster
    } = input

    const id = crypto.randomUUID()

    try{
            // 1. Insertar película primero
    await connection.query(`
        INSERT INTO movie(
        id, title, year, director, poster, rate, duration
        ) VALUES (UUID_TO_BIN(?),?,?,?,?,?,?)
    `, [id, title, year, director, poster, rate, duration])

    // 2. Procesar géneros (IMPORTANTE: for...of)
    for (const genreName of genreInput) {

        // buscar si existe
        const [rows] = await connection.query(
        'SELECT id FROM genre WHERE name = ?',
        [genreName]
        )

        let genreId

        if (rows.length > 0) {
        genreId = rows[0].id
        } else {
        // insertar nuevo género
        const [result] = await connection.query(
            'INSERT INTO genre(name) VALUES (?)',
            [genreName]
        )

        genreId = result.insertId
        }

        // insertar relación
        await connection.query(
        'INSERT INTO movie_genres(movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
        [id, genreId]
        )
    }
    }catch (e){
        throw new Error('Error Creating Movie')
    }



    // 3. devolver película
    const [newMovie] = await connection.query(`
        SELECT 
        BIN_TO_UUID(id) as id,
        title,
        year,
        director,
        poster,
        rate,
        duration 
        FROM movie
        WHERE id = UUID_TO_BIN(?)
    `, [id])

        return newMovie[0]
    }

    static async delete({ id }) {
        try {
            const [result] = await connection.query(
            'DELETE FROM movie WHERE id = UUID_TO_BIN(?)',
            [id]
            )

            return result.affectedRows > 0
        } catch (e) {
            throw new Error('Error deleting Movie')
        }
    }

    static async update({ id, input }) {

    const allowedFields = [
        'title',
        'year',
        'duration',
        'director',
        'rate',
        'poster'
    ]

    const fields = Object.keys(input)
        .filter(field => allowedFields.includes(field))

    if (fields.length === 0) return

    const setClause = fields.map(field => `${field} = ?`).join(', ')
    const values = fields.map(field => input[field])

    try {
        await connection.query(
        `UPDATE movie
        SET ${setClause}
        WHERE id = UUID_TO_BIN(?)`,
        [...values, id]
        )

        return "Movie Deleted"
    } catch {
        throw new Error('Error updating Movie')
    }
    }

}
