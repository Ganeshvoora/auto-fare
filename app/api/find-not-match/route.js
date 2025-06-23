// app/api/find-uncommon-images/route.js
import { NextResponse } from 'next/server';
import * as faceapi from 'face-api.js';
import clientPromise from '../../../lib/mongodb';
import { ensureModelsLoaded, base64ToImage } from '../../../lib/face-api-setup';

const SIMILARITY_THRESHOLD = 0.6;

export async function GET(req) {
  // Ensure models are loaded before doing anything
  await ensureModelsLoaded();
  console.log('Starting uncommon images check...');

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // --- STAGE 1: GET ALL FACES FROM THE "SELFIES" COLLECTION ---
    console.log('Stage 1: Processing "selfies" collection...');
    const selfiesCollection = db.collection('selfies'); // <-- Change if your selfie collection has a different name
    const selfieDocs = await selfiesCollection.find({}).toArray();
    
    const knownFaceDescriptors = [];
    for (const selfieDoc of selfieDocs) {
      try {
        const image = await base64ToImage(selfieDoc.image_base64);
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
        if (detection) {
          knownFaceDescriptors.push(detection.descriptor);
        }
      } catch(e) {
        console.error(`Could not process a selfie image (ID: ${selfieDoc._id}): ${e.message}`);
      }
    }

    if (knownFaceDescriptors.length === 0) {
      return NextResponse.json({ error: 'No faces could be processed from the "selfies" collection.' }, { status: 404 });
    }
    console.log(`Found ${knownFaceDescriptors.length} unique face descriptors in the selfies collection.`);

    // Create a FaceMatcher that knows about all the selfie faces
    const labeledDescriptors = knownFaceDescriptors.map((descriptor, i) => new faceapi.LabeledFaceDescriptors(`person_${i}`, [descriptor]));
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 1 - SIMILARITY_THRESHOLD);

    // --- STAGE 2: CHECK THE "IMAGES" COLLECTION FOR UNCOMMON PHOTOS ---
    console.log('Stage 2: Processing "images" collection...');
    const imagesCollection = db.collection('images'); // <-- Change if your main image collection has a different name
    const imageDocs = await imagesCollection.find({}).toArray();

    const uncommonImages = []; // Array to store the results
    for (const imageDoc of imageDocs) {
      let isCommonImage = false; // Flag to check if a known face is in this image

      try {
        const targetImage = await base64ToImage(imageDoc.image_base64);
        const detections = await faceapi.detectAllFaces(targetImage).withFaceLandmarks().withFaceDescriptors();

        for (const detection of detections) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          // If the match is not "unknown", it means we found a selfie person
          if (bestMatch.label !== 'unknown') {
            console.log(`Common face found in image ${imageDoc._id}. Skipping.`);
            isCommonImage = true;
            break; // Found a match, no need to check other faces in this image
          }
        }
      } catch (e) {
        console.error(`Could not process an image (ID: ${imageDoc._id}): ${e.message}`);
      }

      // If after checking all faces, none were common, add it to our list
      if (!isCommonImage) {
        console.log(`Image ID ${imageDoc._id} is uncommon. Adding to results.`);
        uncommonImages.push({
          _id: imageDoc._id.toString(),
          timestamp: imageDoc.timestamp,
          filename: imageDoc.filename,
        });
      }
    }

    // --- STAGE 3: RETURN THE RESULT ---
    return NextResponse.json({ uncommonImages });

  } catch (error) {
    console.error('An error occurred in the find-uncommon-images endpoint:', error);
    return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
  }
}