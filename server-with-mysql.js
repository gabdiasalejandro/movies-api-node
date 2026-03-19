import { createAPP } from "./app.js";
import { MovieModel } from "./models/database/movie.js";

createAPP({movieModel: MovieModel})