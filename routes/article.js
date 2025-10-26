const express = require('express');
const connection = require('../connection');
const router = express.Router();


var auth = require('../services/authentication');


router.post('/addNewArticle', auth.authenticationToken, (req, res) => {
    const article = req.body;
    const query = "INSERT INTO article (title, content, categoryId, publication_date, status) VALUES (?, ?, ?, ?, ?)";
    connection.query(
        query,
        [article.title, article.content, article.categoryId, article.publication_date, article.status],
        (err, results) => {
            if (!err) {
                return res.status(200).json({ message: "Article added successfully" });
            } else {
                return res.status(500).json(err);
            }
        }
    );
});

router.get('/getallarticles', auth.authenticationToken, (req, res) => {
    const query = `
        SELECT 
            a.id,
            a.title,
            a.content,
            a.status,
            a.publication_date,
            c.id AS category,
            c.name AS categoryName
        FROM article AS a
        INNER JOIN category AS c
        ON a.categoryId = c.id
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});


router.get('/getallarticles', auth.authenticationToken, (req, res) => {
    const query = `
        SELECT 
            a.id,
            a.title,
            a.content,
            a.status,
            a.publication_date,
            c.id AS category,
            c.name AS categoryName
        FROM article AS a
        INNER JOIN category AS c
        ON a.categoryId = c.id
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getallPublishedarticles', auth.authenticationToken, (req, res) => {
    const query = `
        SELECT 
            a.id,
            a.title,
            a.content,
            a.status,
            a.publication_date,
            c.id AS category,
            c.name AS categoryName
        FROM article AS a
        INNER JOIN category AS c
        ON a.categoryId = c.id
        WHERE a.status = 'Published'
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post('/updateArticle', auth.authenticationToken, (req, res) => {
    const article = req.body;
    const query = `
        UPDATE article 
        SET title = ?, content = ?, categoryId = ?, publication_date = ?, status = ? 
        WHERE id = ?
    `;
    connection.query(
        query,
        [article.title, article.content, article.categoryId, article.publication_date, article.status, article.id],
        (err, results) => {
            if (!err) {
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "Article ID doesn't exist" });
                }
                return res.status(200).json({ message: "Article updated successfully" });
            } else {
                return res.status(500).json(err);
            }
        }
    );
});


router.post('/deleteArticle', auth.authenticationToken, (req, res) => {
    const article = req.body;
    const query = "DELETE FROM article WHERE id = ?";
    connection.query(query, [article.id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Article ID doesn't exist" });
            }
            return res.status(200).json({ message: "Article deleted successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});





module.exports = router;
