import ConnectionString from "./config/db.config.js";
import express from "express";
import cors from "cors";

const pool = ConnectionString()
const app = express()
const PORT = 8081;
app.use(express.json())
app.use(cors())

// Insert task to the database
app.post('/task',async (req,res) => {
    const {title,description,category} = req.body;
    if (!title) return res.status(400).send("Invalid title");
    if (!description) return res.status(400).send("Invalid description");
    if (!category) return res.status(400).send("Invalid category");

    try {
        const insertQuery = "INSERT INTO tasks (title, description, category) VALUES ($1, $2, $3)";
        const values = [title, description, category];

        await pool.query(insertQuery, values);

        return res.send("Task created successfully");
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error")
    }
})

// get one task by it's id
app.get('/task/:id', async(req,res) => {
    const { id } = req.params;
    if(!id) return res.status(400).send("Invalid task id");

    try {
        const oneTaskQuery = "SELECT * FROM tasks WHERE id = $1";
        const task = await pool.query(oneTaskQuery,[id]);

        if(task.rows.length === 0) return res.status(404).send("No task found with that id")
        return res.json(task.rows[0])
        
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error: "+error.message)
    }
})

// Update the task by using it's id
app.put('/task/:taskid',async (req,res) => {
    const {taskid} = req.params;
    const {title,description,category} = req.body;

    if(!taskid) return res.status(400).send("Invalid identification !")
    if(!title) return res.status(400).send("Invalid title");
    if(!category) return res.status(400).send("Invalid category");
    if(!description) return res.status(400).send("Invalid description")
    
    try {
        const updateTaskQuery = "UPDATE tasks SET title = $1, description = $2, category = $3, updatedAt = NOW() WHERE taskid = $4 RETURNING *";
        const values = [title,description,category,taskid]
        const updatedTask = await pool.query(updateTaskQuery,values);

        if(updatedTask.rows.length === 0) return res.status(404).send("Task not found")
        
        res.json(updatedTask.rows[0])
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server Error: "+error.message)
    }
})

// delete task by it's id
app.delete('/task/:taskid', async (req,res) => {
    const { taskid } = req.params;
    if(!taskid) return res.status(404).send("Invalid task id")
    
    try {
        const deleteQuery = "DELETE FROM tasks WHERE taskid = $1 RETURNING *";
        const taskDeleted = await pool.query(deleteQuery,[taskid])

        if(taskDeleted.rows.length === 0) return res.status(404).send("No task with that id was found")
        if(taskDeleted){
            return res.send(`Task with the deleted successfully`)
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server error: "+error.message)
    }
})

// get all the tasks available in the database
app.get('/tasks',async (req,res) => {
    try {
        const query = "SELECT * FROM tasks;";
        const tasks = await pool.query(query);
        
        if(tasks.rows.length === 0) return res.send("No tasks available");
        
        res.json(tasks.rows);
    } catch (error) {
        console.error(error.message)
        return res.send(500).send("Server error: "+error.message)
    }
})

// get tasks by category
app.get('/tasks/category/:category', async (req,res) =>{
    const { category } = req.params;
    if(!category) return res.status(400).send("Invalid category")

    try {
        const selectByCategoryQuery = "SELECT * FROM tasks WHERE category = $1";
        const selectedCategories = await pool.query(selectByCategoryQuery,[category]);

        if(selectedCategories.rows.length === 0) return res.status(404).send("No task found with this category")
        res.json(selectedCategories.rows)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error: "+ error.message)
    }
})

app.listen(PORT,(err) => {
    if(err){
        console.log(`Error: ${err}`)
    }
    console.log(`Server running on http://localhost:${PORT}`)
})