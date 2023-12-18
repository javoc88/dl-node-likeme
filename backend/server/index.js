require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importa las funciones
const { createPost, readPosts, updatePost, deletePost } = require("../utils/pg");

const PORT = process.env.PORT;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Ruta POST para almacenar un nuevo registro en la tabla
app.post("/posts", async (req, res) => {
  try {
    const result = await createPost(req.body);
    res.status(result?.code ? 500 : 200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Ruta GET para obtener registros de la tabla
app.get("/posts", async (_, res) => {
  try {
    const result = await readPosts();
    res.status(result?.code ? 500 : 200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Ruta PUT para actualizar un registro en la tabla
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updatePost(id);
    res.status(result?.code ? 500 : 200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Ruta DELETE para eliminar un registro en la tabla
app.delete("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await deletePost(postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
