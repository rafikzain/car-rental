
**Use your preferred IDE**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Authentication & Database)
- Docker

## Database Information

The project uses Supabase as its database with the following main tables:

- `profiles`: Stores user profile information
- `cars`: Stores car listings information
- `transactions`: Tracks car sales and rentals
- `reviews`: Stores user reviews and ratings
- `car_images`: Stores car image URLs
- `car_brands`: Stores available car brands

## Mock Users

For testing purposes, you can use these mock accounts:

### Admin User
```
Email: admin@example.com
Password: admin123
Type: admin
```

### Seller Account
```
Email: seller@example.com
Password: seller123
Type: seller
```

### Buyer Account
```
Email: buyer@example.com
Password: buyer123
Type: buyer
```

## Docker Setup

The project includes Docker configuration for easy deployment:

```sh
# Build and start the containers
docker-compose up --build

# Stop the containers
docker-compose down
```

Required environment variables (create a .env file):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CMI_MERCHANT_ID=your_cmi_merchant_id
VITE_CMI_ENDPOINT=your_cmi_endpoint
```

