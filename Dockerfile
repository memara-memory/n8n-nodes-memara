FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY gulpfile.js ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Install n8n globally for testing
RUN npm install -g n8n

# Expose n8n default port
EXPOSE 5678

# Default command for development
CMD ["npm", "run", "dev"] 