# Use Node.js as the base image
FROM node:20-alpine

# Install Python, pip, and virtualenv
RUN apk add --no-cache python3 py3-pip python3-dev gcc musl-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set up Python virtual environment and install dependencies
WORKDIR /app/scraper
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Set back to main directory
WORKDIR /app

# Build the application
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 4173

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "4173"] 