# YouTube Clone — MERN Stack Capstone Project

🔗 **GitHub Repository:** [https://github.com/pragati8-tech/Develop-a-YouTube-Clone-Using-the-MERN-Stack](https://github.com/pragati8-tech/Develop-a-YouTube-Clone-Using-the-MERN-Stack)

A full-stack YouTube clone built with **MongoDB, Express, React, and Node.js**. Users can register/login, create a channel, upload videos, watch videos, like/dislike, comment, and manage their own content.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (JSON Web Tokens), bcryptjs |
| Module System | ES Modules (`import`/`export`) |

---

## 📁 Project Structure

```
youtube-clone/
├── frontend/
│   ├── src/
│   │   ├── components/      # Header, Sidebar, VideoCard, FilterBar, CommentSection, ProtectedRoute
│   │   ├── pages/           # Home, Login, Register, VideoPlayer, Channel
│   │   ├── context/         # AuthContext (JWT state management)
│   │   ├── hooks/           # useAuth custom hook
│   │   ├── services/        # api.js (Axios instance + endpoints)
│   │   ├── utils/           # formatViews, timeAgo helpers
│   │   ├── App.jsx          # Routes
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── backend/
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # User, Video, Channel, Comment (Mongoose schemas)
│   ├── controllers/         # Business logic for auth, video, channel, comment
│   ├── routes/               # Express routers
│   ├── middleware/           # JWT auth middleware (protect)
│   ├── server.js             # Entry point
│   └── package.json
│
├── database-seed/            # Exported MongoDB collections (JSON) for evaluators
│   ├── users.json
│   ├── videos.json
│   ├── channels.json
│   └── comments.json
│
└── README.md
```

---

## ⚙️ How to Access / Run This Project

> **Note:** The `node_modules` folders have been removed before submission (as required). You must run `npm install` in both `backend/` and `frontend/` before running the project — see steps below.

### Prerequisites
Make sure these are installed on your machine before starting:
- **Node.js** (v18 or higher) — [download here](https://nodejs.org)
- **MongoDB** — either a local installation (Community Server) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **MongoDB Compass** (optional, only needed if you want to import the seed data) — [download here](https://www.mongodb.com/products/compass)

### Step 1 — Extract / Clone the project
If you received this as a ZIP file, extract it. If cloning from GitHub:
```bash
git clone https://github.com/pragati8-tech/Develop-a-YouTube-Clone-Using-the-MERN-Stack.git
cd Develop-a-YouTube-Clone-Using-the-MERN-Stack
```

The project has three main folders:
```
YouTube Clone/
├── backend/          → Node.js + Express API
├── frontend/         → React app
└── database-seed/    → Exported sample data (JSON) for testing
```

### Step 2 — Install Backend Dependencies
Open a terminal inside the `backend/` folder and run:
```bash
cd backend
npm install
```
This will recreate the `node_modules` folder using the packages listed in `package.json`.

Create a file named `.env` inside `backend/` with the following content:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_jwt_secret_key
```
> If you are using MongoDB Atlas instead of a local database, replace `MONGO_URI` with your Atlas connection string.

Start the backend server:
```bash
npm run dev
```
You should see:
```
Server running on http://localhost:5000
MongoDB Connected: ...
```

### Step 3 — Install Frontend Dependencies
Open a **second terminal** (keep the backend running) inside the `frontend/` folder:
```bash
cd frontend
npm install
```

Create a file named `.env` inside `frontend/` with:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
You should see a local URL like `http://localhost:5173` — open this in your browser.

> ⚠️ **Both servers (backend and frontend) must be running at the same time, in two separate terminals**, for the app to work correctly.

### Step 4 — Load Sample Data (Recommended for Evaluators)
The `database-seed/` folder contains exported JSON data (`users.json`, `channels.json`, `videos.json`, `comments.json`) so you can test the app immediately without creating an account or uploading videos manually.

**To import this data using MongoDB Compass:**
1. Open MongoDB Compass and connect to your MongoDB instance (e.g., `mongodb://localhost:27017`).
2. Create a new database named `youtube-clone`.
3. Inside it, create four collections: `users`, `channels`, `videos`, `comments`.
4. For each collection, click **Add Data → Import File**, select the matching `.json` file from the `database-seed/` folder, choose format **JSON**, and import.

**Sample login credentials (if using the seed data):**
```
Email: arjun@example.com
Password: 123456
```

### Step 5 — Use the App
Once both servers are running and the database is seeded (or you've registered manually):
1. Visit `http://localhost:5173`
2. Click **Sign In** (top right) to log in, or **Register** to create a new account
3. Explore videos on the Home page, use the search bar and category filters
4. Click any video to watch it, like/dislike it, and leave comments
5. Click your avatar (top right) → **Your Channel** to create a channel and upload/edit/delete your own videos

---

## ✨ Features

### Authentication
- User registration with validation (username, email, password)
- Auto-redirect to login after successful registration
- JWT-based login; token stored in `localStorage`
- Protected routes (e.g., Channel page) redirect unauthenticated users to login

### Home Page
- YouTube-style header with logo, search bar, sign-in/avatar
- Toggleable sidebar (hamburger menu) with category navigation
- Responsive video grid with thumbnail, title, channel name, views, and upload time
- 12 category filter buttons (All, Trending, React, JavaScript, Gaming, Music, News, Sports, Education, Technology, Cooking, Travel)
- Real-time search by video title

### Video Player
- HTML5 video player with controls
- Like / Dislike buttons with toggle logic (switching between like and dislike updates both counts correctly)
- View count increments on each video load
- Full comment section: **Create, Read, Update, Delete**
- Only the comment's author can edit/delete their own comment

### Channel Management
- Users can create one channel (requires login)
- Channel page displays banner, name, description, subscriber count, and all uploaded videos
- Full video CRUD from the channel page: upload, edit, delete
- Only the channel owner sees upload/edit/delete controls

### Responsive Design
- Fully responsive layout across mobile, tablet, and desktop breakpoints
- Sidebar collapses to an overlay on smaller screens

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Videos
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/api/videos` | No | Get all videos (supports `?category=` & `?search=`) |
| GET | `/api/videos/:id` | No | Get a single video (increments view count) |
| POST | `/api/videos` | Yes | Upload a new video |
| PUT | `/api/videos/:id` | Yes | Edit a video (owner only) |
| DELETE | `/api/videos/:id` | Yes | Delete a video (owner only) |
| PUT | `/api/videos/:id/like` | Yes | Toggle like |
| PUT | `/api/videos/:id/dislike` | Yes | Toggle dislike |

### Channels
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/api/channels/my` | Yes | Get the logged-in user's own channel |
| GET | `/api/channels/:id` | No | Get any channel by ID |
| POST | `/api/channels` | Yes | Create a new channel |
| PUT | `/api/channels/:id` | Yes | Edit a channel (owner only) |

### Comments
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/api/comments/:videoId` | No | Get all comments for a video |
| POST | `/api/comments/:videoId` | Yes | Add a comment |
| PUT | `/api/comments/:id` | Yes | Edit a comment (author only) |
| DELETE | `/api/comments/:id` | Yes | Delete a comment (author only) |

---

## 🔐 Authentication Flow

1. User registers → password is hashed (bcrypt) before saving to MongoDB.
2. User logs in → server verifies password and returns a signed JWT (30-day expiry).
3. Frontend stores the JWT in `localStorage` and attaches it to every subsequent request via an Axios interceptor (`Authorization: Bearer <token>`).
4. Protected backend routes use a `protect` middleware that verifies the JWT and attaches the authenticated user to `req.user`.
5. Protected frontend routes use a `ProtectedRoute` wrapper that checks the `AuthContext` and redirects to `/login` if no user is found.

---

## 👤 Author

**Pragati Agrawal**
Built as part of a MERN Stack Capstone Project.
