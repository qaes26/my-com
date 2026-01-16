# Base image with Node.js
FROM node:18-slim

# Install compliers (GCC/G++) and Python for 'direct' execution mode
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Python libraries
RUN pip3 install numpy pandas matplotlib scipy --break-system-packages

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy server code
COPY . .

# Create temp directory
RUN mkdir -p temp_code

# Environment variable to tell server to run in direct mode
ENV EXECUTION_MODE=direct
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "server.js"]
