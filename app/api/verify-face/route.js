// // app/api/verify-face/route.js
// import { NextResponse } from 'next/server';
// import * as faceapi from 'face-api.js';
// import clientPromise from '../../../lib/mongodb';
// import { loadFaceApiModels, base64ToImage } from '../../../lib/face-api-setup';

// const SIMILARITY_THRESHOLD = 0.6; // Confidence threshold (0.6 is a good starting point)

// // Load models on server startup
// loadFaceApiModels();

// // This is your main API function
// export async function POST(req) {
//   try {
//     // 1. Get the user's selfie image from the request
//     const { image: userImageBase64 } = await req.json();
//     if (!userImageBase64) {
//       return NextResponse.json({ error: 'Image data is required.' }, { status: 400 });
//     }

//     // 2. Generate a face descriptor for the user's selfie
//     const userImage = await base64ToImage(userImageBase64);
//     const userFaceDescriptor = await faceapi
//       .detectSingleFace(userImage)
//       .withFaceLandmarks()
//       .withFaceDescriptors();

//     if (!userFaceDescriptor) {
//       return NextResponse.json({ error: 'No face detected in the provided image.' }, { status: 400 });
//     }

//     // 3. Connect to DB and fetch the last 10 photos
//     const client = await clientPromise;
//     const db = client.db(); // Use the default DB from your connection string
//     const collection = db.collection('images'); // Or whatever your collection is named

//     console.log('Fetching last 10 images from database...');
//     const dbImages = await collection
//       .find({})
//       .sort({ timestamp: -1 }) // Sort by timestamp, newest first
//       .limit(10) // Get only 10
//       .toArray();

//     if (dbImages.length === 0) {
//         return NextResponse.json({ error: 'No images found in database to compare against.' }, { status: 404 });
//     }

//     const faceMatcher = new faceapi.FaceMatcher(userFaceDescriptor);

//     // 4. Loop through DB images and compare
//     for (const dbImage of dbImages) {
//       console.log(`Processing DB image ID: ${dbImage._id}`);
//       try {
//         const targetImage = await base64ToImage(dbImage.image_base64); // Assumes field is named 'image_base64'
//         const detections = await faceapi
//           .detectAllFaces(targetImage)
//           .withFaceLandmarks()
//           .withFaceDescriptors();

//         for (const descriptor of detections) {
//           const bestMatch = faceMatcher.findBestMatch(descriptor.descriptor);
//           console.log(`Comparing... Label: ${bestMatch.label}, Distance: ${bestMatch.distance.toFixed(2)}`);
//           if (bestMatch.distance < (1 - SIMILARITY_THRESHOLD)) {
//             // Match found!
//             return NextResponse.json({
//               match: true,
//               matchedImageId: dbImage._id.toString(),
//               confidence: 1 - bestMatch.distance,
//             });
//           }
//         }
//       } catch (e) {
//         console.error(`Skipping image ${dbImage._id} due to processing error:`, e.message);
//       }
//     }

//     // 5. If no match is found after checking all 10 images
//     console.log('No match found in the last 10 images.');
//     return NextResponse.json({ match: false });

//   } catch (error) {
//     console.error('An error occurred in the verify-face endpoint:', error);
//     return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
//   }
// }

// // app/api/verify-face/route.js
// import { NextResponse } from 'next/server';
// import * as faceapi from 'face-api.js';
// import clientPromise from '../../../lib/mongodb';
// import { loadFaceApiModels, base64ToImage } from '../../../lib/face-api-setup';

// const SIMILARITY_THRESHOLD = 0.6; // Confidence threshold (0.6 is a good starting point)

// // Load models on server startup
// loadFaceApiModels();

// export async function POST(req) {
//   try {
//     // 1. Get the user's selfie image from the request
//     const { image: userImageBase64 } = await req.json();
//     if (!userImageBase64) {
//       return NextResponse.json({ error: 'Image data is required.' }, { status: 400 });
//     }

//     // 2. Generate a face descriptor for the user's selfie
//     const userImage = await base64ToImage(userImageBase64);

//     // --- THIS BLOCK IS NOW CORRECTED ---
//     const userFaceResult = await faceapi
//       .detectSingleFace(userImage)
//       .withFaceLandmarks()
//       .withFaceDescriptor(); // Corrected to singular "withFaceDescriptor"

//     if (!userFaceResult) {
//       return NextResponse.json({ error: 'No face detected in the provided image.' }, { status: 400 });
//     }
//     // --- END OF CORRECTION ---

