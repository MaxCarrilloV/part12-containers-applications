const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')
/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const creados = await redis.getAsync("added_todos")
  if(creados)
    redis.setAsync("added_todos",parseInt(creados)+1)
  else
    redis.setAsync("added_todos",1)
  res.send(todo)
});



const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await Todo.findByIdAndDelete(req.todo.id)
  res.sendStatus(200)
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  await Todo.findByIdAndUpdate(req.todo.id,req.body)
  const todo = await Todo.findById(req.todo.id)
  res.json(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
