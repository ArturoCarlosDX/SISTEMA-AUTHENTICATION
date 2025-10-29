import axios from 'axios';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const BASE = 'https://jsonplaceholder.typicode.com';

export const getPosts = async () => {
  return axios.get<Post[]>(`${BASE}/posts`);
};

export const getPostById = async (id: number) => {
  return axios.get<Post>(`${BASE}/posts/${id}`);
};

export const getCommentsByPostId = async (postId: number) => {
  return axios.get<Comment[]>(`${BASE}/posts/${postId}/comments`);
};

export default {
  getPosts,
  getPostById,
  getCommentsByPostId,
};
