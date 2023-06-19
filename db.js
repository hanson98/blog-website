import mongoose from "mongoose";

let Post;

export async function connectToDatabase() {
  const db = "blog";
  const uri =
    "mongodb+srv://hanson98:YvAQ9eWjvxSF6Dx3@cluster0.jezfnwr.mongodb.net/" +
    db;
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Successfully connected to MongoDB.");
      createPostModel();
    }
  } catch (error) {
    console.log("Error caught while connecting to MongoDB: " + error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (e) {
    console.log("Error caught while disconnecting from MongoDB: " + e);
  }
}

function createPostModel() {
  const postSchema = new mongoose.Schema({
    title: String,
    content: String,
  });

  Post = mongoose.models.Post || mongoose.model("Post", postSchema);
}

export { Post };

export function createPost(title, content) {
  const post = new Post({
    title: title,
    content: content,
  });
  return post.save();
}

export async function getData() {
  try {
    if (!Post) {
      createPostModel();
    }
    const posts = await Post.find({}).lean().exec();
    return posts;
  } catch (error) {
    console.log("Error caught while retrieving data: " + error);
    throw error;
  }
}

export async function getOneData(requestTitle) {
  try {
    if (!Post) {
      createPostModel();
    }
    const regex = new RegExp(requestTitle, "i");
   const posts = await Post.find({ title: regex }).lean().exec();
    return posts;
  } catch (error) {
    console.log("Error caught while retrieving data: " + error);
    throw error;
  }
}
