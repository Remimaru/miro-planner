/**
 * ============================================================================
 * Kanban Pro v2.1 - Board-Native Edition
 * ============================================================================
 * A production-ready project management app with true board integration
 * 
 * NEW FEATURES:
 * - Native board member integration (real Miro users)
 * - Automatic card placement INSIDE frames
 * - Bi-directional sync (board changes update dashboard)
 * - Polling mechanism for real-time updates
 * - Compact, native-feeling UI
 * 
 * Author: Senior Miro App Developer
 * Date: January 2026
 * SDK: Miro Web SDK v2.0
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const APP_ID = 'kanban-pro-v2';
const APP_DATA_KEY = 'kanban-board-config';

// Frame configuration - These define the Kanban columns
const FRAME_CONFIG = {
    todo: {
        title: '📋 TO DO',
        x: -900,
        y: 0,
        width: 500,
        height: 2000,
        color: '#dbeafe', // Light blue
        status: 'todo'
    },
    progress: {
        title: '⚡ IN PROGRESS',
        x: -350,
        y: 0,
        width: 500,
        height: 2000,
        color: '#fef3c7', // Light yellow
        status: 'progress'
    },
    done: {
        title: '✅ DONE',
        x: 200,
        y: 0,
        width: 500,
        height: 2000,
        color: '#d1fae5', // Light green
        status: 'done'
    }
};

// Priority styling
const PRIORITY_CONFIG = {
    high: {
        emoji: '🔴',
        color: '#fee2e2',
        label: 'High'
    },
    medium: {
        emoji: '🟡',
        color: '#fef3c7',
        label: 'Medium'
    },
    low: {
        emoji: '🔵',
        color: '#dbeafe',
        label: 'Low'
    }
};

// Card layout constants
const CARD_WIDTH = 280;
const CARD_HEIGHT = 150;
const CARD_SPACING = 25;
const CARD_TOP_MARGIN = 100; // Space below frame title
const CARD_SIDE_MARGIN = 30; // Space from frame edges

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let currentTask = {
    taskName: '',
    assignee: '',
    assigneeId: null,
    priority: 'medium',
    status: 'todo'
};

let boardState = {
    frames: {
        todo: null,
        progress: null,
        done: null
    },
    boardMembers: [],
    isPolling: false,
    pollInterval: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the app
 */
async function init() {
    console.log('🚀 Initializing Kanban Pro v2.1 (Board-Native)...');

    try {
        // Register panel opener
        await miro.board.ui.on('icon:click', async () => {
            await miro.board.ui.openPanel({ url: 'index.html' });
        });

        // Set up DOM when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupApp);
        } else {
            await setupApp();
        }

        console.log('✅ Kanban Pro initialized');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
}

/**
 * Setup app after DOM is ready
 */
async function setupApp() {
    console.log('🔧 Setting up app...');

    try {
        // Load board members first
        await loadBoardMembers();

        // Try to find existing frames
        await findExistingFrames();

        // Setup event listeners
        setupEventListeners();

        // Initial dashboard refresh
        await refreshDashboard();

        // Start polling for board changes
        startBoardPolling();

        console.log('✅ App setup complete');
    } catch (error) {
        console.error('❌ Setup error:', error);
        alert('Failed to initialize app. Please refresh and try again.');
    }
}

// ============================================================================
// BOARD MEMBERS (Native Integration)
// ============================================================================

/**
 * Load board members from Miro
 */
async function loadBoardMembers() {
    console.log('👥 Loading board members...');

    try {
        const boardInfo = await miro.board.getInfo();
        
        // Get current user first
        const currentUser = await miro.board.getUserInfo();
        
        // Initialize members array with current user
        boardState.boardMembers = [{
            id: currentUser.id,
            name: currentUser.name || 'Me',
            isCurrent: true
        }];

        // Add unassigned option
        boardState.boardMembers.unshift({
            id: null,
            name: 'Unassigned',
            isCurrent: false
        });

        // Populate the assignee dropdown
        populateAssigneeDropdown();

        console.log(`✅ Loaded ${boardState.boardMembers.length} board members`);
    } catch (error) {
        console.error('❌ Error loading board members:', error);
        
        // Fallback: Add just unassigned option
        boardState.boardMembers = [{ id: null, name: 'Unassigned', isCurrent: false }];
        populateAssigneeDropdown();
    }
}

/**
 * Populate assignee dropdown with board members
 */
