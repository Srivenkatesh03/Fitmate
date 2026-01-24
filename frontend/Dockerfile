FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better cache)
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend
COPY frontend/ .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
