FROM node:18-alpine AS build

# Set working directory
WORKDIR /webapp

# Copy package.json and yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the Vite project
RUN yarn run build

# Use the build files to preview the application
CMD ["yarn", "run", "preview"]
