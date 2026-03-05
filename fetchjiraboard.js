const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
// Configuration
const DOMAIN = "deanzagamedevclub.atlassian.net";
const EMAIL = "deanzagamedevclub@gmail.com";
const API_TOKEN = process.env.JIRA_API_TOKEN;
const BOARD_ID = "1";

// Create the Basic Auth string (email:token encoded in Base64)
const auth = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString('base64');

async function fetchJiraBoard() {
	const url = `https://${DOMAIN}/rest/agile/1.0/board/${BOARD_ID}/issue`;

	try {
		const response = await axios.get(url, {
			headers: {
				'Authorization': `Basic ${auth}`,
				'Accept': 'application/json'
			}
		});

		const issues = response.data.issues;

		// Structure the data for your website
		const kanbanData = issues.map(issue => ({
			key: issue.key,
			summary: issue.fields.summary,
			status: issue.fields.status.name,
			tags: issue.fields.labels // Using labels as your "assignee tags"
		}));

		console.log(`Successfully fetched ${kanbanData.length} tasks.`);

		// Save to a file for your frontend to read
		fs.writeFileSync('board_data.json', JSON.stringify(kanbanData, null, 2));

	} catch (error) {
		console.error("Error fetching Jira data:", error.response ? error.response.status : error.message);
	}
}

fetchJiraBoard();
