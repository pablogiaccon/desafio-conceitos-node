const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequest(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function testUuid(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ Error: 'ID invalid' });
  }

  return next();
}

app.use('/repositories/:id', testUuid);
app.use(logRequest);

app.get("/repositories", (req, res) => {
  // TODO
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  // TODO
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title: title,
    techs: techs,
    url,
    likes: 0
  }

  repositories.push(repository);
  return res.status(201).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  // TODO

  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ Error: 'Repository not found.' });
  }

  const repository = {
    id: repositories[repositoryIndex].id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return res.status(200).json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  // TODO
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ Error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  // TODO
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ Error: 'Repository not found.' });
  }

  const repository = {
    id: repositories[repositoryIndex].id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + 1
  };

  repositories[repositoryIndex] = repository;

  return res.status(200).json(repository);
});

module.exports = app;
