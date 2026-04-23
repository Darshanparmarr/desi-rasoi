# Full-Stack Deployment Guide (Free Tier)

This guide walks you through deploying the entire Mukhwas web application (Frontend + Backend + Database) using free services.

---

## Step 1: Push Your Code to GitHub
Before deploying, your code needs to be hosted in a remote repository.
1. Create a free account on [GitHub](https://github.com/).
2. Create a new repository (public or private).
3. Open your terminal in the `e:\Avadhana Tech\Mukhwas` directory and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

---

## Step 2: Setup Free Cloud Database (MongoDB Atlas)
Currently, your app uses a local database (`mongodb://localhost:27017/mukhwas`). You need a cloud database.
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2. Create a **Shared (Free)** Cluster.
3. Once the cluster is created, go to **Database Access** and create a new user (remember the username and password).
4. Go to **Network Access** and add IP address `0.0.0.0/0` to allow access from anywhere.
5. Go to **Databases** -> **Connect** -> **Drivers**.
6. Copy your connection string. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mukhwas?retryWrites=true&w=majority`
   *(Replace `<username>` and `<password>` with the ones you created in step 3).*

---

## Step 3: Deploy the Backend (Render.com)
We'll use Render to host the Node.js server for free.
1. Go to [Render](https://render.com/) and create a free account linked to your GitHub.
2. Click **New +** and select **Web Service**.
3. Select the GitHub repository you created in Step 1.
4. Fill in the deployment details:
   - **Name**: `mukhwas-backend` (or whatever you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add the variables from your local `backend/.env` file:
   - `MONGODB_URI`: (Paste the connection string from Step 2)
   - `JWT_SECRET`: `your_jwt_secret_key_here` (or a more secure random string)
   - `NODE_ENV`: `production`
   - `GMAIL_USER`: `darshuparmar67@gmail.com`
   - `GMAIL_PASS`: `gftz zchm gnto bfig`
   - `ADMIN_EMAIL`: `darshuparmar67@gmail.com`
   - `FRONTEND_URL`: `https://mukhwas-app.vercel.app` *(You will update this later once frontend is deployed)*
6. Click **Create Web Service**. Wait a few minutes for it to build and deploy. Once successful, copy the backend URL (e.g., `https://mukhwas-backend.onrender.com`).

---

## Step 4: Deploy the Frontend (Vercel.com)
We'll use Vercel to host your React frontend for free.
1. Go to [Vercel](https://vercel.com/) and create a free account with GitHub.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. In the configuration settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Expand **Environment Variables** and add:
   - `REACT_APP_API_URL`: `https://mukhwas-backend.onrender.com/api` *(Paste the Render backend URL you got from Step 3, make sure to add `/api` at the end).*
6. Click **Deploy**. Vercel will build and launch your frontend.
7. Once deployed, Vercel will give you a public URL (e.g., `https://mukhwas-app.vercel.app`).
8. **Final touch**: Go back to your Render backend dashboard -> Environment Variables, and update `FRONTEND_URL` to match this Vercel URL.

---

## Done!
Your full-stack application is now deployed for free! 
- The React App is live on **Vercel**
- The Node API is running on **Render**
- The Data is securely stored on **MongoDB Atlas**
