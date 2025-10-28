"use server";
import type { Message, User } from "./types";
import db from "./db";

// MESSAGE ACTIONS
export async function getMessages(userId: string): Promise<Message[]> {
    try {
        const result = await db.query<Message>(
            "SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

export async function addMessage(
    userId: string,
    messageData: {
        recipientEmail: string;
        messageContent: string;
        deadmanDuration: number;
    }
): Promise<Message | null> {
    try {
        const result = await db.query<Message>(
            `INSERT INTO messages (user_id, recipient_email, message_content, deadman_duration)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                userId,
                messageData.recipientEmail,
                messageData.messageContent,
                messageData.deadmanDuration
            ]
        );
				return result.rows[0];
     
    } catch (error) {
        console.error("Error adding message:", error);
        throw new Error("Failed to create message");
    }
}

export async function deleteMessage(messageId: string): Promise<void> {
    try {
        await db.query(
            `DELETE FROM messages WHERE id = $1`,
            [messageId]
        );
    } 
    catch (error) {
        console.error("Error deleting message:", error);
        throw new Error("Failed to delete message");
    }
}

// export async function updateMessage()

// USER ACTIONS
export async function addUser(userData: {
    id: string;
    email: string;
    name?: string;
}): Promise<User | null> {
    try {
        // Use UPSERT (INSERT ... ON CONFLICT) to handle both new and existing users
        const result = await db.query<User>(
            `INSERT INTO users (id, email, name)
             VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                name = EXCLUDED.name
             RETURNING *`,
            [userData.id, userData.email, userData.name || null]
        );

        if (result.rows.length > 0) {
            return result.rows[0];
        }
        
        return null;
    } catch (error) {
        console.error("Error adding/updating user:", error);
        throw new Error("Failed to save user to database");
    }
}

export async function getUserById(userId: string): Promise<User | null> {
    try {
        const result = await db.query<User>(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}