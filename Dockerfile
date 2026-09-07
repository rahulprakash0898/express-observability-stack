# Use Node.js official image
FROM node:22

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app code
COPY . .

# Expose the app port
EXPOSE 8000

# Start the app
CMD ["node", "index.js"]