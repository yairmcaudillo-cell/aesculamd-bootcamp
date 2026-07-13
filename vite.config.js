import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// index.html loads app.js/nav.js/data.js as plain (non-module) <script src> tags, on
// purpose — every inline onclick="..." across the app calls a globally-scoped function,
// which type="module" scripts don't expose on window. Vite's build only bundles/copies
// type="module" scripts and asset-pipeline tags (<img>, <link>, etc.), so these three
// plain files never made it into dist/ on their own — this copies them over verbatim.
export default defineConfig({
  plugins: [
    {
      name: 'copy-plain-scripts',
      closeBundle() {
        const destDir = path.resolve(__dirname, 'dist/src');
        mkdirSync(destDir, { recursive: true });
        for (const file of ['data.js', 'app.js', 'nav.js']) {
          copyFileSync(path.resolve(__dirname, 'src', file), path.resolve(destDir, file));
        }
      }
    }
  ]
});
