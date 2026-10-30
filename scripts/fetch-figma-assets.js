#!/usr/bin/env node
// Downloads the product photos referenced by src/data/products.js from Figma.
//
//   node scripts/fetch-figma-assets.js
//
// The Figma MCP asset URLs below are temporary (they expire ~7 days after they were
// generated). If a download returns 403/404, re-export the images from Figma
// (select the ProductImage layers -> Export PNG) or ask for fresh URLs. Downloads are
// converted to lossless WebP; cwebp must be available on PATH.

const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);

const HOME = 'https://www.figma.com/api/mcp/asset/d751d064-3503-4c9d-b7c6-895f44330f55';

const ASSETS = [
  ['fluffy-cashmere-cardigan/purple.webp', `${HOME}/6d3f6.png`],
  ['souffle-yarn-triangle-scarf/main.webp', `${HOME}/e60c5.png`],
  ['puck-cream-cheese/main.webp', `${HOME}/995c8.png`],
  ['heinz-pasta/main.webp', `${HOME}/78964.png`],
  ['jbl-tune-720bt/main.webp', `${HOME}/0b91c.png`],
  ['apple-tv-4th-gen/main.webp', `${HOME}/40db9.png`],
  ['apple-pencil-pro/main.webp', `${HOME}/e91b3.png`],
  ['apple-smart-keyboard/main.webp', `${HOME}/dc8ea.png`],
];

async function main() {
  const dir = path.join(__dirname, '..', 'assets', 'images');
  await fs.mkdir(dir, { recursive: true });

  let failed = 0;
  for (const [name, url] of ASSETS) {
    const targetPath = path.join(dir, name);
    const sourcePath = path.join(dir, `.source-${process.pid}-${path.basename(name).replace(/\.webp$/i, '.png')}`);
    try {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.writeFile(sourcePath, Buffer.from(await res.arrayBuffer()));
      await execFileAsync('cwebp', [
        '-lossless',
        '-exact',
        sourcePath,
        '-o',
        targetPath,
      ]);
      console.log(`ok    ${name}`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL  ${name} (${err.message})`);
    } finally {
      await fs.rm(sourcePath, { force: true });
    }
  }

  if (failed) {
    console.error(`\n${failed} asset(s) failed — see the note at the top of this file.`);
    process.exit(1);
  }
}

main();
