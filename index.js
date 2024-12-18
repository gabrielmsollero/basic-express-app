const express = require('express');
const port = 3000;
const app = express();
app.use(express.json());

let counter = 0;
let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title, completed } = req.body;
  const id = ++counter;

  // validation could be more generic if there was the possibility of adding new
  // fields in the future. Didn't do that for time sake
  if (
    !title ||
    completed === undefined ||
    typeof title !== 'string' ||
    typeof completed != 'boolean'
  ) {
    res.status(400).send();
    return;
  }

  tasks.push({
    id,
    title,
    completed,
  });
  res.status(201).send();
  return;
});

app.patch('/tasks/:id', (req, res) => {
  // should catch exceptions related to parsing ID as int. Intentionally didn't
  // for time sake
  const id = parseInt(req.params.id);
  const task = tasks.filter((t) => t.id === id)[0];

  if (!task) {
    res.status(404).send();
    return;
  }

  const { title, completed } = req.body;
  // validation could be more generic if there was the possibility of adding new
  // fields in the future. Didn't do that for time sake
  if (
    (title !== undefined && typeof title !== 'string') ||
    (completed !== undefined && typeof completed != 'boolean')
  ) {
    res.status(400).send();
    return;
  }

  task.title = title ?? task.title;
  task.completed = completed ?? task.completed;

  res.status(200).send();
  return;
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== id);

  // could be returning a 404 here in case the ID being deleted is not found
  // intentionally let that out for time sake

  res.status(200).send();
  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
