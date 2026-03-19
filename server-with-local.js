import { createAPP } from "./app.js";
import { MovieModel } from "./models/local-file-system/movie.js"

createAPP({movieModel: MovieModel})