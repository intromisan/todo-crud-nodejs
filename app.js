const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const Todo = require('./modules/todo');

const app = express();


//Use of bodyparser (it is in express now)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES

//Gets all todos
app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.json({ message: err });
    }
});


//Creates a Todo
app.post('/', async (req, res) => {
    try {
        const todo = await new Todo({
            title: req.body.title,
            description: req.body.description
        });
        todo.save();
        return res.redirect('/');
    } catch (err) {
        console.log(err);
    };
});

//Get specific todo
app.get('/:todoId', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.todoId);
        res.json(todo);
    } catch (err) {
        console.log(err);
    }
});

//Delete specific todo
app.delete('/delete/:todoId', async (req, res) => {
    try {
        const deletedTodo = await Todo.remove({ _id: req.params.todoId });
        res.json(deletedTodo);
        return res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

//Edit the todo
app.post('/edit/:todoId', async (req, res) => {
    try {
        const updatedTodo = await Todo.updateOne(
            { _id: req.params.todoId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description
                }
            }
        );
        res.json(updatedTodo);
        return res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});


//DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('Connected to DB')
);

app.listen(3000);