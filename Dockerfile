FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy environment files
COPY .env.github ./

# Set up git configuration
RUN git config --global user.name "Memara" && \
    git config --global user.email "github@memara.io" && \
    git config --global init.defaultBranch main

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY gulpfile.js ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Initialize git repository and set up GitHub authentication
RUN git init && \
    if [ -f .env.github ]; then \
        export GITHUB_TOKEN=$(cat .env.github) && \
        git remote add origin https://${GITHUB_TOKEN}@github.com/memara-memory/n8n-nodes-memara.git && \
        git config --global credential.helper store && \
        echo "https://${GITHUB_TOKEN}@github.com" > ~/.git-credentials; \
    fi

# Install n8n globally for testing
RUN npm install -g n8n

# Expose n8n default port
EXPOSE 5678

# Default command for development
CMD ["sh", "-c", "npm run build && n8n start"] 