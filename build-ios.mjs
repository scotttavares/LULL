import { mkdirSync, rmSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";

// Assemble the Capacitor web directory (www/) from the built web app (public/).
// The iOS app opens straight into the breathing experience, so www/index.html IS app.html.
const pub = "public";
const out = "www";

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// index.html = the breathing app (app.html), minus the service-worker registration
// (WKWebView doesn't run SWs for in-app content; dropping it avoids a stale cache).
let html = readFileSync(`${pub}/app.html`, "utf8");
html = html.replace(/\s*<script>\s*if \('serviceWorker' in navigator\)[\s\S]*?<\/script>/, "");
writeFileSync(`${out}/index.html`, html);

// the JS bundle + the static files the app references
cpSync(`${pub}/assets`, `${out}/assets`, { recursive: true });
for (const f of ["manifest.webmanifest", "apple-touch-icon.png", "favicon-32.png", "icon-192.png", "icon-512.png"]) {
  if (existsSync(`${pub}/${f}`)) cpSync(`${pub}/${f}`, `${out}/${f}`);
}

console.log("assembled -> www/ (iOS web bundle, entry = app.html)");