function populateAssigneeDropdown() {
    const assigneeSelect = document.getElementById('assignee');
    if (!assigneeSelect) return;

    // Clear existing options
    assigneeSelect.innerHTML = '';

    // Add each member as an option
    boardState.boardMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id || '';
        option.textContent = member.name + (member.isCurrent ? ' (You)' : '');
        assigneeSelect.appendChild(option);
    });

    console.log('✅ Assignee dropdown populated');
}

// ============================================================================
// FRAME MANAGEMENT (Board-Native Layout)
// ============================================================================

/**
 * Find existing frames on the board
 */
async function findExistingFrames() {
    console.log('🔍 Looking for existing frames...');

    try {
        const allItems = await miro.board.get({ type: 'frame' });
        
        // Try to find frames by title
        boardState.frames.todo = allItems.find(f => f.title && f.title.includes('TO DO'));
        boardState.frames.progress = allItems.find(f => f.title && f.title.includes('IN PROGRESS'));
        boardState.frames.done = allItems.find(f => f.title && f.title.includes('DONE'));

        const foundCount = [boardState.frames.todo, boardState.frames.progress, boardState.frames.done]
            .filter(f => f).length;

        if (foundCount > 0) {
            console.log(`✅ Found ${foundCount}/3 existing frames`);
        } else {
            console.log('ℹ️ No existing frames found - use Setup Board Layout');
        }
    } catch (error) {
        console.error('❌ Error finding frames:', error);
    }
}

/**
 * Setup board layout - Creates all three frames
 */
