import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

function movieDataSyncPlugin() {
  return {
    name: "movie-data-sync",
    configureServer(server) {
      const publicMoviesDir = path.resolve(
        process.cwd(),
        "public/images/movies",
      );
      if (!fs.existsSync(publicMoviesDir)) {
        fs.mkdirSync(publicMoviesDir, { recursive: true });
      }

      // Endpoint to upload and save image files into public/images/movies
      server.middlewares.use("/api/upload-movie-image", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const { dataUrl, filename, movieId } = JSON.parse(body);
              if (dataUrl && dataUrl.startsWith("data:image/")) {
                const match = dataUrl.match(
                  /^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/,
                );
                if (match) {
                  const rawExt = match[1] === "jpeg" ? "jpg" : match[1];
                  const buffer = Buffer.from(match[2], "base64");
                  const safeName = movieId
                    ? `movie-${movieId}.${rawExt}`
                    : filename
                      ? path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_")
                      : `movie-${Date.now()}.${rawExt}`;

                  const targetPath = path.join(publicMoviesDir, safeName);
                  fs.writeFileSync(targetPath, buffer);

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      ok: true,
                      filename: safeName,
                      url: `/images/movies/${safeName}`,
                    }),
                  );
                  return;
                }
              }
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: false, error: "Invalid image data" }));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
        }
      });

      // Endpoint to sync movies list and auto-save any base64 images into public/images/movies
      server.middlewares.use("/api/sync-movie-data", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const { movies } = JSON.parse(body);
              if (Array.isArray(movies)) {
                const filePath = path.resolve(
                  process.cwd(),
                  "src/data/movie.js",
                );
                const currentContent = fs.readFileSync(filePath, "utf-8");
                const markerStart = "const movieRecords = [";
                const markerEnd = "];\n\n// This is the complete seed catalogue.";
                const startIndex = currentContent.indexOf(markerStart);
                const endIndex = currentContent.indexOf(markerEnd);

                if (startIndex !== -1 && endIndex !== -1) {
                  const cleanRecords = movies.map((m) => {
                    let imageVal = m.image || m.poster || "";
                    let posterVal = m.poster || m.image || "";

                    // If image is a base64 string, write it to public/images/movies/
                    if (
                      imageVal.startsWith("data:image/") ||
                      posterVal.startsWith("data:image/")
                    ) {
                      const dataUri = imageVal.startsWith("data:image/")
                        ? imageVal
                        : posterVal;
                      const match = dataUri.match(
                        /^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/,
                      );
                      if (match) {
                        const rawExt = match[1] === "jpeg" ? "jpg" : match[1];
                        const buffer = Buffer.from(match[2], "base64");
                        const fileName = `movie-${m.id}.${rawExt}`;
                        const targetPath = path.join(publicMoviesDir, fileName);
                        fs.writeFileSync(targetPath, buffer);
                        imageVal = fileName;
                        posterVal = "";
                      }
                    }

                    return {
                      id: Number(m.id),
                      title: m.title || "",
                      year: Number(m.year) || 2026,
                      duration: m.duration || "",
                      genre: m.genre || "Drama",
                      rating: Number(m.rating) || 0,
                      image: imageVal,
                      poster: posterVal,
                      trailerUrl: m.trailerUrl || "",
                      videoUrl: m.videoUrl || "",
                      description: m.description || "",
                      director: m.director || "",
                      cast: m.cast || "",
                    };
                  });

                  const formattedRecords =
                    markerStart +
                    "\n" +
                    cleanRecords
                      .map((record) => {
                        const entries = Object.entries(record)
                          .filter(([, v]) => v !== undefined && v !== "")
                          .map(
                            ([k, v]) =>
                              `    ${k}: ${typeof v === "number" ? v : JSON.stringify(v)},`,
                          )
                          .join("\n");
                        return `  {\n${entries}\n  },`;
                      })
                      .join("\n") +
                    "\n";

                  const newContent =
                    currentContent.slice(0, startIndex) +
                    formattedRecords +
                    currentContent.slice(endIndex);

                  fs.writeFileSync(filePath, newContent, "utf-8");
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ ok: true }));
                  return;
                }
              }
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: false, error: "Invalid format" }));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), movieDataSyncPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    restoreMocks: true,
  },
});

