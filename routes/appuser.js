const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth = require('../services/authentication');

router.post('/addNewAppuser', auth.authenticationToken, (req, res) => {
    const user = req.body;

    let query = "SELECT email, password, status FROM appuser WHERE email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        query = "INSERT INTO appuser(name, email, password, status, isDeletable) VALUES (?, ?, ?, 'false', 'true')";
        connection.query(query, [user.name, user.email, user.password], (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({ message: "Successfully registered" });
        });
    });
});

router.post('/login', (req, res) => {
    const user = req.body;

    const query = "SELECT email, password, status, isDeletable FROM appuser WHERE email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length <= 0 || results[0].password !== user.password) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        if (results[0].status === 'false') {
            return res.status(401).json({ message: "Wait for admin approval" });
        }

        const response = {
            email: results[0].email,
            isDeletable: results[0].isDeletable
        }
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
        return res.status(200).json({ token: accessToken });
    });
});



router.get('/getAllAppuser', auth.authenticationToken, (req, res) => {
    const tokenPayload = res.locals;
    let query;
    if (tokenPayload.isDeletable === 'false') {
        query = "SELECT id, name, email, status FROM appuser WHERE isDeletable = 'true'";
    } else {
        query = "SELECT id, name, email, status FROM appuser WHERE isDeletable = 'true' AND email != ?";
    }

    connection.query(query, [tokenPayload.email], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateUserStatus', auth.authenticationToken, (req, res) => {
    const user = req.body;
    const query = "UPDATE appuser SET status = ? WHERE id = ? AND isDeletable = 'true'";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Appuser ID doesn't exist" });
            }
            return res.status(200).json({ message: "Appuser updated successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post('/updateUser', auth.authenticationToken, (req, res) => {
    const user = req.body;
    const query = "UPDATE appuser SET name = ?, email = ? WHERE id = ?";
    connection.query(query, [user.name, user.email, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User ID doesn't exist" });
            }
            return res.status(200).json({ message: "User updated successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});



router.get('/checkToken', auth.authenticationToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})
module.exports = router;
