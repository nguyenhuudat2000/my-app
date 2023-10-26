import mongoose from "mongoose";
import PostMessage from "../model/postMessage.js"

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
export const createPost = async (req, res) => {
  const post = req.body;
  const userId = req.userId;
  const newPostMessage = new PostMessage({ ...post, creator: userId, createAt: new Date().toString() });
  try {
    await newPostMessage.save();
    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id ${id}`);

  const updatePost = { ...post, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatePost, { new: true });

  res.json(updatePost);
}

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: 'Post is deleted successfully' });
}

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: Unauthenticated });

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.status(200).json(updatedPost);
}