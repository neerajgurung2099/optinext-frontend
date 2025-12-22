# How to Run the Project

Follow the steps below to run the project locally.

## Step 1: Install Dependencies

Install all required packages using Yarn:
yarn install

## Step 2: Set Up Environment Variables

This project uses environment variables.

1. Create or update the `.env` file in the root directory.
2. Add the following configuration and replace the placeholder values with your actual credentials:
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_DB_URL=your_firebase_db_url
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_id
   VITE_FIREBASE_MSG_SENDER_ID=your_firebase_msg_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_BACKEND_API=your_backend_api

## Step 3: Start the Development Server

Run the project using:
yarn run dev

The application will be available on the local development server (default Vite port).
