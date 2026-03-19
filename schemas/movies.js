import z from 'zod'

const now = new Date
const currentYear = now.getFullYear()

const movieSchema = z.object({
    title: z.string({invalid_type_error: 'Movie title must be a tring', required_error: 'Movie title is required'}),
    director: z.string({invalid_type_error: 'Movie title must be a tring', required_error: 'Movie title is required'}),
    year: z.number().int().min(1900).max(currentYear),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).optional(),
    poster: z.url({message:'Poster must be a valid URL'}).endsWith('.jpg'),
    genre:z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Thriller', 'Crime']))
})

export function validateMovie(shape){
    return movieSchema.safeParse(shape)
}

export function validatePartialMovie(shape){
    return movieSchema.partial().safeParse(shape)
}