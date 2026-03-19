import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const moviesPath = path.join(__dirname, 'movies.json')

const readMovies = async () => {
    const moviesJSON = await readFile(moviesPath, 'utf-8')
    return JSON.parse(moviesJSON)
}

const writeMovies = async (movies) => {
    await writeFile(moviesPath, JSON.stringify(movies, null, 2))
}

export class MovieModel {

    static async getAll({genre}){
        const movies = await readMovies()
        if(genre){
            return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        }
        return movies
    }

    static async getById({id}){
        const movies = await readMovies()
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create({input}){
        const movies = await readMovies()
        const newMovie = {
            id:randomUUID(),
            ...input
        }
    
        movies.push(newMovie)
        await writeMovies(movies)
        return newMovie
    }

    static async delete({id}){
        const movies = await readMovies()
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if(movieIndex < 0) return false
        movies.splice(movieIndex, 1)
        await writeMovies(movies)
        return true
    }

    static async update({id, input}){
        const movies = await readMovies()
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if(movieIndex < 0) return false

        const updatedMovie = {
                ...movies[movieIndex],
                ...input
            }
        
        movies[movieIndex] = updatedMovie
        await writeMovies(movies)
        return updatedMovie
    }
}
