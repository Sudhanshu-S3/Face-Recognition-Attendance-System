FROM node:18

# Install Python, OpenCV dependencies, and build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    libgl1-mesa-glx \
    libglib2.0-0 \
    cmake \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Set up Python virtual environment and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy Python requirements and install Python dependencies
COPY req.txt .
RUN pip3 install --no-cache-dir -r req.txt

# Copy the rest of the application
COPY . .

# Create required directories for attendance script
RUN mkdir -p Attendance
# You may need to copy actual attendance scripts and haar cascade files here if needed

# Expose the port the app will run on
EXPOSE 5000

# Command to run the application
CMD ["node", "src/server.js"]