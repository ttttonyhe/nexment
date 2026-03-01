#!/usr/bin/env node

/**
 * Nexment: LeanCloud → Supabase Migration Script
 *
 * Converts a LeanCloud data export (JSONL) into a SQL file
 * that can be run in the Supabase SQL Editor.
 *
 * Usage:
 *   node migration/leancloud-to-supabase.mjs <path-to-leancloud-backup-dir> [output.sql]
 *
 * Example:
 *   node migration/leancloud-to-supabase.mjs ./backup ./migration/seed.sql
 *
 * The backup directory should contain `nexment_comments.0.jsonl`
 * exported from the LeanCloud dashboard.
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { randomUUID } from "crypto"
import { join } from "path"

const backupDir = process.argv[2]
const outputPath = process.argv[3] || "seed.sql"

if (!backupDir) {
	console.error(
		"Usage: node migration/leancloud-to-supabase.mjs <backup-dir> [output.sql]"
	)
	process.exit(1)
}

const jsonlPath = join(backupDir, "nexment_comments.0.jsonl")
if (!existsSync(jsonlPath)) {
	console.error(`Error: ${jsonlPath} not found.`)
	console.error(
		"Make sure the backup directory contains nexment_comments.0.jsonl"
	)
	process.exit(1)
}

const lines = readFileSync(jsonlPath, "utf-8").trim().split("\n")

// Skip the JSONL header line
const dataLines = lines.slice(1)

if (dataLines.length === 0) {
	console.error("No comment data found in the backup file.")
	process.exit(1)
}

const esc = (str) => {
	if (str === null || str === undefined) return "NULL"
	return "'" + String(str).replace(/'/g, "''") + "'"
}

let sql = `-- Nexment: LeanCloud to Supabase data migration
-- Generated: ${new Date().toISOString()}
-- Total comments: ${dataLines.length}
-- Run this in the Supabase SQL Editor after running schema.sql

`

let count = 0
for (const line of dataLines) {
	const c = JSON.parse(line)
	count++

	const id = esc(randomUUID())
	const commentId = c.ID
	const identifier = esc(c.identifier)
	const name = esc(c.name)
	const email = esc(c.email)
	const content = esc(c.content)
	const tag = c.tag ? esc(c.tag) : "NULL"
	const reply = c.reply !== undefined && c.reply !== null ? c.reply : "NULL"
	const hasReplies = c.hasReplies ? "TRUE" : "FALSE"
	const emailWhenReplied = c.emailWhenReplied ? "TRUE" : "FALSE"
	const link = c.link ? esc(c.link) : "NULL"
	const createdAt = esc(c.createdAt)
	const updatedAt = esc(c.updatedAt)

	sql += `INSERT INTO nexment_comments (id, comment_id, identifier, name, email, content, tag, reply, has_replies, email_when_replied, link, created_at, updated_at)
VALUES (${id}, ${commentId}, ${identifier}, ${name}, ${email}, ${content}, ${tag}, ${reply}, ${hasReplies}, ${emailWhenReplied}, ${link}, ${createdAt}, ${updatedAt});\n`
}

writeFileSync(outputPath, sql)
console.log(`Done! ${count} comments exported to ${outputPath}`)
