import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add sample post for demonstration
  if ('addSamplePost' in storage) {
    (storage as any).addSamplePost();
  }

  app.get("/api/posts", async (req, res) => {
    const tag = req.query.tag as string | undefined;
    const search = req.query.search as string | undefined;

    let posts;
    if (tag) {
      posts = await storage.getPostsByTag(tag);
    } else if (search) {
      posts = await storage.searchPosts(search);
    } else {
      posts = await storage.getPosts();
    }

    res.json(posts);
  });

  app.get("/api/posts/:slug", async (req, res) => {
    const post = await storage.getPost(req.params.slug);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  });

  const httpServer = createServer(app);
  return httpServer;
}