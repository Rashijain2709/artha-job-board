# System Architecture and Design Decisions

## Overview

This document outlines the architecture and key design decisions for the Artha Job Board project. It serves as a reference for current and future contributors to understand the system's structure, rationale behind major choices, and how different components interact.

---

## System Components

### 1. Client (Frontend)
- **Location:** `client/`
- **Tech Stack:** React.js
- **Responsibilities:**
  - User interface for browsing and searching jobs
  - Displaying import logs
  - Communicating with backend APIs

### 2. Server (Backend)
- **Location:** `server/`
- **Tech Stack:** Node.js, Express.js
- **Responsibilities:**
  - Exposes RESTful APIs for job data and logs
  - Handles job fetching, queuing, and processing
  - Manages import logs and job records in the database

### 3. Job Processing
- **Components:**
  - `cron/jobCron.js`: Schedules periodic job fetching
  - `jobs/queue.js`, `jobs/worker.js`: Queue management and background processing
  - `services/jobFetcher.js`, `services/jobFetcherService.js`: Fetches jobs from external sources

### 4. Data Models
- **Location:** `server/models/`
- **Key Models:**
  - `Job.js`: Represents a job posting
  - `ImportLog.js`: Tracks import operations and errors

---

## Key Design Decisions

### 1. Separation of Concerns
- **Frontend and backend are separated** into distinct folders and codebases for maintainability and scalability.

### 2. Job Importing via Queue
- **Reason:** To handle large volumes of job data without blocking the main server thread, a queue-based background worker system is used for importing and processing jobs.

### 3. Logging and Monitoring
- **Import logs** are maintained in a dedicated model and exposed via API for transparency and debugging.

### 4. Scheduling with Cron
- **Automated job fetching** is scheduled using a cron job to ensure the job board stays up-to-date with minimal manual intervention.

### 5. Modular Service Layer
- **Job fetching and parsing** are encapsulated in service modules for reusability and easier testing.

### 5. Queue and Worker System
- The job import queue is implemented using **Redis** and **BullMQ** for scalable background processing.
- **Worker concurrency** is configurable via the `BATCH_SIZE` environment variable, allowing the system to scale based on workload and available resources.

### 6. Import Logging
- Each import run logs the following fields in the `ImportLog` model:
  - `timestamp`
  - `totalFetched`
  - `totalImported`
  - `newJobs`
  - `updatedJobs`
  - `failedJobs` (with reasons for each failure)
- Errors encountered during job processing are captured and included in the `failedJobs` array for transparency and debugging.

### 7. Deployment
- The system can be containerized using Docker for easy deployment and scalability. (See README for instructions if implemented.)

---

## Future Considerations
- **Authentication & Authorization:** Not currently implemented, but planned for future versions.
- **Scalability:** The queue and worker system can be scaled horizontally as needed.
- **Error Handling:** Centralized error handling and alerting can be improved.
