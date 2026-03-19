DROP DATABASE IF EXISTS movies_db;
CREATE DATABASE movies_db;
USE movies_db;

-- Movies
CREATE TABLE movie (
    id BINARY(16) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL, 
    director VARCHAR(255) NOT NULL,
    poster TEXT,
    rate DECIMAL(2,1) UNSIGNED NOT NULL,
    duration INT
);

-- Genres
CREATE TABLE genre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Relation table
CREATE TABLE movie_genres (
    movie_id BINARY(16),
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE
);

-- Seed genres
INSERT INTO genre (name) VALUES
('Drama'), ('Action'), ('Crime'), ('Adventure'), ('Sci-Fi'), ('Romance');

-- Seed movies
INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID()), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
(UUID_TO_BIN(UUID()), 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
(UUID_TO_BIN(UUID()), 'Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8);

-- Relations
INSERT INTO movie_genres (movie_id, genre_id) VALUES 
((SELECT id FROM movie WHERE title = 'Inception'), 5),
((SELECT id FROM movie WHERE title = 'Inception'), 2),
((SELECT id FROM movie WHERE title = 'The Shawshank Redemption'), 1),
((SELECT id FROM movie WHERE title = 'The Dark Knight'), 2);