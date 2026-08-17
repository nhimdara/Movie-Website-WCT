import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

function movieDataSyncPlugin() {
  return {
    name: "movie-data-sync",
    configureServer(server) {
      server.middlewares.use("/api/sync-movie-data", async (req, res) => {
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
                  const cleanRecords = movies.map((m) => ({
                    id: Number(m.id),
                    title: m.title || "",
                    year: Number(m.year) || 2026,
                    duration: m.duration || "",
                    genre: m.genre || "Drama",
                    rating: Number(m.rating) || 0,
                    image: m.image || m.poster || "",
                    poster: m.poster || m.image || "",
                    trailerUrl: m.trailerUrl || "",
                    videoUrl: m.videoUrl || "",
                    description: m.description || "",
                    director: m.director || "",
                    cast: m.cast || "",
                  }));

                  const formattedRecords =
                    markerStart +
                    "\n" +
                    cleanRecords
                      .map((record) => {
                        const entries = Object.entries(record)
                          .filter(([, v]) => v !== undefined && v !== "")
                          .map(
                            ([k, v]) =>
                              `  ${k}: ${typeof v === "number" ? v : JSON.stringify(v)},`,
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

