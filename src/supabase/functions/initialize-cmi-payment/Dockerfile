
FROM denoland/deno:1.38.5

WORKDIR /app

# Cache the dependencies
COPY deps.ts .
RUN deno cache deps.ts

# Copy the rest of the application code
COPY . .

# Compile the main application
RUN deno cache index.ts

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-env", "index.ts"]
