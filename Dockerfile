# UTMB Analytics Dashboard - Simple Node.js Build
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy all source files
COPY . .

# Build the React app
RUN npm run build

# Expose port 4173 (Vite preview default)
EXPOSE 4173

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]