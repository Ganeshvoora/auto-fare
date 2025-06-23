// // app/api/find-uncommon-images/route.js
// import { NextResponse } from 'next/server';
// import * as faceapi from 'face-api.js';
// import clientPromise from '../../../lib/mongodb';
// import { ensureModelsLoaded, base64ToImage } from '../../../lib/face-api-setup';

// const SIMILARITY_THRESHOLD = 0.6;

// export async function GET(req) {
//   await ensureModelsLoaded();
//   console.log('--- Request received for find-uncommon-images ---');

//   try {
//     const client = await clientPromise;
//     const db = client.db();
    
//     // --- STAGE 1: GET ALL FACES FROM THE "SELFIES" COLLECTION ---
//     const selfiesCollection = db.collection('selfies'); 
//     const selfieDocs = await selfiesCollection.find({}).toArray();
    
//     if (selfieDocs.length === 0) {
//       return NextResponse.json({ error: 'No documents found in the "selfies" collection.' }, { status: 404 });
//     }
    
//     const knownFaceDescriptors = [];
//     for (const selfieDoc of selfieDocs) {
//       try {
//         // --- THIS IS THE CORRECTED LINE ---
//         // Changed from 'image_base64' to 'imageData' to match your database
//         const selfieImageData = selfieDoc.imageData; 
        
//         if (!selfieImageData) {
//             console.error(`Skipping selfie (ID: ${selfieDoc._id}) because the 'imageData' field is missing or empty.`);
//             continue;
//         }

//         const image = await base64ToImage(selfieImageData);
//         const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

//         if (detection) {
//           knownFaceDescriptors.push(detection.descriptor);
//         } else {
//           console.warn(`Could not detect a face in selfie document with ID: ${selfieDoc._id}`);
//         }
//       } catch(e) {
//         console.error(`Error processing selfie image (ID: ${selfieDoc._id}): ${e.message}`);
//       }
//     }

//     if (knownFaceDescriptors.length === 0) {
//       return NextResponse.json({ error: 'No faces could be processed from the "selfies" collection. Check server logs for details.' }, { status: 404 });
//     }
    
//     console.log(`Successfully processed ${knownFaceDescriptors.length} faces from the selfies collection.`);

//     const labeledDescriptors = knownFaceDescriptors.map((descriptor, i) => new faceapi.LabeledFaceDescriptors(`person_${i}`, [descriptor]));
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 1 - SIMILARITY_THRESHOLD);

//     // --- STAGE 2: CHECK THE "IMAGES" COLLECTION ---
//     const imagesCollection = db.collection('images');
//     const imageDocs = await imagesCollection.find({}).toArray();
//     const uncommonImages = [];

//     for (const imageDoc of imageDocs) {
//       let isCommonImage = false;
//       try {
//         // --- IMPORTANT: CHECK THIS FIELD NAME TOO ---
//         // Make sure the field in your 'images' collection is also named 'imageData'
//         const targetImage = await base64ToImage(imageDoc.imageData); 
        
//         const detections = await faceapi.detectAllFaces(targetImage).withFaceLandmarks().withFaceDescriptors();
//         for (const detection of detections) {
//           const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
//           if (bestMatch.label !== 'unknown') {
//             isCommonImage = true;
//             break;
//           }
//         }
//       } catch (e) {
//         console.error(`Could not process an image (ID: ${imageDoc._id}): ${e.message}`);
//       }

//       if (!isCommonImage) {
//         uncommonImages.push({
//           _id: imageDoc._id.toString(),
//           timestamp: imageDoc.timestamp,
//           filename: imageDoc.filename,
//         });
//       }
//     }

//     return NextResponse.json({ uncommonImages });

//   } catch (error) {
//     console.error('A critical error occurred:', error);
//     return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
//   }
// }

// app/api/find-uncommon-images/route.js
import { NextResponse } from 'next/server';
import * as faceapi from 'face-api.js';
import clientPromise from '../../../lib/mongodb';
import { ensureModelsLoaded, base64ToImage } from '../../../lib/face-api-setup';

const SIMILARITY_THRESHOLD = 0.6;

export async function GET(req) {
  await ensureModelsLoaded();
  console.log('--- Request received for find-uncommon-images ---');

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // --- STAGE 1: GET ALL FACES FROM THE "SELFIES" COLLECTION ---
    const selfiesCollection = db.collection('selfies'); 
    const selfieDocs = await selfiesCollection.find({}).toArray();
    
    if (selfieDocs.length === 0) {
      return NextResponse.json({ error: `No documents found in the 'selfies' collection.` }, { status: 404 });
    }
    
    const knownFaceDescriptors = [];
    for (const selfieDoc of selfieDocs) {
      try {
        const selfieImageData = selfieDoc.imageData; 
        if (!selfieImageData) {
            console.error(`Skipping selfie (ID: ${selfieDoc._id}) because the 'imageData' field is missing or empty.`);
            continue;
        }

        const image = await base64ToImage(selfieImageData);
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
          knownFaceDescriptors.push(detection.descriptor);
        } else {
          console.warn(`Could not detect a face in selfie document with ID: ${selfieDoc._id}`);
        }
      } catch(e) {
        console.error(`Error processing selfie image (ID: ${selfieDoc._id}): ${e.message}`);
      }
    }

    if (knownFaceDescriptors.length === 0) {
      return NextResponse.json({ error: 'No faces could be processed from the "selfies" collection. Check server logs for details.' }, { status: 404 });
    }
    
    console.log(`Successfully processed ${knownFaceDescriptors.length} faces from the selfies collection.`);

    const labeledDescriptors = knownFaceDescriptors.map((descriptor, i) => new faceapi.LabeledFaceDescriptors(`person_${i}`, [descriptor]));
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 1 - SIMILARITY_THRESHOLD);

    // --- STAGE 2: CHECK THE "IMAGES" COLLECTION ---
    const imagesCollection = db.collection('images');
    const imageDocs = await imagesCollection.find({}).toArray();
    const uncommonImages = [];

    for (const imageDoc of imageDocs) {
      let isCommonImage = false;
      try {
        const targetImageData = imageDoc.image_base64; // Using 'image_base64' for consistency
        if (!targetImageData) continue;

        const targetImage = await base64ToImage(targetImageData);
        
        const detections = await faceapi.detectAllFaces(targetImage).withFaceLandmarks().withFaceDescriptors();
        for (const detection of detections) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch.label !== 'unknown') {
            isCommonImage = true;
            break;
          }
        }
      } catch (e) {
        console.error(`Could not process an image (ID: ${imageDoc._id}): ${e.message}`);
      }

      if (!isCommonImage) {
        // *** IMPORTANT CHANGE: ADDING image_base64 TO THE RESPONSE ***
        uncommonImages.push({
          _id: imageDoc._id.toString(),
          timestamp: imageDoc.timestamp,
          filename: imageDoc.filename,
          image_base64: imageDoc.image_base64, // Include the base64 data
        });
      }
    }

    return NextResponse.json({ uncommonImages });

  } catch (error) {
    console.error('A critical error occurred:', error);
    return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
  }
}
