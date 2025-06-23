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
    const selfyCollection = db.collection('selfy');
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
            selfyCollection.insertOne({
              imageData: userImageBase64,
              matchedImageId: dbImage._id,
              timestamp: new Date(),
            });
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