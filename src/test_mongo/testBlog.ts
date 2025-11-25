import mongoose from 'mongoose';
import { mongoConnection } from '../config/mongodb';
import { Blog } from './model';

const testBlog = async () => {
  try {
    // Connect to MongoDB
    await mongoConnection();

    // Create a test blog post
    const blogPost = await Blog.create({
      title: 'Test Blog Post',
      author: 'John Doe',
      body: 'This is a test blog post to check MongoDB connection.',
      comments: [
        { body: 'Great post!', date: new Date() },
        { body: 'Thanks for sharing', date: new Date() },
      ],
      hidden: false,
      meta: {
        votes: 10,
        favs: 5,
      },
    });

    console.log('Test blog created:', blogPost);

    // Fetch all blog posts
    const blogs = await Blog.find();
    console.log('All blogs:', blogs);
  } catch (err) {
    console.error('Error testing Blog schema:', err);
  } finally {
    // Disconnect after test
    await mongoose.disconnect();
  }
};

testBlog();
