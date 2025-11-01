import "server-only";
import { Pool, QueryResult, QueryResultRow } from "pg";

declare global {
	var pgPool: Pool | undefined;

	namespace NodeJS {
		interface ProcessEnv {
			DB_HOST: string;
			DB_USER: string;
			DB_PORT?: string;
			DB_DATABASE: string;
			DB_PASSWORD: string;
		}

		interface Global {
			pgPool?: Pool;
		}
	}
}

// Define the database interface

interface Database{
	query<T extends QueryResultRow = any>(
		text: string,
		params?: any[]
	): Promise<QueryResult<T>>;
	getPool(): Pool;
	end(): Promise<void>;
}

const poolConfig = {
	max: 20, // set pool max size to 20
	idleTimeoutMillis: 30000, // close idle clients after 30 seconds
	connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
	host: process.env.PGHOST,
	user: process.env.PGUSER,
	port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	ssl: {
		rejectUnauthorized: false, // For hosted PostgreSQL services
	},
}

const getPool = (): Pool => {
	// Check if we already have a pool
	if (!global.pgPool) {
		global.pgPool = new Pool(poolConfig);

		// Set up error handler
		global.pgPool.on("error", (err: Error) => {
			console.error("Unexpected error on idle client", err);
			process.exit(-1);
		});

		// For dev environments: log pool creation
		if (process.env.NODE_ENV === "development") {
			console.log("Creating new PostgreSQL connection pool");
		}
	}

	return global.pgPool;
};

// Function to initialize the database
const initDb = async (): Promise<void> => {
	const pool = getPool();
	
	// Create users table first
	const createUsersTableQuery = `
		CREATE TABLE IF NOT EXISTS users (
			id VARCHAR(255) PRIMARY KEY, -- Google user ID
			email VARCHAR(255) UNIQUE NOT NULL,
			name VARCHAR(255),
			
			subscription_tier VARCHAR(50) DEFAULT 'free',
			stripe_customer_id VARCHAR(255) -- For Stripe integration
		);
	`;
	
	// Create messages table with user reference
	const createMessagesTableQuery = `
		CREATE TABLE IF NOT EXISTS messages (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			recipient_email VARCHAR(255) NOT NULL,
			message_content TEXT NOT NULL,
			deadman_duration INT NOT NULL, -- days
			status VARCHAR(50) DEFAULT 'active', -- active, sent, cancelled
			last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`; 
	
	try {
		await pool.query(createUsersTableQuery);
		await pool.query(createMessagesTableQuery);
		console.log("Database initialized with users and messages tables");
	} catch (error) {
		console.error("Error initializing database:", error);
		throw error;
	}
};

// Initialize the database when this module is loaded
initDb().catch((err) => {
	console.error("Failed to initialize database:", err);
	process.exit(1);
});

// Create the database object with all methods
const db: Database = {
	query: async <T extends QueryResultRow = any>(
		text: string,
		params?: any[]
	): Promise<QueryResult<T>> => {
		const pool = getPool();
		return pool.query<T>(text, params);
	},

	getPool: (): Pool => {
		return getPool();
	},

	end: async (): Promise<void> => {
		if (global.pgPool) {
			await global.pgPool.end();
			global.pgPool = undefined;
		}
	},
};

export default db;