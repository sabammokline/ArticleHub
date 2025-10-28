const express = require('express');
const connection = require('../connection');
const router = express.Router();

var auth = require('../services/authentication');

router.post("/addNewCategory", auth.authenticationToken, (req, res) => {
    let category = req.body;
    const query = "INSERT INTO category (name) VALUES (?)";
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Category added successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});


router.get('/getAllCategory', auth.authenticationToken, (req, res) => {
    const query = "select * from category order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateCategory', auth.authenticationToken, (req, res) => {
    const category = req.body;
    const query = "UPDATE category SET name = ? WHERE id = ?";
    connection.query(query, [category.name, category.id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Category ID doesn't exist" });
            }
            return res.status(200).json({ message: "Category updated successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});



module.exports = router;