//     // 3. Connect to DB and fetch the last 10 photos
//     const client = await clientPromise;
//     const db = client.db();
//     const collection = db.collection('images');
//     console.log('Fetching last 10 images from database...');
//     const dbImages = await collection
//       .find({})
//       .sort({ timestamp: -1 })
//       .limit(10)
//       .toArray();

//     if (dbImages.length === 0) {
//       return NextResponse.json({ error: 'No images found in database to compare against.' }, { status: 404 });
//     }

//     // Create a FaceMatcher from the user's selfie
//     const faceMatcher = new faceapi.FaceMatcher(userFaceResult);

//     // 4. Loop through DB images and compare
//     for (const dbImage of dbImages) {
//       console.log(`Processing DB image ID: ${dbImage._id}`);
//       try {
//         const targetImage = await base64ToImage(dbImage.image_base64);
//         const detections = await faceapi
//           .detectAllFaces(targetImage)
//           .withFaceLandmarks()
//           .withFaceDescriptors();

//         for (const detection of detections) {
//           // Find the best match for each face found in the CCTV image
//           const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
//           console.log(`Comparing... Label: ${bestMatch.label}, Distance: ${bestMatch.distance.toFixed(2)}`);

//           // The distance is the dissimilarity. A lower distance is a better match.
//           // We check if the distance is below our threshold (e.g., 0.4 which is 1 - 0.6)
//           if (bestMatch.label === 'person 1' && bestMatch.distance < (1 - SIMILARITY_THRESHOLD)) {
//             // Match found!
//             return NextResponse.json({
//               match: true,
//               matchedImageId: dbImage._id.toString(),
//               confidence: 1 - bestMatch.distance,
//             });
//           }
//         }
//       } catch (e) {
//         console.error(`Skipping image ${dbImage._id} due to processing error:`, e.message);
//       }
//     }

//     // 5. If no match is found after checking all 10 images
//     console.log('No match found in the last 10 images.');
//     return NextResponse.json({ match: false });

//   } catch (error) {
//     console.error('An error occurred in the verify-face endpoint:', error);
//     return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
//   }
// }

// app/api/verify-face/route.js
import { NextResponse } from 'next/server';
import * as faceapi from 'face-api.js';
import clientPromise from '../../../lib/mongodb';
import { ensureModelsLoaded, base64ToImage } from '../../../lib/face-api-setup';

const SIMILARITY_THRESHOLD = 0.6; 

export async function POST(req) {
  // --- THIS IS THE NEW LINE ---
  // It ensures that we don't proceed until the models are 100% ready.
  await ensureModelsLoaded();
  // --- END OF NEW LINE ---

  try {
    const { image: userImageBase64 } = await req.json();
    if (!userImageBase64) {
      return NextResponse.json({ error: 'Image data is required.' }, { status: 400 });
    }

    const userImage = await base64ToImage(userImageBase64);
    const userFaceResult = await faceapi
      .detectSingleFace(userImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!userFaceResult) {
      return NextResponse.json({ error: 'No face detected in the provided image.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('images');

    console.log('Fetching last 10 images from database...');
    const dbImages = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    if (dbImages.length === 0) {
      return NextResponse.json({ error: 'No images found in database to compare against.' }, { status: 404 });
    }
    
    const faceMatcher = new faceapi.FaceMatcher(userFaceResult);

    for (const dbImage of dbImages) {
      console.log(`Processing DB image ID: ${dbImage._id}`);
      try {
        const targetImage = await base64ToImage(dbImage.image_base64);
        const detections = await faceapi
          .detectAllFaces(targetImage)
          .withFaceLandmarks()
          .withFaceDescriptors();

        for (const detection of detections) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          console.log(`Comparing... Label: ${bestMatch.label}, Distance: ${bestMatch.distance.toFixed(2)}`);
          if (bestMatch.label === 'person 1' && bestMatch.distance < (1 - SIMILARITY_THRESHOLD)) {
            return NextResponse.json({
              match: true,
              matchedImageId: dbImage._id.toString(),
              confidence: 1 - bestMatch.distance,
            });
          }
        }
      } catch (e) {
        console.error(`Skipping image ${dbImage._id} due to processing error:`, e.message);
      }
    }

    console.log('No match found in the last 10 images.');
    return NextResponse.json({ match: false });

  } catch (error) {
    console.error('An error occurred in the verify-face endpoint:', error);
    return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
  }
}