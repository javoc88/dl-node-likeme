require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");

// Configuración de credenciales
const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  allowExitOnIdle: true
};

const pool = new Pool(config);

// Función genérica para realizar consultas a la base de datos
const genericQuery = async (query, values) => {
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    return { code: error.code, message: error.message };
  }
};

// Función para obtener todos los posts
const readPosts = async () => {
  const query = "SELECT * FROM posts;";
  return await genericQuery(query);
};

// Función para crear un nuevo post
const createPost = async ({ titulo, url: img, descripcion, likes }) => {
  const query = "INSERT INTO posts (id, titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
  const values = [uuidv4(), titulo, img, descripcion, likes];
  return await genericQuery(query, values);
};

// Función para actualizar un post
const updatePost = async (id) => {
  const query = "UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *;";
  return await genericQuery(query, [id]);
};

// Función para eliminar un post
const deletePost = async (id) => {
  const query = "DELETE FROM posts WHERE id = $1 RETURNING *;";
  return await genericQuery(query, [id]);
};

// Exportación de funciones
module.exports = { createPost, readPosts, updatePost, deletePost };
