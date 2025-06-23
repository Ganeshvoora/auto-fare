import cv2
import time
import base64
from pymongo import MongoClient
from datetime import datetime

# MongoDB Atlas connection
mongo_uri = "mongodb+srv://venkatasaiganeshvoora:hdGK9nunsP1HIoa5@leaening.iggqf65.mongodb.net/bus"  # Replace with your MongoDB URI
client = MongoClient(mongo_uri)
db = client["bus"]
collection = db["images"]

# Open webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Could not open webcam")
    exit()

print("📸 Starting to capture images every 10 seconds. Press Ctrl+C to stop.")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Failed to capture frame")
            continue

        # Convert to Base64
        _, buffer = cv2.imencode(".jpg", frame)
        image_base64 = base64.b64encode(buffer.tobytes()).decode('utf-8')

        # Save to MongoDB
        doc = {
            "filename": f"selfie_{datetime.utcnow().isoformat()}.jpg",
            "timestamp": datetime.utcnow(),
            "image_base64": "data:image/jpeg;base64,"+image_base64
        }
        result = collection.insert_one(doc)
        print(f"✅ Image stored with ID: {result.inserted_id}")

        time.sleep(5)  # Wait 10 seconds

except KeyboardInterrupt:
    print("🛑 Stopped by user.")

finally:
    cap.release()
    cv2.destroyAllWindows()