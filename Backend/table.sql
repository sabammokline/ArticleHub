CREATE TABLE IF NOT EXISTS appuser (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(250),
    status VARCHAR(20),
    isDeletable VARCHAR(20)
);

INSERT INTO appuser(name, email, password, status, isDeletable) 
VALUES ('Admin', 'admin@email.com', 'admin', 'true', 'false');

create table category(
    id int key AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

create table article(
    id int key AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    categoryId integer NOT NULL,
    publication_date Date,
    status varchar(20)

);

