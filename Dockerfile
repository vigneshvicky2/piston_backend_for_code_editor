FROM node:18

WORKDIR /app
COPY . .

# Install dependencies
RUN npm install --prefix api

# Create writable isolate directory
RUN mkdir -p /tmp/isolate

# Set environment variables
ENV PISTON_DATA_DIRECTORY=./data
ENV PISTON_SANDBOX_DIRECTORY=/tmp/isolate

EXPOSE 2000

CMD ["node", "api/src/index.js"]
