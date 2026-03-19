import { validateMovie, validatePartialMovie } from "../schemas/movies.js"
import { validate as isUUID } from 'uuid'

export class MovieController{

    constructor({movieModel}){
        this.movieModel = movieModel
    }

    getAll = async (req, res) => {
        const {genre} = req.query
        const movies = await this.movieModel.getAll({genre})
        //Que es lo que renderiza

        res.status(200).json(movies)
    }

    getByID = async(req, res) => {
        const {id} = req.params

        
        if (!isUUID(id)) {
            res.status(400).json({message:'Invalid UUID'}) 
        }

        const movie = await this.movieModel.getById({id})
    
        if(movie) return res.json(movie) 
    
        res.status(404).json({message: 'pelicula no encontrada'})
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)

        if(result.error){
            //Unprocessable entity
            return res.status(422).json({error: result.error.message})
        }
        //En base de datos
        const newMovie = await this.movieModel.create({input: result.data})
    
        res.status(201).json(newMovie)
    }

    update = async (req, res) => {
        const {id} = req.params

                
        if (!isUUID(id)) {
            res.status(400).json({message:'Invalid UUID'}) 
        }

        const result = validatePartialMovie(req.body)
        if(result.error) return res.status(422).json({error: result.error.message})
        
        const updateMovie =  await this.movieModel.update({id, input: result.data})
    
        return res.json(updateMovie)
    }

    delete = async (req, res) =>{
    const {id} = req.params

            
    if (!isUUID(id)) {
        res.status(400).json({message:'Invalid UUID'}) 
    }

    const result = await this.movieModel.delete({id})

    if(result){
        return res.json({message: 'Movie Deleted'})
    }

    return res.status(400).json({error: 'An error ocurred'})

    }

}