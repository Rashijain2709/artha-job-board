# 🚀 Artha Job Importer

A scalable job import system that fetches jobs from external APIs, queues them using Redis, imports them into MongoDB, and provides a UI to view import history.

---

## ✨ Features
- 🔗 Fetch jobs from multiple XML-based APIs
- 📦 Queue jobs using Redis and BullMQ
- 🗄️ Import/update jobs in MongoDB
- 📊 Track import history (new, updated, failed)
- 👀 View import logs in a web UI
- ⏰ Automated hourly job fetching (via cron)
- 🖥️ **Frontend:** Next.js admin UI for viewing import logs/history
- 🛠️ The job import queue uses **Redis** and **BullMQ** for scalable background processing
- ⚙️ **Worker concurrency** is configurable via the `BATCH_SIZE` environment variable
- 📝 Each import run logs: `timestamp`, `totalFetched`, `totalImported`, `newJobs`, `updatedJobs`, `failedJobs` (with reasons)
- ❗ Errors during job processing are logged and included in import logs for transparency

---

## ⚙️ Prerequisites
- 🟢 **Node.js** (v14+ recommended)
- 🍃 **MongoDB** (local or cloud)
- 🟥 **Redis** (local or cloud)

---

## 🛠️ Setup Instructions

1. 📥 **Clone the repository**
   ```sh
   git clone https://github.com/Rashijain2709/artha-job-board.git
   cd artha-job-board
   ```

2. 📦 **Install dependencies**
   ```sh
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. 📝 **Configure environment variables**
   - Create a `.env` file in the `server/` directory:
     ```env
     MONGO_URI=mongodb://localhost:27017/artha-job-board
     BATCH_SIZE=5
     REDIS_HOST=localhost
     REDIS_PORT=6379
     ```

4. 🏁 **Start MongoDB and Redis**
   - Make sure both services are running locally or update your `.env` for remote/cloud instances.

---

## 🚦 Running the Application

### 1. ▶️ Start the Backend API (with cron job)
```sh
cd server
npm start
```
- This will also schedule job fetching every hour.

### 2. ⚙️ Start the Worker (in a separate terminal)
```sh
cd server
node jobs/worker.js
```
- Processes queued jobs and updates import logs.

### 3. 💻 Start the Frontend
```sh
cd client
npm start
```
- Visit [http://localhost:3000](http://localhost:3000) to view import history.

### 4. 🏃 (Optional) Manually Fetch and Enqueue Jobs
```sh
cd server
npm run fetch-and-enqueue
```

---

## 🗂️ Project Structure
```
artha-job-board/
  client/         # Next.js frontend (import history UI)
  server/         # Express backend, job queue, worker, services
    jobs/         # Queue and worker logic
    models/       # Mongoose models
    routes/       # API routes
    services/     # Job fetching/parsing
    utils/        # XML parsing
```

---

## 🌐 API Feeds Used
- See `server/jobs/fetchAndEnqueue.js` for the list of job feeds.

---

## 📝 Notes
- 🔒 `.env` files are gitignored for security.
- ⚙️ Update `MONGO_URI`, `REDIS_HOST`, and `REDIS_PORT` as needed for your environment.
- 🐳 For production, consider Dockerizing MongoDB, Redis, and the app. See the architecture documentation for more details on deployment.

---

## 📄 License
MIT
