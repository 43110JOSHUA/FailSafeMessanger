"use server";
import type { Message } from "./types";
import db from "./db";

export async function getMessages(): Promise<Message[]> {
    try {
        const result = await db.query<Message>("SELECT * FROM messages ORDER BY created_at DESC");
        return result.rows;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

// export async function addMessage()

// export async function deleteMessage()

// export async function updateMessage()