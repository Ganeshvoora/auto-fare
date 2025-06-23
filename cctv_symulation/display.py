# import cv2
# import numpy as np
# from pymongo import MongoClient

# # MongoDB Atlas connection
# mongo_uri = "mongodb+srv://venkatasaiganeshvoora:hdGK9nunsP1HIoa5@leaening.iggqf65.mongodb.net/bus"
# client = MongoClient(mongo_uri)
# db = client["bus"]
# collection = db["images"]

# # Fetch the latest image document
# doc = collection.find_one(sort=[("timestamp", -1)])  # Most recent image

# if doc and "image" in doc:
#     img_bytes = doc["image"]  # Binary JPEG
#     nparr = np.frombuffer(img_bytes, np.uint8)  # Convert to NumPy array
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Decode image

#     if img is not None:
#         # Display the image
#         cv2.imshow("Retrieved Image", img)
#         cv2.waitKey(0)
#         cv2.destroyAllWindows()
#     else:
#         print("❌ Failed to decode image")
# else:
#     print("❌ No image found in the database")


# import cv2
# import numpy as np
# from pymongo import MongoClient

# # MongoDB Atlas connection
# mongo_uri = "mongodb+srv://venkatasaiganeshvoora:hdGK9nunsP1HIoa5@leaening.iggqf65.mongodb.net/bus"
# client = MongoClient(mongo_uri)
# db = client["bus"]
# collection = db["images"]

# # Get last 10 images sorted by timestamp (descending)
# docs = collection.find().sort("timestamp", -1).limit(10)

# # Display each image one-by-one
# for i, doc in enumerate(docs, 1):
#     if "image" in doc:
#         img_bytes = doc["image"]
#         nparr = np.frombuffer(img_bytes, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#         if img is not None:
#             cv2.imshow(f"Image {i}", img)
#             print(f"🖼 Showing image {i} | Timestamp: {doc['timestamp']}")
#             cv2.waitKey(2000)  # Show each image for 2 seconds
#             cv2.destroyWindow(f"Image {i}")
#         else:
#             print(f"❌ Could not decode image {i}")
#     else:
#         print(f"⚠️ No image data in document {i}")

# cv2.destroyAllWindows()


import cv2
import numpy as np
import base64
from pymongo import MongoClient

# MongoDB Atlas connection
mongo_uri = "mongodb+srv://venkatasaiganeshvoora:hdGK9nunsP1HIoa5@leaening.iggqf65.mongodb.net/bus"
client = MongoClient(mongo_uri)
db = client["bus"]
collection = db["images"]

# Get last 10 images sorted by timestamp (descending)
docs = collection.find().sort("timestamp", -1).limit(10)

# Display each image one-by-one
for i, doc in enumerate(docs, 1):
    if "image_base64" in doc:  # Use Base64 field
        # Decode Base64 to binary
        img_bytes = base64.b64decode(doc["image_base64"])
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is not None:
            cv2.imshow(f"Image {i}", img)
            print(f"🖼 Showing image {i} | Timestamp: {doc['timestamp']}")
            cv2.waitKey(2000)  # Show each image for 2 seconds
            cv2.destroyWindow(f"Image {i}")
        else:
            print(f"❌ Could not decode image {i}")
    else:
        print(f"⚠️ No Base64 image data in document {i}")

cv2.destroyAllWindows()
