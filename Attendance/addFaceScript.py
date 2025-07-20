import cv2
import numpy as np
import os
import sys
import json
import base64

# Access primary webcam
video = cv2.VideoCapture(0)
if not video.isOpened():
    print(json.dumps({"error": "Could not access the webcam."}))
    sys.exit(1)

# Load Haar cascade for face detection
haar_path = 'C:\\Users\\91829\\Desktop\\DEV\\RESPRO\\VISUAL\\Attendance\\haarcascade_frontalface_default.xml'
if not os.path.exists(haar_path):
    print(json.dumps({"error": f"Haar cascade file not found at {haar_path}"}))
    sys.exit(1)

facedetect = cv2.CascadeClassifier(haar_path)

faces_data = []
i = 0

# Get user input (or from arguments)
name = sys.argv[1] if len(sys.argv) > 1 else input("Enter Name: ")
rollNo = sys.argv[2] if len(sys.argv) > 2 else input("Enter Enrollment_No: ")

while True:
    ret, frame = video.read()
    if not ret:
        print(json.dumps({"error": "Could not read frame from webcam."}))
        break

    # Convert image to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.5, 6)

    for (x_coorinate, y_coordinate, width, height) in faces:
        # Crop image
        crop_img = frame[y_coordinate:y_coordinate + height, x_coorinate:x_coorinate + width, :]
        
        # Resize image
        resized_img = cv2.resize(crop_img, (50, 50))

        if len(faces_data) <= 50 and i % 5 == 0:
            faces_data.append(resized_img)

        i = i + 1

        # Show number of frames captured
        cv2.putText(frame, str(len(faces_data)), (50, 50), cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 0), 1)
        
        # Draw box around face
        cv2.rectangle(frame, (x_coorinate, y_coordinate), (x_coorinate + width, y_coordinate + height), (0, 0, 0), 2)
    
    cv2.imshow("Frame", frame)
    
    k = cv2.waitKey(1)
    if k == ord(' ') or len(faces_data) == 50:
        break

video.release()
cv2.destroyAllWindows()

# Convert face data to NumPy array
faces_data = np.asarray(faces_data)

# Reshape to flat array with exactly 50x50x3 elements per face
# This is the key fix - ensure each face is stored as a flat array of 7500 elements
faces_data = faces_data.reshape(-1, 50 * 50 * 3)  # Shape will be (n_faces, 7500)

# Convert to bytes and encode as base64
faces_bytes = faces_data.tobytes()
encoded_faces = base64.b64encode(faces_bytes).decode('utf-8')

# Output result for Node.js
print(json.dumps({
    "status": "success",
    "name": name,
    "rollNo": rollNo,
    "encodedFaces": encoded_faces
}))
