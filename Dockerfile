# -------------------------
# 1) Build Stage
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (improves caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Build NestJS project (outputs dist folder)
RUN npm run build


# -------------------------
# 2) Production Stage
# -------------------------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only necessary node modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy only built dist files
COPY --from=builder /app/dist ./dist

# Copy package files
COPY package*.json ./

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
