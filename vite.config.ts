import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv, type Plugin} from 'vite';

function saveSystemPlugin(): Plugin {
  return {
    name: 'save-system-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const content = typeof payload.saveData === 'string' ? payload.saveData : JSON.stringify(payload, null, 2);
              const savesDir = path.resolve(process.cwd(), 'saves');
              if (!fs.existsSync(savesDir)) {
                fs.mkdirSync(savesDir, { recursive: true });
              }
              const targetFile = path.join(savesDir, 'save.txt');
              fs.writeFileSync(targetFile, content, 'utf-8');
              const rootSavesFile = path.resolve(process.cwd(), 'saves.txt');
              fs.writeFileSync(rootSavesFile, content, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Game saved to saves/save.txt and saves.txt', file: 'saves/save.txt' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/load' && req.method === 'GET') {
          try {
            const savesDir = path.resolve(process.cwd(), 'saves');
            const targetFile = path.join(savesDir, 'save.txt');
            if (fs.existsSync(targetFile)) {
              const content = fs.readFileSync(targetFile, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: content, file: 'saves/save.txt' }));
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'No save file found in saves/save.txt' }));
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        if (req.url === '/api/saves' && req.method === 'GET') {
          try {
            const savesDir = path.resolve(process.cwd(), 'saves');
            const targetFile = path.join(savesDir, 'save.txt');
            const exists = fs.existsSync(targetFile);
            let size = 0;
            let mtime: string | null = null;
            if (exists) {
              const stat = fs.statSync(targetFile);
              size = stat.size;
              mtime = stat.mtime.toISOString();
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              exists,
              file: 'saves/save.txt',
              size,
              lastModified: mtime
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), saveSystemPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
