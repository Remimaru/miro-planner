/**
 * ============================================================================
 * Professional Kanban Planner - Miro Web SDK v2
 * ============================================================================
 * A production-ready project management app using App Cards and Frames
 * 
 * Features:
 * - App Cards with metadata (task name, assignee, priority, status)
 * - Three Kanban columns using Miro Frames
 * - Drag-and-drop support from sidebar
 * - Auto-sorting into correct columns
 * - Real-time progress tracking dashboard
 * 
 * Author: Senior Frontend Engineer
 * Date: January 2026
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const APP_ID = 'kanban-pro'; // Unique identifier for our app cards

// Column configuration for Kanban board
const COLUMNS = {
    todo: {
        title: '📋 TO DO',
        x: -800,
        y: 0,
        width: 450,
        height: 1200,
        color: '#e0f2fe', // Light blue
        status: 'todo'
    },
    progress: {
        title: '⚡ IN PROGRESS',
        x: -300,
        y: 0,
        width: 450,
        height: 1200,
        color: '#fef3c7', // Light yellow
        status: 'progress'
    },
    done: {
        title: '✅ DONE',
        x: 200,
        y: 0,
        width: 450,
        height: 1200,
        color: '#d1fae5', // Light green
        status: 'done'
    }
};

// Card styling based on priority
const PRIORITY_STYLES = {
    high: {
        emoji: '🔴',
        color: '#fecaca',
        label: 'High'
    },
    medium: {
        emoji: '🟡',
        color: '#fde68a',
        label: 'Medium'
    },
    low: {
        emoji: '🔵',
        color: '#bfdbfe',
        label: 'Low'
    }
};

// Layout constants
const CARD_WIDTH = 300;
const CARD_SPACING_Y = 20;
const CARD_PADDING_X = 75; // Padding from frame edges
const CARD_START_Y = 150; // Starting Y position inside frame

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let currentTaskData = {
    taskName: '',
    assignee: '',
    priority: 'medium',
    status: 'todo'
};

let frameCache = {
    todo: null,
    progress: null,
    done: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the Miro app
 * Sets up icon click handler and event listeners
 */
async function init() {
    console.log('🚀 Initializing Kanban Pro...');

    // Register icon click handler to open sidebar
    await miro.board.ui.on('icon:click', async () => {
        await miro.board.ui.openPanel({ url: 'index.html' });
    });

    // Set up event listeners when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
        setupEventListeners();
    }

    console.log('✅ Kanban Pro initialized');
}

/**
 * Set up all event listeners for UI interactions
 */
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');

    // Form input listeners
    setupFormInputs();
    
    // Button listeners
    setupButtons();
    
    // Drag and drop listener
    setupDragAndDrop();

    // Initial dashboard refresh
    refreshDashboard();

    console.log('✅ Event listeners ready');
}

// ============================================================================
// FORM INPUT HANDLERS
// ============================================================================

/**
 * Set up form input handlers
 */
function setupFormInputs() {
    const taskNameInput = document.getElementById('taskName');
    const assigneeInput = document.getElementById('assignee');
    const prioritySelect = document.getElementById('priority');
    const statusSelect = document.getElementById('status');
    const priorityPreview = document.getElementById('priorityPreview');

    // Update current task data on input changes
    taskNameInput?.addEventListener('input', (e) => {
        currentTaskData.taskName = e.target.value.trim();
    });

    assigneeInput?.addEventListener('input', (e) => {
        currentTaskData.assignee = e.target.value.trim();
    });

    prioritySelect?.addEventListener('change', (e) => {
        currentTaskData.priority = e.target.value;
        updatePriorityPreview(e.target.value, priorityPreview);
    });

    statusSelect?.addEventListener('change', (e) => {
        currentTaskData.status = e.target.value;
    });

    // Allow Enter key in task name to add task
    taskNameInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('addTaskBtn')?.click();
        }
    });
}

/**
 * Update priority preview badge
 */
function updatePriorityPreview(priority, element) {
    if (!element) return;
    
    const style = PRIORITY_STYLES[priority];
    element.textContent = style.label;
    element.className = `priority-preview ${priority}`;
}

// ============================================================================
// BUTTON HANDLERS
// ============================================================================

/**
 * Set up button click handlers
 */
function setupButtons() {
    // Add Task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    addTaskBtn?.addEventListener('click', async () => {
        await handleAddTask();
    });

    // Initialize Board button
    const initBoardBtn = document.getElementById('initBoardBtn');
    initBoardBtn?.addEventListener('click', async () => {
        await handleInitializeBoard();
    });

    // Auto-Sort button
    const autoSortBtn = document.getElementById('autoSortBtn');
    autoSortBtn?.addEventListener('click', async () => {
        await handleAutoSort();
    });

    // Refresh Stats button
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn?.addEventListener('click', async () => {
        await refreshDashboard();
    });
}

// ============================================================================
// DRAG AND DROP
// ============================================================================

/**
 * Set up drag and drop functionality
 */
