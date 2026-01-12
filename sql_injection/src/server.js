import express from "express";
import cors from "cors";
import { connectionString } from "./config/db.config.mjs";

const pool = connectionString();
const app = express();
const PORT = 3000;

app.use(cors(['GET','POST']));
app.use(express.json());

app.post("/secure/login", async (req,res) => {
    const {username,password} = req.body
    if (!username || !password) return res.status(400).send("Invalid username or password");

    try{
        const query = "SELECT id,username,email FROM students WHERE username = $1 AND password = $2";
        const user = await pool.query(query,[username,password]);

        if(user.rows.length === 0) return res.status(404).send("User not found")
        
        return res.json(user.rows)
        
    }catch(error){
        console.error(error);
        return res.status(500).send("Server error")
    }
})

app.post("/vulnerable/login", async (req,res) => {
    const {username,password} = req.body;
    if(!username || !password) return res.status(400).send("Invalid username or password")

    try{
        const query = `SELECT id,username,email FROM students WHERE username = '${username}' AND password = '${password}'`;
        const user = await pool.query(query)
        
        if(user.rows.length === 0) return res.status(400).send("User not found");

        return res.json(user.rows)

    }catch(error){
        console.error(error)
        return res.status(500).send("Server error")
    }
})

app.get("/user/:id", async (req,res) => {
    const {id} = req.params
    const userId = parseInt(id, 10);
    if (isNaN(userId)) return res.status(400).send("Invalid user Id");

    try {
        const query = "SELECT id,username,email FROM students WHERE id = $1"
        const user = await pool.query(query, [userId]);

        if(user.rows.length === 0) return res.status(404).send("No user found with that id")
        res.json(user.rows[0])
        
    } catch (error) {
        console.log(`Server ${error}`)
        res.status(500).send("Internal Server Error")
    }
})

app.get("/users", async (req,res) =>{
    try{
        const query = "SELECT * FROM students";
        const users = await pool.query(query)
        if(!users){
            res.send("No users ")
        }
        if(users.rows.length === 0){
            res.send("No users avialable")
        }
        console.log(users)
        res.json(users.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Server error")
    }
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})