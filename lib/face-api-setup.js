// // lib/face-api-setup.js
// import * as faceapi from 'face-api.js';
// import '@tensorflow/tfjs-node';
// import { canvas, Canvas, Image, ImageData } from 'canvas';
// import path from 'path';

// // Monkey patch the environment for Node.js
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// let modelsLoaded = false;

// export const loadFaceApiModels = async () => {
//   if (modelsLoaded) return;
//   const modelPath = path.join(process.cwd(), 'models');
//   console.log('Loading face-api.js models from:', modelPath);
//   try {
//     await Promise.all([
//       faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
//       faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
//       faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
//     ]);
//     modelsLoaded = true;
//     console.log('Face-api.js models loaded successfully.');
//   } catch (e) {
//     console.error("Fatal: Error loading face-api models.", e);
//     process.exit(1);
//   }
// };

// export const base64ToImage = async (base64) => {
//   return new Promise((resolve, reject) => {
//     if (!base64 || !base64.startsWith('data:image/')) {
//       return reject(new Error('Invalid base64 string: Missing data URI prefix.'));
//     }
//     const image = new Image();
//     image.onload = () => resolve(image);
//     image.onerror = (err) => reject(new Error('Failed to load image from base64 string.'));
//     image.src = base64;
//   });
// };

// lib/face-api-setup.js
import * as faceapi from 'face-api.js';
import '@tensorflow/tfjs-node';
import { canvas, Canvas, Image, ImageData } from 'canvas';
import path from 'path';

// Monkey patch the environment for Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// This promise will hold the single model loading instance.
let modelLoadingPromise = null;

export const ensureModelsLoaded = () => {
  // If the promise already exists, just return it.
  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  // Otherwise, create the promise, store it, and return it.
  modelLoadingPromise = (async () => {
    try {
      const modelPath = path.join(process.cwd(), 'models');
      console.log('Loading face-api.js models from:', modelPath);
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
      ]);
      console.log('Face-api.js models loaded successfully.');
    } catch (e) {
      console.error("Fatal: Error loading face-api models.", e);
      // Exit if models can't be loaded, as the app is non-functional.
      process.exit(1); 
    }
  })();
  
  return modelLoadingPromise;
};

// Start loading the models immediately when the server boots up.
ensureModelsLoaded();


export const base64ToImage = async (base64) => {
  return new Promise((resolve, reject) => {
    if (!base64 || !base64.startsWith('data:image/')) {
      return reject(new Error('Invalid base64 string: Missing data URI prefix.'));
    }
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(new Error('Failed to load image from base64 string.'));
    image.src = base64;
  });
};