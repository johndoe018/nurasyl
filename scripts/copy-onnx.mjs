import { mkdir, copyFile, readdir } from 'node:fs/promises';

// Serve the WebAssembly runtime locally, including on GitHub Pages. No CDN script execution.
const source = new URL('../node_modules/onnxruntime-web/dist/', import.meta.url);
const destination = new URL('../public/onnx/', import.meta.url);
await mkdir(destination, { recursive: true });
for (const file of await readdir(source)) {
  if (/^ort-wasm.*\.(wasm|mjs)$/.test(file)) {
    await copyFile(new URL(file, source), new URL(file, destination));
  }
}
console.log('Local ONNX WebAssembly runtime prepared.');
