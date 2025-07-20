import cv2
import numpy as np
import os
import sys
import json
import requests
from datetime import datetime
from sklearn.neighbors import KNeighborsClassifier

# Access primary webcam
video = cv2.VideoCapture(0)
if not video.isOpened():
    print(json.dumps({"error": "Could not access the webcam."}))
    sys.exit(1)

# Load Haar cascade from argument
haar_path = sys.argv[1] if len(sys.argv) > 1 else 'C://Users//91829//Desktop//DEV//RESPRO//VISUAL//Attendance//haarcascade_frontalface_default.xml'
if not os.path.exists(haar_path):
    print(json.dumps({"error": f"Haar cascade file not found at {haar_path}"}))
    sys.exit(1)

facedetect = cv2.CascadeClassifier(haar_path)

# Fetch face data from backend
url = 'http://localhost:5000/api/attendance/get-faces'
try:
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    if not data.get('success'):
        raise ValueError("Failed to fetch face data")
    NAME = data.get('names', [])
    faces_list = data.get('faces_data', [])
    EROLL = data.get('Eroll', [])
except Exception as e:
    print(json.dumps({"error": f"Error retrieving face data: {str(e)}"}))
    sys.exit(1)

# Validate and normalize face data
if not faces_list or len(NAME) == 0 or len(EROLL) == 0:
    print(json.dumps({"error": "No valid face data available"}))
    sys.exit(1)

expected_length = 50 * 50 * 3  # 7500 for 50x50 RGB image
valid_faces = []
valid_names = []
valid_eroll = []

for i, face in enumerate(faces_list):
    # Handle case where face data is not the expected length
    if len(face) != expected_length:
        # Try to pad or truncate to expected length
        if len(face) > expected_length:
            # Truncate
            normalized_face = face[:expected_length]
            valid_faces.append(normalized_face)
            valid_names.append(NAME[i])
            valid_eroll.append(EROLL[i])
            print(json.dumps({"info": f"Truncated face data for {NAME[i]} from {len(face)} to {expected_length}"}))
        elif len(face) < expected_length:
            # Pad with zeros
            normalized_face = face + [0] * (expected_length - len(face))
            valid_faces.append(normalized_face)
            valid_names.append(NAME[i])
            valid_eroll.append(EROLL[i])
            print(json.dumps({"info": f"Padded face data for {NAME[i]} from {len(face)} to {expected_length}"}))
    else:
        valid_faces.append(face)
        valid_names.append(NAME[i])
        valid_eroll.append(EROLL[i])

if not valid_faces:
    print(json.dumps({"error": "No valid face data after filtering"}))
    sys.exit(1)

FACES = np.array(valid_faces, dtype=np.uint8)
NAME = valid_names
EROLL = valid_eroll

# Train the KNN classifier
knn = KNeighborsClassifier(n_neighbors=1)
knn.fit(FACES, NAME)

attendance_data = None

while True:
    ret, frame = video.read()
    if not ret:
        print(json.dumps({"error": "Could not read frame from webcam."}))
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.5, 6)

    for (x, y, w, h) in faces:
        crop_img = frame[y:y + h, x:x + w, :]
        resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
        output = knn.predict(resized_img)

        timestamp = datetime.now().strftime("%H:%M:%S")
        roll_number = next((EROLL[i] for i in range(len(EROLL)) if str(output[0]) == NAME[i]), "Unknown")
        attendance_data = [str(output[0]), str(roll_number), timestamp]

        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.rectangle(frame, (x, y - 40), (x + w, y), (0, 255, 0), -1)
        cv2.putText(frame, str(output[0]), (x, y - 15), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)

    cv2.imshow("Face Recognition Attendance", frame)
    k = cv2.waitKey(1)
    if k == ord(' '):
        break

video.release()
cv2.destroyAllWindows()

# Output final result
if attendance_data:
    print(json.dumps({
        "status": "success",
        "attendance": {
            "name": attendance_data[0],
            "enrollmentNo": attendance_data[1],
            "timestamp": attendance_data[2]
        }
    }))
else:
    print(json.dumps({"status": "no_detection"}))
