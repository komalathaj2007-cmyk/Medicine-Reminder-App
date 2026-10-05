
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));


// =====================================================
// MYSQL DATABASE CONNECTION
// DO NOT CHANGE THIS
// =====================================================

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "Root@12345",

    database: "medicine_reminder"

});


// =====================================================
// CONNECT TO DATABASE
// =====================================================

db.connect((err) => {

    if (err) {

        console.log(
            "Database connection failed:",
            err.message
        );

    } else {

        console.log(
            "MySQL Database Connected Successfully!"
        );

    }

});


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.send(
        "Medicine Reminder Backend is Running!"
    );

});


// =====================================================
// GET ALL MEDICINES
// =====================================================

app.get("/medicines", (req, res) => {


    db.query(

        "SELECT * FROM medicines ORDER BY id DESC",

        (err, results) => {


            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }


            res.json(results);

        }

    );

});


// =====================================================
// ADD MEDICINE
// =====================================================

app.post("/medicines", (req, res) => {


    const {
        medicine_name,
        dosage,
        time,
        frequency,
        notes
    } = req.body;



    const sql = `

        INSERT INTO medicines

        (medicine_name, dosage, time, frequency, notes)

        VALUES (?, ?, ?, ?, ?)

    `;



    db.query(

        sql,

        [
            medicine_name,
            dosage,
            time,
            frequency,
            notes
        ],

        (err, result) => {


            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }



            res.json({

                message:
                    "Medicine added successfully!",

                id:
                    result.insertId

            });

        }

    );

});


// =====================================================
// EDIT / UPDATE MEDICINE
// =====================================================
// This does NOT create a new row.
// It updates the existing medicine using its ID.
// =====================================================

app.put("/medicines/:id", (req, res) => {


    const id =
        req.params.id;



    const {
        medicine_name,
        dosage,
        time,
        frequency,
        notes
    } = req.body;



    const sql = `

        UPDATE medicines

        SET

            medicine_name = ?,

            dosage = ?,

            time = ?,

            frequency = ?,

            notes = ?

        WHERE id = ?

    `;



    db.query(

        sql,

        [
            medicine_name,
            dosage,
            time,
            frequency,
            notes,
            id
        ],

        (err, result) => {


            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }



            res.json({

                message:
                    "Medicine updated successfully!",

                affectedRows:
                    result.affectedRows

            });

        }

    );

});


// =====================================================
// START SERVER
// =====================================================

app.listen(3000, () => {

    console.log(
        "Server running at http://localhost:3000"
    );

});
