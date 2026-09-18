import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const INCLUDE_RE = /<!--\s*@include\s+([^\s]+)\s*-->/g;
const isGitHubPages = process.env.GITHUB_PAGES === '1';

const SOLUTION_PAGES = {
  'proektnaya-kompaniya.html': {
    title: 'Проектная компания',
    slug: 'proektnaya-kompaniya',
    box2: 'box-2.webp',
  },
  'solution.html': {
    title: 'Проектная компания',
    slug: 'proektnaya-kompaniya',
    box2: 'box-2.webp',
  },
  'stroitelnaya-kompaniya.html': {
    title: 'Строительная компания',
    slug: 'stroitelnaya-kompaniya',
  },
  'remont-kvartir.html': {
    title: 'Ремонт квартир под ключ',
    slug: 'remont-kvartir',
  },
  'transportno-logisticheskaya.html': {
    title: 'Транспортно-логистическая компания',
    slug: 'transportno-logisticheskaya',
  },
  'mebelnoe-proizvodstvo.html': {
    title: 'Мебельное производство',
    slug: 'mebelnoe-proizvodstvo',
  },
  'proizvodstvo-dverey.html': {
    title: 'Производство и монтаж дверей',
    slug: 'proizvodstvo-dverey',
  },
  'proizvodstvo-okon.html': {
    title: 'Производство и продажа окон',
    slug: 'proizvodstvo-okon',
  },
  'proizvodstvo-kuhon.html': {
    title: 'Производство и продажа кухонь',
    slug: 'proizvodstvo-kuhon',
  },
  'gazovoe-oborudovanie.html': {
    title: 'Обслуживание газового оборудования',
    slug: 'gazovoe-oborudovanie',
  },
};

function applySolutionPlaceholders(html, filename) {
  const data = SOLUTION_PAGES[path.basename(filename)];
  if (!data) return html;
  const dir = `/images/solutions/${data.slug}`;
  return html
    .replaceAll('{{solutionTitle}}', data.title)
    .replaceAll('{{solutionSlug}}', data.slug)
    .replaceAll('{{solutionDir}}', dir)
    .replaceAll('{{solutionBox1}}', `${dir}/${data.box1 || 'box-1.png'}`)
    .replaceAll('{{solutionBox2}}', `${dir}/${data.box2 || 'box-2.png'}`);
}

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
        return applySolutionPlaceholders(resolveIncludes(html, rootDir), ctx.filename);
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

function withSiteBase(html, base) {
  if (!base || base === '/') return html;
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;

  const rewriteUrl = (url) => {
    if (!url.startsWith('/') || url.startsWith('//') || url.startsWith(prefix + '/') || url === prefix) {
      return url;
    }
    return prefix + url;
  };

  return html
    .replace(/\b(href|src|poster|action)=["'](\/(?!\/)[^"']*)["']/g, (match, attr, url) => {
      const next = rewriteUrl(url);
      return next === url ? match : `${attr}="${next}"`;
    })
    .replace(/\bsrcset=["']([^"']+)["']/g, (match, value) => {
      const next = value.replace(/(^|,\s*)(\/(?!\/)[^\s,]*)/g, (_, sep, url) => `${sep}${rewriteUrl(url)}`);
      return next === value ? match : `srcset="${next}"`;
    });
}

function copyStatic(base) {
  return {
    name: 'copy-static',
    apply: 'build',
    closeBundle() {
      fs.cpSync(path.resolve('js'), path.resolve('dist/js'), { recursive: true });
      fs.cpSync(path.resolve('images'), path.resolve('dist/images'), { recursive: true });
      if (fs.existsSync(path.resolve('fonts'))) {
        fs.cpSync(path.resolve('fonts'), path.resolve('dist/fonts'), { recursive: true });
      }
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return withSiteBase(html, base);
      },
    },
    generateBundle(_options, bundle) {
      if (!base || base === '/') return;
      const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.css')) continue;
        const source = String(chunk.source);
        const next = source.replace(/url\(\s*(['"]?)(\/(?!\/)[^'")\s]+)\1\s*\)/g, (match, quote, url) => {
          if (url.startsWith(prefix + '/')) return match;
          return `url(${quote}${prefix}${url}${quote})`;
        });
        if (next !== source) chunk.source = next;
      }
    },
  };
}

export default defineConfig({
  root: '.',
  base: isGitHubPages ? '/insol/' : '/',
  publicDir: false,
  plugins: [htmlIncludes(), copyStatic(isGitHubPages ? '/insol/' : '/')],
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
        main: path.resolve('index.html'),
        solution: path.resolve('solution.html'),
        proektnayaKompaniya: path.resolve('proektnaya-kompaniya.html'),
        stroitelnayaKompaniya: path.resolve('stroitelnaya-kompaniya.html'),
        remontKvartir: path.resolve('remont-kvartir.html'),
        transportnoLogisticheskaya: path.resolve('transportno-logisticheskaya.html'),
        mebelnoeProizvodstvo: path.resolve('mebelnoe-proizvodstvo.html'),
        proizvodstvoDverey: path.resolve('proizvodstvo-dverey.html'),
        proizvodstvoOkon: path.resolve('proizvodstvo-okon.html'),
        proizvodstvoKuhon: path.resolve('proizvodstvo-kuhon.html'),
        gazovoeOborudovanie: path.resolve('gazovoe-oborudovanie.html'),
        implementation: path.resolve('implementation.html'),
        razovyeRaboty: path.resolve('razovye-raboty.html'),
        contacts: path.resolve('contacts.html'),
        support: path.resolve('support.html'),
      },
    },
  },
});
