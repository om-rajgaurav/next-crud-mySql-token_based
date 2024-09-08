import { query } from "./db";
import { Post } from "../types/post";
import mysql from "mysql2/promise";

// Fetch all posts for a user
export const getPostsForUser = async (userId: number): Promise<Post[]> => {
  try {
    const [results] = await query("SELECT * FROM posts WHERE user_id = ?", [userId]);
    return results as Post[];
  } catch (error) {
    console.error("Error fetching posts for user:", error);
    throw error;
  }
};

// Fetch a single post by ID
export const getPostById = async (id: number): Promise<Post | null> => {
  try {
    const [results] = await query("SELECT * FROM posts WHERE id = ?", [id]);
    return (results as Post[])[0] || null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (post: Post): Promise<Post> => {
  try {
    const [result] = await query(
      "INSERT INTO posts (title, description, user_id) VALUES (?, ?, ?)",
      [post.title, post.description, post.user_id]
    );
    const id = (result as mysql.ResultSetHeader).insertId;
    return { ...post, id };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Update an existing post
export const updatePost = async (post: Post): Promise<Post | null> => {
  try {
    const [result] = await query(
      "UPDATE posts SET title = ?, description = ? WHERE id = ?",
      [post.title, post.description, post.id]
    );
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return null;
    }
    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post by ID
export const deletePost = async (id: number): Promise<boolean> => {
  try {
    const [result] = await query("DELETE FROM posts WHERE id = ?", [id]);
    return (result as mysql.ResultSetHeader).affectedRows > 0;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
