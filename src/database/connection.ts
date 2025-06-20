import { Client } from 'cassandra-driver';
import dotenv from 'dotenv';

dotenv.config();
const NODE_IP1 = process.env.NODE_IP1!;
const NODE_IP2 = process.env.NODE_IP2!;
const NODE_IP3 = process.env.NODE_IP3!;
const DATA_CENTER = process.env.DATA_CENTER!;
const DB_USERNAME = process.env.DB_USERNAME!;
const DB_PASSWORD = process.env.DB_PASSWORD!;
const KEYSPACE = process.env.KEYSPACE!;

const scyllaClient = new Client({
  contactPoints: [NODE_IP1, NODE_IP2, NODE_IP3],
  localDataCenter: DATA_CENTER,
  credentials: { username: DB_USERNAME, password: DB_PASSWORD },
});

const newKeyspaceQuery = `CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE} WITH replication = {'class': 'NetworkTopologyStrategy', 'replication_factor': 1} AND durable_writes = true;`;
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
    thread_id UUID,         
    comment_id UUID,      
    parent_id UUID,         
    user_id TEXT,
    content TEXT,
    upvotes INT,
    created_at TIMESTAMP,
    PRIMARY KEY (thread_id, created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at ASC);`;

async function connectDb() {
  await scyllaClient.execute('SELECT * FROM system.clients LIMIT 10')
  await scyllaClient.execute(newKeyspaceQuery)
  await scyllaClient.execute(`USE ${KEYSPACE}`)
  await scyllaClient.execute(createTableQuery)
}

export { scyllaClient, connectDb }