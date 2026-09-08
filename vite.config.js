import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const INCLUDE_RE = /<!--\s*@include\s+([^\s]+)\s*-->/g;
const isGitHubPages = process.env.GITHUB_PAGES === '1';

function resolveIncludes(source, rootDir, seen = new Set()) {
  return source.replace(INCLUDE_RE, (_, rel) => {
    const file = path.resolve(rootDir, rel.trim());
    if (seen.has(file)) {
      throw new Error(`Циклический include: ${file}`);
    }
    if (!fs.existsSync(file)) {
      throw new Error(`Include не найден: ${file}`);
    }
    const next = new Set(seen);
    next.add(file);
    const html = fs.readFileSync(file, 'utf8');
    return resolveIncludes(html, rootDir, next);
  });
}

function htmlIncludes() {
  return {
    name: 'html-includes',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const rootDir = path.dirname(ctx.filename);
        return resolveIncludes(html, rootDir);
      },
    },
    configureServer(server) {
      const htmlDir = path.resolve(server.config.root, 'html');
      server.watcher.add(htmlDir);
      server.watcher.on('change', (file) => {
        if (file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload', path: '/' });
        }
      });
    },
  };
}

function copyJs(base) {
  return {
    name: 'copy-js',
    apply: 'build',
    closeBundle() {
      fs.cpSync(path.resolve('js'), path.resolve('dist/js'), { recursive: true });
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (base === '/') return html;
        return html.replaceAll('src="/js/', `src="${base}js/`);
      },
    },
  };
}

export default defineConfig({
  root: '.',
  base: isGitHubPages ? '/insol/' : '/',
  publicDir: false,
  plugins: [htmlIncludes(), copyJs(isGitHubPages ? '/insol/' : '/')],
  server: {
    host: true,
    port: 3000,
    open: true,
    cors: true,
  },
  preview: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
