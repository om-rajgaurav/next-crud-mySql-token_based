

import { createConnection } from './db';
import { Post } from '../types/post';
import mysql from 'mysql2/promise';

export const getPosts = async (): Promise<Post[]> => {
  const conn = await createConnection();
  const [rows] = await conn.query('SELECT * FROM posts');
  return rows as Post[];
};

export const getPostById = async (id: number): Promise<Post | null> => {
  const conn = await createConnection();
  const [rows] = await conn.query('SELECT * FROM posts WHERE id = ?', [id]);
  return (rows as Post[])[0] || null;
};

export const createPost = async (post: Post): Promise<Post> => {
  const conn = await createConnection();
  const [result] = await conn.query('INSERT INTO posts (title, description) VALUES (?, ?)', [post.title, post.description]);
  const id = (result as mysql.ResultSetHeader).insertId;
  return { ...post, id };
};

export const updatePost = async (post: Post): Promise<Post | null> => {
  const conn = await createConnection();
  const [result] = await conn.query('UPDATE posts SET title = ?, description = ? WHERE id = ?', [post.title, post.description, post.id]);
  if ((result as mysql.ResultSetHeader).affectedRows === 0) {
    return null;
  }
  return post;
};

export const deletePost = async (id: number): Promise<boolean> => {
  const conn = await createConnection();
  const [result] = await conn.query('DELETE FROM posts WHERE id = ?', [id]);
  return (result as mysql.ResultSetHeader).affectedRows > 0;
};
