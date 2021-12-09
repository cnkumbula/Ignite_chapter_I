const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({error: 'User not found!!!'})
  }

  request.user = user;

  return next();


}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreayExists = users.some(
    (user) => user.username === username
    );

  if(userAlreayExists){
    return response.status(400).json({error: "User already exists!!!"});
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).json(users)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

const { title, deadline } = request.body;

const { user } = request;

const userTodos  = {
  id: uuidv4(),
  title,
  done: 'false',
  deadline: new Date(deadline),
  created_at: new Date()

}

user.todos.push(userTodos);

return response.status(201).json(userTodos);


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;

  const { id } = request.params;

  const { user } = request;
  
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(400).json({error: 'ToDos not found!!!'})
  }

  todo.title = title;
  todo.deadline = deadline;


  //return response.status(201).send();
  return response.status(201).json(user.todos);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(400).json({error: 'ToDos not found!!!'})
  }

  todo.done = true

  return response.json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(400).json({error: 'ToDos not found!!!'})
  }

  user.todos.splice(todo, 1);

  return response.json(user.todos);




  





});

module.exports = app;