import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";

const port = 8080;

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".ts": "application/typescript",
  ".tsx": "application/typescript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;
    
    // Default to index.html for root
    if (pathname === "/") {
      pathname = "/index.html";
    }
    
    // Try to serve the file
    const filePath = join(process.cwd(), "public", pathname.slice(1));
    
    if (existsSync(filePath)) {
      const ext = extname(filePath);
      const mimeType = mimeTypes[ext] || "text/plain";
      
      try {
        const content = readFileSync(filePath);
        return new Response(content, {
          headers: { "Content-Type": mimeType },
        });
      } catch (error) {
        return new Response("Error reading file", { status: 500 });
      }
    }
    
    // For development, try to serve from src
    const srcPath = join(process.cwd(), "src", pathname.slice(1));
    if (existsSync(srcPath)) {
      const ext = extname(srcPath);
      const mimeType = mimeTypes[ext] || "text/plain";
      
      try {
        const content = readFileSync(srcPath);
        return new Response(content, {
          headers: { "Content-Type": mimeType },
        });
      } catch (error) {
        return new Response("Error reading file", { status: 500 });
      }
    }
    
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Server running at http://localhost:${port}`);

