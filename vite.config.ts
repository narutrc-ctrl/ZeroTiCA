import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function readJsonBody(req: import("http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function contactApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "zerotica-contact-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (url !== "/api/contact" && url !== "/api/contact/") {
          next();
          return;
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        try {
          const mod = await import(pathToFileURL(path.resolve(rootDir, "api/_lib/sendMail.js")).href);
          const body = await readJsonBody(req);
          const validation = mod.validateInquiry(body);
          if (!validation.ok) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: validation.error, details: validation.details }));
            return;
          }

          await mod.sendContactInquiry(validation.data, env);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, message: "문의가 접수되었습니다." }));
        } catch (err) {
          console.error("[contact] local send failed:", err);
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), contactApiPlugin(env)],
    base: "/",
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5174,
    },
  };
});
