# AI FitTrack API 🏋️‍♂️🤖

AI FitTrack API is a robust, production-ready backend application built using **Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, bcrypt**, and the **Google Gemini AI SDK**. 

It enables users to register, authenticate securely, log their daily fitness and workout activities, query workouts via keyword or date, and request personalized AI workout plans or progress insights directly from Google Gemini AI.

---

## 🎨 Tech Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **AI Integration:** Google Gemini SDK (`@google/genai` v2.x)
- **Security & Cryptography:** JWT (JsonWebToken), bcryptjs
- **Logging:** Morgan

---

## 📁 MVC Architecture
```text
FitTrack/
├── src/
│   ├── config/          # Database configuration settings
│   │   └── db.js
│   ├── controllers/     # Route controller logic
│   │   ├── authController.js
│   │   ├── workoutController.js
│   │   └── aiController.js
│   ├── middleware/      # JWT guards & centralized error handling
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/          # MongoDB Mongoose schemas
│   │   ├── User.js
│   │   └── Workout.js
│   ├── routes/          # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── aiRoutes.js
│   │   └── index.js
│   ├── services/        # Service wrappers (Google Gemini SDK)
│   │   └── geminiService.js
│   └── app.js           # Express App configuration
├── .env                 # Environment config (gitignored)
├── .env.example         # Template env configuration
├── .gitignore
├── package.json
└── FitTrack.postman_collection.json  # Importable Postman tests
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas Cloud URL)
- **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 2. Installation
Clone or navigate to the project directory and run:
```bash
npm install
```

### 3. Configuration Setup
Create a `.env` file in the root directory based on the `.env.example` template:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fittrack
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Running the Server
Start the development server with automatic file reload:
```bash
npm run dev
```
Or start in production mode:
```bash
npm start
```

---

## 🛠️ API Specifications & Reference

### 🔐 Feature 1: Authentication

#### **Register User**
* **URL:** `/api/auth/register`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "123456"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe2c5f1b2c001f3e42aa",
      "name": "John Doe",
      "email": "john@gmail.com"
    }
  }
  ```

#### **Login User**
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "john@gmail.com",
    "password": "123456"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe2c5f1b2c001f3e42aa",
      "name": "John Doe",
      "email": "john@gmail.com"
    }
  }
  ```

#### **User Profile**
* **URL:** `/api/auth/profile`
* **Method:** `GET`
* **Auth Required:** Yes (`Bearer <token>`)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "60d0fe2c5f1b2c001f3e42aa",
      "name": "John Doe",
      "email": "john@gmail.com"
    }
  }
  ```

---

### 🏃‍♂️ Feature 2: Workout Management (JWT Guarded)
*All workouts are strictly scoped to the authenticated user. You cannot view, edit, or delete another user's workout.*

#### **Add Workout**
* **URL:** `/api/workouts`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "workoutName": "Evening Jog",
    "category": "Running",
    "duration": 30,
    "caloriesBurned": 350,
    "workoutDate": "2026-06-26T18:00:00.000Z"
  }
  ```
  *(Note: `workoutDate` is optional and defaults to current timestamp).*
  *Supported Categories: `Cardio`, `Strength Training`, `Yoga`, `Running`, `Cycling`, `Walking`.*

#### **View All Workouts**
* **URL:** `/api/workouts`
* **Method:** `GET`
* **Response (200 OK):** Returns all workouts logged by the authenticated user sorted by date (descending).

#### **View Workout by ID**
* **URL:** `/api/workouts/:id`
* **Method:** `GET`

#### **Update Workout**
* **URL:** `/api/workouts/:id`
* **Method:** `PUT`
* **Body:** Fields to update (e.g. `{ "duration": 40 }`)

#### **Delete Workout**
* **URL:** `/api/workouts/:id`
* **Method:** `DELETE`

---

### 🔍 Feature 3: Workout Search (JWT Guarded)

#### **Search Workouts**
* **URL:** `/api/workouts/search?q=<term>`
* **Method:** `GET`
* **Query Parameters:** `q` (Keyword for searching)
* **Search capabilities:**
  - Case-insensitive regex matches on **Workout Name** (e.g., `?q=jog`)
  - Case-insensitive regex matches on **Category** (e.g., `?q=running`)
  - Matches by specific **Date** if `q` matches a standard date pattern (e.g., `?q=2026-06-26`)

---

### 🧠 Feature 4: AI Workout Recommendation (JWT Guarded)

#### **Get AI Recommendation**
* **URL:** `/api/ai/workout-recommendation`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "age": 22,
    "fitnessGoal": "Weight Loss",
    "experience": "Beginner"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "recommendation": "Start with 30 minutes of brisk walking, 20 minutes of bodyweight exercises, and stretching five days a week."
  }
  ```

---

### 📊 Feature 5: AI Fitness Insights (JWT Guarded)

#### **Get Fitness Insights**
* **URL:** `/api/ai/fitness-insights`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "totalWorkouts": 18,
    "averageDuration": 45,
    "totalCaloriesBurned": 6200
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "insight": "You have maintained a consistent workout routine. Increasing strength training sessions may help you achieve your fitness goals faster."
  }
  ```

---

## 🧪 Postman Collection Setup
An importable Postman collection is included in the project root: `FitTrack.postman_collection.json`.

**Features of the Postman Collection:**
1. Predefined endpoints organized by feature categories.
2. Auto-evaluating Test Scripts: When you trigger a **Register** or **Login** request, the returned token is automatically stored in a collection variable named `jwt_token`.
3. Auto-updating IDs: When you successfully run **Add Workout**, the generated ID is saved into `workout_id` to automatically authorize subsequent Retrieve/Update/Delete tests.
4. Bearer Authentication is dynamically inherited from the collection variables.
