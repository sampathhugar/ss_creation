#!/usr/bin/env node
/* ============================================================
   CACHE-BUSTING VERSION BUMPER
   ------------------------------------------------------------
   Updates the ?v=... stamps on local CSS/JS files in index.html
   so browsers always download the latest version after a deploy.

   HOW TO RUN (from inside the ss_creation folder):
       node bump-versions.js

   It uses each file's CONTENT HASH as the version, so:
     - Files you changed get a NEW stamp automatically.
     - Files you did not touch keep the same stamp.
   Just run it before every push — no manual editing needed.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const HTML_FILE = path.join(ROOT, 'index.html');

if (!fs.existsSync(HTML_FILE)) {
    console.error('Could not find index.html next to this script.');
    process.exit(1);
}

let html = fs.readFileSync(HTML_FILE, 'utf8');

// Matches  href="styles.css"  or  src="script.js?v=abc"  for LOCAL .css/.js files only
// (skips anything starting with http:// or https://).
const ASSET_RE = /(href|src)="((?!https?:\/\/)[^"?]+\.(?:css|js))(\?v=[^"]*)?"/g;

const changes = [];
const seen = [];

html = html.replace(ASSET_RE, (match, attr, file, oldQuery) => {
    const filePath = path.join(ROOT, file);

    if (!fs.existsSync(filePath)) {
        console.warn(`  skipped (file not found): ${file}`);
        return match;
    }

    // Short hash of the file's contents = its version
    const hash = crypto.createHash('md5')
        .update(fs.readFileSync(filePath))
        .digest('hex')
        .slice(0, 8);

    const newQuery = `?v=${hash}`;
    const oldVer = oldQuery ? oldQuery.replace('?v=', '') : '(none)';

    if (oldQuery !== newQuery) {
        changes.push(`  ${file}:  ${oldVer}  ->  ${hash}`);
    }
    seen.push(file);

    return `${attr}="${file}${newQuery}"`;
});

fs.writeFileSync(HTML_FILE, html);

console.log(`Scanned ${seen.length} local CSS/JS file(s) referenced in index.html.`);
if (changes.length) {
    console.log('\nUpdated version stamps (files that changed):');
    changes.forEach(c => console.log(c));
    console.log('\nDone. Commit & push index.html (and your changed files).');
} else {
    console.log('\nNo changes — every stamp already matches its file. Nothing to push.');
}