function setupDragAndDrop() {
    const dragBtn = document.getElementById('dragTaskBtn');
    
    if (!dragBtn) return;

    // Handle drag start
    dragBtn.addEventListener('dragstart', (e) => {
        console.log('🖱️ Drag started');
        
        // Validate task data
        if (!currentTaskData.taskName) {
            e.preventDefault();
            alert('Please enter a task name before dragging');
            return;
        }

        // Store task data for the drop event
        e.dataTransfer.setData('application/json', JSON.stringify(currentTaskData));
    });

    // Register drop handler with Miro
    miro.board.ui.on('drop', async ({ x, y, target }) => {
        console.log(`📍 Drop detected at (${x}, ${y})`);
        
        // Create card at drop position
        await createAppCard(currentTaskData, x, y);
        
        // Clear form
        clearForm();
        
        // Refresh dashboard
        await refreshDashboard();
    });
}

// ============================================================================
// TASK MANAGEMENT
// ============================================================================

/**
 * Handle adding a task to the board
 */
async function handleAddTask() {
    console.log('➕ Adding task to board...');

    // Validate input
    if (!currentTaskData.taskName) {
        alert('⚠️ Please enter a task name');
        return;
    }

    const btn = document.getElementById('addTaskBtn');
    setButtonLoading(btn, true);

    try {
        // Find or create frames first
        await ensureFramesExist();

        // Get the frame for the selected status
        const frame = frameCache[currentTaskData.status];
        
        if (!frame) {
            throw new Error('Frame not found. Please initialize the board first.');
        }

        // Calculate position inside the frame
        const position = await calculateNextCardPosition(currentTaskData.status);

        // Create the app card
        await createAppCard(currentTaskData, position.x, position.y);

        // Clear form
        clearForm();

        // Refresh dashboard
        await refreshDashboard();

        console.log('✅ Task added successfully');
    } catch (error) {
        console.error('❌ Error adding task:', error);
        alert(`Failed to add task: ${error.message}`);
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Create an App Card on the Miro board
 */
async function createAppCard(taskData, x, y) {
    const priorityStyle = PRIORITY_STYLES[taskData.priority];
    
    // Build card title with priority indicator
    const cardTitle = `${priorityStyle.emoji} ${taskData.taskName}`;
    
    // Build card description
    const description = `
        <p><strong>👤 Assignee:</strong> ${taskData.assignee || 'Unassigned'}</p>
        <p><strong>⚡ Priority:</strong> ${priorityStyle.label}</p>
        <p><strong>📌 Status:</strong> ${getStatusLabel(taskData.status)}</p>
    `.trim();

    try {
        const appCard = await miro.board.createAppCard({
            title: cardTitle,
            description: description,
            x: x,
            y: y,
            width: CARD_WIDTH,
            style: {
                cardTheme: '#ffffff'
            },
            // Store metadata for filtering and sorting
            fields: [
                {
                    value: taskData.status,
                    iconShape: 'round',
                    fillColor: priorityStyle.color,
                    tooltip: `Status: ${getStatusLabel(taskData.status)}`
                },
                {
                    value: taskData.assignee || 'Unassigned',
                    iconShape: 'round',
                    fillColor: '#e5e7eb',
                    tooltip: `Assignee: ${taskData.assignee || 'Unassigned'}`
                }
            ]
        });

        console.log('✅ App card created:', appCard.id);
        return appCard;
    } catch (error) {
        console.error('❌ Error creating app card:', error);
        throw error;
    }
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
// BOARD INITIALIZATION
// ============================================================================

/**
 * Initialize the Kanban board with frames
 */
async function handleInitializeBoard() {
    console.log('🚀 Initializing Kanban board...');

    const btn = document.getElementById('initBoardBtn');
    setButtonLoading(btn, true);

    try {
        // Clear frame cache
        frameCache = { todo: null, progress: null, done: null };

        // Create all three columns
        for (const [key, config] of Object.entries(COLUMNS)) {
            const frame = await createColumnFrame(config);
            frameCache[key] = frame;
            console.log(`✅ Created ${config.title} column`);
        }

        // Zoom to fit all frames
        await zoomToBoard();

        alert('✅ Board initialized! Three columns are ready: To Do, In Progress, and Done.');
        
        // Refresh dashboard
        await refreshDashboard();

    } catch (error) {
        console.error('❌ Error initializing board:', error);
        alert(`Failed to initialize board: ${error.message}`);
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Create a column frame
 */
async function createColumnFrame(config) {
    try {
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

        return frame;
    } catch (error) {
        console.error(`❌ Error creating frame ${config.title}:`, error);
        throw error;
    }
}

/**
 * Ensure frames exist (find existing or prompt to create)
 */
async function ensureFramesExist() {
    // Check if we have cached frames
    if (frameCache.todo && frameCache.progress && frameCache.done) {
        return;
    }

    // Try to find existing frames by title
    const allItems = await miro.board.get();
    const frames = allItems.filter(item => item.type === 'frame');

    frameCache.todo = frames.find(f => f.title.includes('TO DO'));
    frameCache.progress = frames.find(f => f.title.includes('IN PROGRESS'));
    frameCache.done = frames.find(f => f.title.includes('DONE'));

    // If frames don't exist, throw error to prompt user
    if (!frameCache.todo || !frameCache.progress || !frameCache.done) {
        throw new Error('Board not initialized. Please click "Initialize Board" first.');
    }
}

// ============================================================================
// AUTO-SORTING
// ============================================================================

/**
 * Auto-sort all app cards into their correct columns
 */
async function handleAutoSort() {
    console.log('🔄 Auto-sorting cards...');

    const btn = document.getElementById('autoSortBtn');
    setButtonLoading(btn, true);

    try {
        // Ensure frames exist
        await ensureFramesExist();

        // Get all app cards
        const allItems = await miro.board.get();
        const appCards = allItems.filter(item => item.type === 'app_card');

        if (appCards.length === 0) {
            alert('No cards found to sort');
            return;
        }

        let sortedCount = 0;

        // Group cards by status
        const cardsByStatus = {
            todo: [],
            progress: [],
            done: []
        };

        // Categorize cards based on their description or current position
        for (const card of appCards) {
            const status = detectCardStatus(card);
            if (status) {
                cardsByStatus[status].push(card);
            }
        }

        // Sort each column
        for (const [status, cards] of Object.entries(cardsByStatus)) {
            if (cards.length === 0) continue;

            const frame = frameCache[status];
            if (!frame) continue;

            // Position each card in the column
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const newY = frame.y - frame.height / 2 + CARD_START_Y + (i * (card.height + CARD_SPACING_Y));
                
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
 * Detect card status from description
 */
function detectCardStatus(card) {
    const description = card.description?.toLowerCase() || '';
    
    if (description.includes('status:</strong> done')) {
        return 'done';
    } else if (description.includes('status:</strong> in progress')) {
        return 'progress';
    } else if (description.includes('status:</strong> to do')) {
        return 'todo';
    }

    // Fallback: check which frame the card is closest to
    return detectStatusByPosition(card);
}

/**
 * Detect status by card position (closest frame)
 */
function detectStatusByPosition(card) {
    const distances = {};
    
    for (const [status, frame] of Object.entries(frameCache)) {
        if (!frame) continue;
        const distance = Math.abs(card.x - frame.x);
        distances[status] = distance;
    }

    // Return status with minimum distance
    return Object.keys(distances).reduce((a, b) => 
        distances[a] < distances[b] ? a : b
    );
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

/**
 * Refresh the dashboard with current statistics
 */
async function refreshDashboard() {
    console.log('📊 Refreshing dashboard...');

    try {
        // Get all app cards
        const allItems = await miro.board.get();
        const appCards = allItems.filter(item => item.type === 'app_card');

        // Count cards by status
        const counts = {
            todo: 0,
            progress: 0,
            done: 0
        };

        for (const card of appCards) {
            const status = detectCardStatus(card);
            if (status && counts.hasOwnProperty(status)) {
                counts[status]++;
            }
        }

        // Update UI
        const totalCards = counts.todo + counts.progress + counts.done;
        const progressPercent = totalCards > 0 ? Math.round((counts.done / totalCards) * 100) : 0;

        updateDashboardUI(counts, progressPercent);

        console.log(`✅ Dashboard updated: ${counts.todo} todo, ${counts.progress} in progress, ${counts.done} done`);
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
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate the next card position in a column
 */
async function calculateNextCardPosition(status) {
    const frame = frameCache[status];
    
    if (!frame) {
        throw new Error('Frame not found');
    }

    // Get all app cards
    const allItems = await miro.board.get();
    const appCards = allItems.filter(item => item.type === 'app_card');

    // Find cards in this column (within frame bounds)
    const cardsInColumn = appCards.filter(card => {
        return Math.abs(card.x - frame.x) < frame.width / 2;
    });

    // Calculate Y position based on number of cards
    const yOffset = cardsInColumn.length * (250 + CARD_SPACING_Y); // Approximate card height
    const y = frame.y - frame.height / 2 + CARD_START_Y + yOffset;

    return {
        x: frame.x,
        y: y
    };
}

/**
 * Zoom viewport to show entire board
 */
async function zoomToBoard() {
    try {
        const viewport = {
            x: 0,
            y: 0,
            width: 2000,
            height: 1400
        };

        await miro.board.viewport.zoomTo(viewport);
    } catch (error) {
        console.error('❌ Error zooming to board:', error);
    }
}

/**
 * Clear the form inputs
 */
function clearForm() {
    const taskNameInput = document.getElementById('taskName');
    const assigneeInput = document.getElementById('assignee');

    if (taskNameInput) taskNameInput.value = '';
    if (assigneeInput) assigneeInput.value = '';

    // Reset state
    currentTaskData = {
        taskName: '',
        assignee: '',
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
