import { env, pipeline } from '@huggingface/transformers';
import { MODEL_ID } from './prompts.js';

env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.wasmPaths = new URL('../onnx/', self.location.href).href;
let generatorPromise;

self.onmessage = async ({ data }) => {
  try {
    generatorPromise ??= pipeline('text-generation', MODEL_ID, {
      dtype: 'q4', device: 'wasm',
      progress_callback: progress => {
        if (progress.status === 'progress') self.postMessage({ type: 'progress', file: progress.file, progress: progress.progress });
        else self.postMessage({ type: 'status', status: progress.status });
      },
    });
    const generator = await generatorPromise;
    self.postMessage({ type: 'generating' });
    const output = await generator(data.messages, { max_new_tokens: 100, do_sample: false, repetition_penalty: 1.12, return_full_text: false });
    const generated = output[0].generated_text;
    const content = typeof generated === 'string' ? generated : generated.at(-1).content;
    self.postMessage({ type: 'result', text: content.trim(), requestId: data.requestId });
  } catch (error) {
    generatorPromise = undefined;
    self.postMessage({ type: 'error', message: 'The on-device model could not load. Check your connection and allow Hugging Face downloads, then try again. Verified hints still work offline.', requestId: data.requestId });
  }
};