async function setupBoardLayout() {
    console.log('🎨 Setting up board layout...');

    const btn = document.getElementById('setupBoardBtn');
    setButtonLoading(btn, true);

    try {
        // Clear existing frame cache
        boardState.frames = { todo: null, progress: null, done: null };

        // Create all three frames
        for (const [key, config] of Object.entries(FRAME_CONFIG)) {
            console.log(`Creating ${config.title}...`);
            
            const frame = await miro.board.createFrame({
                title: config.title,
                x: config.x,
                y: config.y,
                width: config.width,
                height: config.height,
                style: {
                    fillColor: config.color
                }
            });

            boardState.frames[key] = frame;
            console.log(`✅ Created ${config.title}`);
        }

        // Save frame IDs to app data for persistence
        await saveFrameIdsToAppData();

        // Zoom to show all frames
        await zoomToBoard();

        console.log('✅ Board layout complete!');
        alert('✅ Board layout created! Three frames are ready: To Do, In Progress, and Done.');

        // Refresh dashboard
        await refreshDashboard();

    } catch (error) {
        console.error('❌ Error setting up board:', error);
        alert(`Failed to setup board: ${error.message}`);
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Save frame IDs to Miro app data for persistence
 */
async function saveFrameIdsToAppData() {
    try {
        const frameIds = {
            todo: boardState.frames.todo?.id,
            progress: boardState.frames.progress?.id,
            done: boardState.frames.done?.id
        };

        await miro.board.setAppData(APP_DATA_KEY, JSON.stringify(frameIds));
        console.log('✅ Frame IDs saved to app data');
    } catch (error) {
        console.error('❌ Error saving frame IDs:', error);
    }
}

/**
 * Load frame IDs from app data
 */
async function loadFrameIdsFromAppData() {
    try {
        const data = await miro.board.getAppData(APP_DATA_KEY);
        if (data) {
            const frameIds = JSON.parse(data);
            
            // Get all frames and match by ID
            const allFrames = await miro.board.get({ type: 'frame' });
            
            boardState.frames.todo = allFrames.find(f => f.id === frameIds.todo);
            boardState.frames.progress = allFrames.find(f => f.id === frameIds.progress);
            boardState.frames.done = allFrames.find(f => f.id === frameIds.done);

            console.log('✅ Frame IDs loaded from app data');
        }
    } catch (error) {
        console.error('❌ Error loading frame IDs:', error);
    }
}

// ============================================================================
// CARD MANAGEMENT (Inside Frames)
// ============================================================================

/**
 * Create a task card INSIDE the correct frame
 */
async function createTaskCard() {
    console.log('➕ Creating task card...');

    // Validate input
    if (!currentTask.taskName.trim()) {
        alert('⚠️ Please enter a task name');
        return;
    }

    const btn = document.getElementById('addTaskBtn');
    setButtonLoading(btn, true);

    try {
        // Ensure frames exist
        if (!boardState.frames[currentTask.status]) {
            throw new Error('Board layout not found. Please click "Setup Board Layout" first.');
        }

        // Get the target frame
        const targetFrame = boardState.frames[currentTask.status];

        // Calculate position inside the frame
        const position = await calculateCardPositionInFrame(targetFrame, currentTask.status);

        // Get assignee info
        const assigneeInfo = boardState.boardMembers.find(m => m.id === currentTask.assigneeId);

        // Build card content
        const cardData = buildCardData(currentTask, assigneeInfo, position);

        // Create the app card
        const appCard = await miro.board.createAppCard(cardData);

        console.log(`✅ Card created: ${appCard.id}`);

        // Clear form
        clearForm();

        // Refresh dashboard
        await refreshDashboard();

        // Zoom to the new card briefly
        await miro.board.viewport.zoomTo(appCard);

    } catch (error) {
        console.error('❌ Error creating card:', error);
        alert(`Failed to create card: ${error.message}`);
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Build app card data structure
 */
function buildCardData(task, assigneeInfo, position) {
    const priorityStyle = PRIORITY_CONFIG[task.priority];
    
    // Title with priority indicator
    const title = `${priorityStyle.emoji} ${task.taskName}`;

    // Description with metadata
    const assigneeName = assigneeInfo ? assigneeInfo.name : 'Unassigned';
    const description = `
        <p><strong>👤 Assignee:</strong> ${assigneeName}</p>
        <p><strong>⚡ Priority:</strong> ${priorityStyle.label}</p>
        <p><strong>📌 Status:</strong> ${getStatusLabel(task.status)}</p>
    `.trim();

    // Card data
    const cardData = {
        title: title,
        description: description,
        x: position.x,
        y: position.y,
        width: CARD_WIDTH,
        style: {
            cardTheme: '#ffffff'
        }
    };

    // Add fields with metadata
    cardData.fields = [
        {
            value: `Status: ${getStatusLabel(task.status)}`,
            iconShape: 'round',
            fillColor: priorityStyle.color,
            tooltip: `Status: ${getStatusLabel(task.status)}`
        }
    ];

    // Add assignee field if assigned
    if (assigneeInfo && assigneeInfo.id) {
        cardData.fields.push({
            value: assigneeName,
            iconShape: 'round',
            fillColor: '#e0e7ff',
            tooltip: `Assignee: ${assigneeName}`
        });
    }

    return cardData;
}

/**
 * Calculate next available position inside a frame
 */
async function calculateCardPositionInFrame(frame, status) {
    try {
        // Get all app cards
        const allCards = await miro.board.get({ type: 'app_card' });

        // Filter cards that are inside this frame
        const cardsInFrame = allCards.filter(card => {
            return isInsideFrame(card, frame);
        });

        // Calculate Y position based on number of existing cards
        const frameTop = frame.y - (frame.height / 2);
        const yPosition = frameTop + CARD_TOP_MARGIN + (cardsInFrame.length * (CARD_HEIGHT + CARD_SPACING));

        return {
            x: frame.x,
            y: yPosition
        };
    } catch (error) {
        console.error('❌ Error calculating position:', error);
        
        // Fallback to frame center
        return {
            x: frame.x,
            y: frame.y
        };
    }
}

/**
 * Check if a card is inside a frame
 */
function isInsideFrame(card, frame) {
    const frameLeft = frame.x - (frame.width / 2);
    const frameRight = frame.x + (frame.width / 2);
    const frameTop = frame.y - (frame.height / 2);
    const frameBottom = frame.y + (frame.height / 2);

    return (
        card.x >= frameLeft &&
        card.x <= frameRight &&
        card.y >= frameTop &&
        card.y <= frameBottom
    );
}

/**
 * Get human-readable status label
 */
function getStatusLabel(status) {
    const labels = {
        todo: 'To Do',
        progress: 'In Progress',
        done: 'Done'
    };
    return labels[status] || status;
}

// ============================================================================
// AUTO-SORTING
// ============================================================================

/**
 * Auto-sort all cards into their correct frames
 */
async function autoSortCards() {
    console.log('🔄 Auto-sorting cards...');

    const btn = document.getElementById('autoSortBtn');
    setButtonLoading(btn, true);

    try {
        // Ensure frames exist
        if (!boardState.frames.todo || !boardState.frames.progress || !boardState.frames.done) {
            throw new Error('Board layout not found. Please click "Setup Board Layout" first.');
        }

        // Get all app cards
        const allCards = await miro.board.get({ type: 'app_card' });

        if (allCards.length === 0) {
            alert('No cards found to sort');
            return;
        }

        let sortedCount = 0;

        // Group cards by detected status
        const cardsByStatus = {
            todo: [],
            progress: [],
            done: []
        };

        // Categorize each card
        for (const card of allCards) {
            const status = detectCardStatus(card);
            if (status && cardsByStatus[status]) {
                cardsByStatus[status].push(card);
            }
        }

        // Sort cards into each frame
        for (const [status, cards] of Object.entries(cardsByStatus)) {
            const frame = boardState.frames[status];
            if (!frame || cards.length === 0) continue;

            const frameTop = frame.y - (frame.height / 2);

            // Position each card
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const newY = frameTop + CARD_TOP_MARGIN + (i * (CARD_HEIGHT + CARD_SPACING));

                try {
                    await miro.board.update({
                        id: card.id,
                        x: frame.x,
                        y: newY
                    });
                    sortedCount++;
                } catch (error) {
                    console.error(`❌ Error updating card ${card.id}:`, error);
                }
            }
        }

        console.log(`✅ Sorted ${sortedCount} cards`);
        alert(`✅ Sorted ${sortedCount} cards into their correct columns!`);

        // Refresh dashboard
        await refreshDashboard();

    } catch (error) {
        console.error('❌ Error auto-sorting:', error);
        alert(`Failed to auto-sort: ${error.message}`);
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Detect card status from its description
 */
function detectCardStatus(card) {
    const description = (card.description || '').toLowerCase();

    if (description.includes('status:</strong> done')) {
        return 'done';
    } else if (description.includes('status:</strong> in progress')) {
        return 'progress';
    } else if (description.includes('status:</strong> to do')) {
        return 'todo';
    }

    // Fallback: detect by position (which frame it's in)
    return detectStatusByPosition(card);
}

/**
 * Detect status by card position (which frame it's closest to)
 */
function detectStatusByPosition(card) {
    let closestStatus = 'todo';
    let minDistance = Infinity;

    for (const [status, frame] of Object.entries(boardState.frames)) {
        if (!frame) continue;
        
        const distance = Math.abs(card.x - frame.x);
        if (distance < minDistance) {
            minDistance = distance;
            closestStatus = status;
        }
    }

    return closestStatus;
}

// ============================================================================
// BI-DIRECTIONAL SYNC (Real-time Updates)
// ============================================================================

/**
 * Start polling the board for changes
 */
function startBoardPolling() {
    if (boardState.isPolling) return;

    console.log('🔄 Starting board polling...');
    boardState.isPolling = true;

    // Poll every 3 seconds
    boardState.pollInterval = setInterval(async () => {
        await pollBoardChanges();
    }, 3000);

    console.log('✅ Board polling started (3s interval)');
}

/**
 * Stop polling
 */
function stopBoardPolling() {
    if (!boardState.isPolling) return;

    console.log('⏸️ Stopping board polling...');
    clearInterval(boardState.pollInterval);
    boardState.isPolling = false;
    boardState.pollInterval = null;
}

/**
 * Poll board for changes and update dashboard
 */
async function pollBoardChanges() {
    try {
        // Silently refresh the dashboard
        await refreshDashboard(true); // true = silent mode
    } catch (error) {
        console.error('❌ Polling error:', error);
    }
}

/**
 * Manual sync button handler
 */
async function syncNow() {
    console.log('🔄 Manual sync triggered...');

    const btn = document.getElementById('syncBtn');
    setButtonLoading(btn, true);

    try {
        await refreshDashboard();
        console.log('✅ Sync complete');
    } catch (error) {
        console.error('❌ Sync error:', error);
    } finally {
        setButtonLoading(btn, false);
    }
}

// ============================================================================
// DASHBOARD & PROGRESS TRACKING
// ============================================================================

/**
 * Refresh dashboard with current board statistics
 */
async function refreshDashboard(silent = false) {
    if (!silent) {
        console.log('📊 Refreshing dashboard...');
    }

    try {
        // Ensure frames are loaded
        if (!boardState.frames.todo) {
            await findExistingFrames();
        }

        // If still no frames, show empty state
        if (!boardState.frames.todo && !boardState.frames.progress && !boardState.frames.done) {
            updateDashboardUI({ todo: 0, progress: 0, done: 0 }, 0);
            return;
        }

        // Get all app cards
        const allCards = await miro.board.get({ type: 'app_card' });

        // Count cards by status (which frame they're in)
        const counts = {
            todo: 0,
            progress: 0,
            done: 0
        };

        for (const card of allCards) {
            if (boardState.frames.todo && isInsideFrame(card, boardState.frames.todo)) {
                counts.todo++;
            } else if (boardState.frames.progress && isInsideFrame(card, boardState.frames.progress)) {
                counts.progress++;
            } else if (boardState.frames.done && isInsideFrame(card, boardState.frames.done)) {
                counts.done++;
            }
        }

        // Calculate progress
        const totalCards = counts.todo + counts.progress + counts.done;
        const progressPercent = totalCards > 0 ? Math.round((counts.done / totalCards) * 100) : 0;

        // Update UI
        updateDashboardUI(counts, progressPercent);

        if (!silent) {
            console.log(`✅ Dashboard updated: ${counts.todo} todo, ${counts.progress} in progress, ${counts.done} done`);
        }

    } catch (error) {
        console.error('❌ Error refreshing dashboard:', error);
    }
}

/**
 * Update dashboard UI elements
 */
function updateDashboardUI(counts, progressPercent) {
    const todoCount = document.getElementById('todoCount');
    const progressCount = document.getElementById('progressCount');
    const doneCount = document.getElementById('doneCount');
    const progressBar = document.getElementById('progressBar');

    if (todoCount) todoCount.textContent = counts.todo;
    if (progressCount) progressCount.textContent = counts.progress;
    if (doneCount) doneCount.textContent = counts.done;

    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
        progressBar.textContent = `${progressPercent}%`;
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');

    // Form inputs
    const taskNameInput = document.getElementById('taskName');
    const assigneeSelect = document.getElementById('assignee');
    const prioritySelect = document.getElementById('priority');
    const statusSelect = document.getElementById('status');

    taskNameInput?.addEventListener('input', (e) => {
        currentTask.taskName = e.target.value.trim();
    });

    assigneeSelect?.addEventListener('change', (e) => {
        currentTask.assigneeId = e.target.value || null;
        currentTask.assignee = e.target.options[e.target.selectedIndex].text;
    });

    prioritySelect?.addEventListener('change', (e) => {
        currentTask.priority = e.target.value;
        updatePriorityPreview(e.target.value);
    });

    statusSelect?.addEventListener('change', (e) => {
        currentTask.status = e.target.value;
    });

    // Enter key to submit
    taskNameInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTaskCard();
        }
    });

    // Buttons
    document.getElementById('addTaskBtn')?.addEventListener('click', createTaskCard);
    document.getElementById('setupBoardBtn')?.addEventListener('click', setupBoardLayout);
    document.getElementById('autoSortBtn')?.addEventListener('click', autoSortCards);
    document.getElementById('syncBtn')?.addEventListener('click', syncNow);

    console.log('✅ Event listeners ready');
}

/**
 * Update priority preview badge
 */
function updatePriorityPreview(priority) {
    const preview = document.getElementById('priorityPreview');
    if (!preview) return;

    const style = PRIORITY_CONFIG[priority];
    preview.textContent = style.label;
    preview.className = `priority-preview ${priority}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Zoom to show entire board
 */
async function zoomToBoard() {
    try {
        await miro.board.viewport.zoomTo({
            x: -350,
            y: 0,
            width: 1600,
            height: 1200
        });
    } catch (error) {
        console.error('❌ Error zooming:', error);
    }
}

/**
 * Clear form inputs
 */
function clearForm() {
    const taskNameInput = document.getElementById('taskName');
    const assigneeSelect = document.getElementById('assignee');

    if (taskNameInput) taskNameInput.value = '';
    if (assigneeSelect) assigneeSelect.selectedIndex = 0;

    currentTask = {
        taskName: '',
        assignee: '',
        assigneeId: null,
        priority: 'medium',
        status: 'todo'
    };
}

/**
 * Set button loading state
 */
function setButtonLoading(button, loading) {
    if (!button) return;

    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        const originalHTML = button.innerHTML;
        button.dataset.originalHTML = originalHTML;
        button.innerHTML = '<span class="spinner"></span><span>Processing...</span>';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        if (button.dataset.originalHTML) {
            button.innerHTML = button.dataset.originalHTML;
        }
    }
}

// ============================================================================
// APP ENTRY POINT
// ============================================================================

// Initialize the app
init();
