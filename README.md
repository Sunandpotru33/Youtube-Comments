# YouTube-Style Comment System API

A scalable backend API for a YouTube-style comment system built using **Node.js**, **TypeScript**, **Express**, and **ScyllaDB**. It 
supports nested comments, upvoting, and fetching threads sorted by upvotes or newest-first.

---

## Features

- Add main comments and replies (supports infinite nesting)
- Upvote any comment or reply
- Fetch all comments with full nested replies
- Sort top-level comments by:
  - Upvotes
  - Newest first
- Delete a comment (soft delete supported)

---

## Tech Stack

- **Backend**: Node.js + TypeScript + Express.js
- **Database**: ScyllaDB (Cassandra-compatible)
- **UUID**: Used to uniquely identify comments and threads

---

### 1. Clone the repo
```bash
git clone https://github.com/Sunandpotru33/youtube-comments-api.git
cd youtube-comments-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
NODE_IP1=your_scylla_cloud_ip1
NODE_IP2=your_scylla_cloud_ip2
NODE_IP3=your_scylla_cloud_ip3
DATA_CENTER=your_datacenter
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
KEYSPACE=your_keyspace
```

### 4. Run the app
```bash
npm run dev
```

### Sample API Endpoints
```bash
# Method     Endpoint            Description
  POST       /comments           Add a comment or reply
  GET        /comments           Get all comments with nested replies
  GET        /top-comments       Get top-level comments sorted by upvotes
  GET        /newest-comments    Get top-level comments sorted by date
  POST       /upvote/:id         Upvote any comment or reply
  DELETE     /comments/:id       Delete a comment (soft delete supported)
  POST       /sample-data        Load test data (optional)
```


### Sample Nested Comment Structure
```json
[
  {
    "comment_id": "uuid-1",
    "content": "Top-level comment",
    "replies": [
      {
        "comment_id": "uuid-2",
        "content": "Reply to top-level",
        "replies": [
          {
            "comment_id": "uuid-3",
            "content": "Nested reply"
          }
        ]
      }
    ]
  }
]
```
