async function refreshBoard() {
	try {
		// Cache-busting URL to ensure we get the latest file from GitHub
		const response = await fetch(`board_data.json?t=${Date.now()}`);
		let tasks = await response.json();

		// Filter out any tasks that have the status "Complete"
		tasks = tasks.filter(t => t.status !== 'COMPLETE');

		const board = document.getElementById('board');
		const columns = tasks.reduce((acc, t) => {
			acc[t.status] = acc[t.status] || [];
			acc[t.status].push(t);
			return acc;
		}, {});

		board.innerHTML = Object.keys(columns).map(status => `
            <div class="column">
                <h2>${status}</h2>
                ${columns[status].map(t => `
                    <div class="card">
                        <div class="card-id">${t.key}</div>
                        <span class="card-title">${t.summary}</span>
                        <div class="tag-list">
                            ${t.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');

		console.log("Board UI updated at " + new Date().toLocaleTimeString());
	} catch (e) {
		console.error("UI Update failed", e);
	}
}

// Initial load
refreshBoard();
