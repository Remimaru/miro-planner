/**
 * ============================================================================
 * Board-Centric Task Planner - v3.0
 * ============================================================================
 * A native Miro board integration with:
 * - Click cards to edit (board-first interaction)
 * - Modal forms (no sidebar forms)
 * - Drag-and-drop from sidebar
 * - Automatic frame management
 * - Real-time synchronization
 * 
 * SDK: Miro Web SDK v2.0
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const APP_ID = 'board-task-planner';
const APP_DATA_KEY = 'task-board-config';

// Frame configuration for Kanban columns
const FRAME_CONFIG = {
    todo: {
        title: '📋 TO DO',
        x: -900,
        y: 0,
        width: 500,
        height: 2000,
        color: '#dbeafe',
        status: 'todo'
    },
    progress: {
        title: '⚡ IN PROGRESS',
        x: -350,
        y: 0,
        width: 500,
        height: 2000,
        color: '#fef3c7',
        status: 'progress'
    },
    done: {
        title: '✅ DONE',
        x: 200,
        y: 0,
        width: 500,
        height: 2000,
        color: '#d1fae5',
        status: 'done'
    }
};

// Priority configuration
const PRIORITY_CONFIG = {
    high: { emoji: '🔴', color: '#fee2e2', label: 'High' },
    medium: { emoji: '🟡', color: '#fef3c7', label: 'Medium' },
    low: { emoji: '🔵', color: '#dbeafe', label: 'Low' }
};

// Card layout constants
const CARD_WIDTH = 280;
const CARD_HEIGHT = 150;
const CARD_SPACING = 25;
const CARD_TOP_MARGIN = 100;
const CARD_SIDE_MARGIN = 30;

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let boardState = {
    frames: { todo: null, progress: null, done: null },
    boardMembers: [],
    isInitialized: false,
    lastSync: 0,
    stats: { todo: 0, progress: 0, done: 0 }
};

let syncInterval = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
    console.log('🚀 Initializing Board-Centric Planner...');

    try {
        // Setup event listeners
        setupEventListeners();

        // Load board members
        await loadBoardMembers();

        // Load saved frame references
        await loadBoardState();

        // Start sync polling
        startSyncPolling();

        // Update UI
        await updateDashboard();

        boardState.isInitialized = true;
        console.log('✅ Planner initialized successfully');

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        updateStatus('Initialization failed', true);
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Button: New Task
    document.getElementById('newTaskBtn')?.addEventListener('click', handleNewTask);

    // Button: Setup Board
    document.getElementById('setupBoardBtn')?.addEventListener('click', handleSetupBoard);

    // Button: Auto-Sort
    document.getElementById('autoSortBtn')?.addEventListener('click', handleAutoSort);

    // Card click (edit existing task)
    miro.board.ui.on('card:click', handleCardClick);

    // Drag and drop
    miro.board.ui.on('drop', handleDrop);

    console.log('✅ Event listeners registered');
}

// ============================================================================
// BOARD MEMBER MANAGEMENT
// ============================================================================

async function loadBoardMembers() {
    try {
        const info = await miro.board.getInfo();
        const members = info.members || [];
        
        boardState.boardMembers = [
            { id: null, name: 'Unassigned' }
        ];
        
        // Add all board members
        members.forEach(member => {
            boardState.boardMembers.push({
                id: member.id,
                name: member.name || 'Unknown',
                isCurrent: false
            });
        });

        console.log(`✅ Loaded ${boardState.boardMembers.length} board members`);
    } catch (error) {
        console.error('❌ Error loading board members:', error);
        boardState.boardMembers = [{ id: null, name: 'Unassigned' }];
    }
}

// ============================================================================
// BOARD STATE MANAGEMENT
// ============================================================================

async function loadBoardState() {
    try {
        const savedData = await miro.board.getAppData(APP_DATA_KEY);

        if (savedData) {
            const frameIds = JSON.parse(savedData);
            
            // Verify frames still exist
            for (const [key, frameId] of Object.entries(frameIds)) {
                if (frameId) {
                    try {
                        const frames = await miro.board.get({ type: 'frame', id: frameId });
                        if (frames.length > 0) {
                            boardState.frames[key] = frameId;
                        }
                    } catch (e) {
                        console.warn(`Frame ${key} no longer exists`);
                    }
                }
            }

            console.log('✅ Board state loaded');
        }
    } catch (error) {
        console.error('❌ Error loading board state:', error);
    }
}

async function saveBoardState() {
    try {
        const frameData = JSON.stringify(boardState.frames);
        await miro.board.setAppData(APP_DATA_KEY, frameData);
        console.log('✅ Board state saved');
    } catch (error) {
        console.error('❌ Error saving board state:', error);
    }
}

// ============================================================================
// FRAME MANAGEMENT
// ============================================================================

async function setupBoard() {
    updateStatus('Creating board structure...', false);

    try {
        // Create all frames
        for (const [key, config] of Object.entries(FRAME_CONFIG)) {
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

            boardState.frames[key] = frame.id;
            console.log(`✅ Created frame: ${config.title}`);
        }

        // Save frame references
        await saveBoardState();

        // Zoom to fit frames
        await zoomToFrames();

        updateStatus('✅ Board setup complete!', false);
        setTimeout(() => updateStatus('', false), 2000);

    } catch (error) {
        console.error('❌ Error setting up board:', error);
        updateStatus('Failed to setup board', true);
    }
}

async function zoomToFrames() {
    try {
        const frameObjects = Object.values(boardState.frames).filter(id => id !== null);
        if (frameObjects.length > 0) {
            const frames = await miro.board.get({ type: 'frame' });
            const targetFrames = frames.filter(f => frameObjects.includes(f.id));
            
            if (targetFrames.length > 0) {
                await miro.board.viewport.zoomTo(targetFrames);
            }
        }
    } catch (error) {
        console.warn('⚠️ Could not zoom to frames:', error);
    }
}

// ============================================================================
// TASK MODAL HANDLERS
// ============================================================================

async function handleNewTask() {
    updateStatus('Opening task form...', false);

    try {
        // Open modal for new task
        const result = await miro.board.ui.openModal({
            url: 'modal.html?mode=create',
            width: 600,
            height: 550
        });

        if (result && result.action === 'create') {
            await createTask(result.data);
        }

        updateStatus('', false);

    } catch (error) {
        console.error('❌ Error opening modal:', error);
        updateStatus('Failed to open form', true);
    }
}

async function handleCardClick(event) {
    const cardId = event.item.id;
    
    updateStatus('Opening task editor...', false);

    try {
        // Open modal for editing
        const result = await miro.board.ui.openModal({
            url: `modal.html?mode=edit&cardId=${cardId}`,
            width: 600,
            height: 550
        });

        if (result && result.action === 'update') {
            await updateTask(result.cardId, result.data);
        }

        updateStatus('', false);

    } catch (error) {
        console.error('❌ Error editing task:', error);
        updateStatus('Failed to edit task', true);
    }
}

// ============================================================================
// DRAG AND DROP
// ============================================================================

async function handleDrop(event) {
    const { x, y, target } = event;

    // Check if drop initiated from sidebar
    if (!event.data || event.data.source !== 'sidebar') {
        return; // Not our drag operation
    }

    updateStatus('Creating task...', false);

    try {
        // Determine which frame contains drop position
        const targetFrame = await getFrameAtPosition(x, y);

        if (!targetFrame) {
            updateStatus('Please drop inside a column', true);
            return;
        }

        // Open modal for new task with pre-set status
        const status = Object.keys(FRAME_CONFIG).find(
            key => boardState.frames[key] === targetFrame.id
        ) || 'todo';

        const result = await miro.board.ui.openModal({
            url: `modal.html?mode=create&status=${status}`,
            width: 600,
            height: 550
        });

        if (result && result.action === 'create') {
            // Override status based on drop location
            result.data.status = status;
            await createTask(result.data, x, y);
        }

        updateStatus('', false);

    } catch (error) {
        console.error('❌ Error handling drop:', error);
        updateStatus('Failed to create task', true);
    }
}

async function getFrameAtPosition(x, y) {
    try {
        const frames = await miro.board.get({ type: 'frame' });
        
        for (const frame of frames) {
            if (Object.values(boardState.frames).includes(frame.id)) {
                const left = frame.x - frame.width / 2;
                const right = frame.x + frame.width / 2;
                const top = frame.y - frame.height / 2;
                const bottom = frame.y + frame.height / 2;

                if (x >= left && x <= right && y >= top && y <= bottom) {
                    return frame;
                }
            }
        }
    } catch (error) {
        console.error('❌ Error getting frame at position:', error);
    }

    return null;
}

// ============================================================================
// TASK CREATION & UPDATE
// ============================================================================

async function createTask(taskData, dropX = null, dropY = null) {
    updateStatus('Creating task card...', false);

    try {
        // Get target frame
        const frameId = boardState.frames[taskData.status];
        if (!frameId) {
            updateStatus('⚠️ Please setup board first', true);
            return;
        }

        // Build card title with priority
        const priorityEmoji = PRIORITY_CONFIG[taskData.priority].emoji;
        const title = `${priorityEmoji} ${taskData.taskName}`;

        // Build description
        const description = `<p><strong>Priority:</strong> ${PRIORITY_CONFIG[taskData.priority].label}</p>
<p><strong>Status:</strong> ${getStatusLabel(taskData.status)}</p>`;

        // Determine position
        let position;
        if (dropX !== null && dropY !== null) {
            position = { x: dropX, y: dropY };
        } else {
            position = await getNextCardPosition(frameId);
        }

        // Create card with assignee (profile picture will show)
        const cardConfig = {
            title: title,
            description: description,
            style: {
                fillColor: PRIORITY_CONFIG[taskData.priority].color
            },
            x: position.x,
            y: position.y,
            width: CARD_WIDTH
        };
        
        // Add assignee if selected (enables profile picture)
        if (taskData.assigneeId) {
            cardConfig.assigneeId = taskData.assigneeId;
        }
        
        const card = await miro.board.createCard(cardConfig);

        // Move card into frame
        const frame = await miro.board.getById(frameId);
        const children = await frame.getChildren();
        await frame.add([card, ...children]);

        console.log(`✅ Task created: ${taskData.taskName}`);
        updateStatus('✅ Task created!', false);
        
        await updateDashboard();

        setTimeout(() => updateStatus('', false), 2000);

    } catch (error) {
        console.error('❌ Error creating task:', error);
        updateStatus('Failed to create task', true);
    }
}

async function updateTask(cardId, taskData) {
    updateStatus('Updating task...', false);

    try {
        const cards = await miro.board.get({ type: 'card', id: cardId });
        const card = cards[0];

        if (!card) {
            throw new Error('Card not found');
        }

        // Update title
        const priorityEmoji = PRIORITY_CONFIG[taskData.priority].emoji;
        const title = `${priorityEmoji} ${taskData.taskName}`;

        // Update description
        const description = `<p><strong>Priority:</strong> ${PRIORITY_CONFIG[taskData.priority].label}</p>
<p><strong>Status:</strong> ${getStatusLabel(taskData.status)}</p>`;

        await card.sync();
        card.title = title;
        card.description = description;
        card.style.fillColor = PRIORITY_CONFIG[taskData.priority].color;
        
        // Update assignee (profile picture will update)
        card.assigneeId = taskData.assigneeId || undefined;
        
        await card.sync();

        // Move to correct frame if status changed
        const currentFrame = await getCardFrame(card);
        const targetFrameId = boardState.frames[taskData.status];

        if (currentFrame && currentFrame.id !== targetFrameId) {
            // Remove from old frame
            const oldChildren = await currentFrame.getChildren();
            const newOldChildren = oldChildren.filter(child => child.id !== card.id);
            await currentFrame.setChildren(newOldChildren);

            // Add to new frame
            const targetFrame = await miro.board.getById(targetFrameId);
            const position = await getNextCardPosition(targetFrameId);
            card.x = position.x;
            card.y = position.y;
            await card.sync();

            const newChildren = await targetFrame.getChildren();
            await targetFrame.add([card, ...newChildren]);
        }

        console.log(`✅ Task updated: ${taskData.taskName}`);
        updateStatus('✅ Task updated!', false);
        
        await updateDashboard();

        setTimeout(() => updateStatus('', false), 2000);

    } catch (error) {
        console.error('❌ Error updating task:', error);
        updateStatus('Failed to update task', true);
    }
}

async function getCardFrame(card) {
    try {
        const frames = await miro.board.get({ type: 'frame' });
        
        for (const frame of frames) {
            if (Object.values(boardState.frames).includes(frame.id)) {
                const children = await frame.getChildren();
                if (children.some(child => child.id === card.id)) {
                    return frame;
                }
            }
        }
    } catch (error) {
        console.error('❌ Error getting card frame:', error);
    }

    return null;
}

async function getNextCardPosition(frameId) {
    try {
        const frame = await miro.board.getById(frameId);
        const children = await frame.getChildren();
        
        // Filter to only cards
        const cards = children.filter(item => item.type === 'card');

        // Calculate next position
        const column = Math.floor(cards.length / 4); // 4 cards per column
        const row = cards.length % 4;

        const baseX = frame.x - frame.width / 2 + CARD_SIDE_MARGIN + CARD_WIDTH / 2;
        const baseY = frame.y - frame.height / 2 + CARD_TOP_MARGIN;

        return {
            x: baseX + (column * (CARD_WIDTH + CARD_SPACING)),
            y: baseY + (row * (CARD_HEIGHT + CARD_SPACING))
        };

    } catch (error) {
        console.error('❌ Error calculating position:', error);
        const frame = await miro.board.getById(frameId);
        return { x: frame.x, y: frame.y };
    }
}

// ============================================================================
// AUTO-SORT FUNCTIONALITY
// ============================================================================

async function handleAutoSort() {
    updateStatus('Organizing cards...', false);

    try {
        for (const [status, frameId] of Object.entries(boardState.frames)) {
            if (!frameId) continue;

            const frame = await miro.board.getById(frameId);
            const children = await frame.getChildren();
            const cards = children.filter(item => item.type === 'card');

            // Sort cards by priority
            cards.sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                const aPriority = a.title.startsWith('🔴') ? 'high' : a.title.startsWith('🔵') ? 'low' : 'medium';
                const bPriority = b.title.startsWith('🔴') ? 'high' : b.title.startsWith('🔵') ? 'low' : 'medium';
                return priorityOrder[aPriority] - priorityOrder[bPriority];
            });

            // Reposition cards
            const baseX = frame.x - frame.width / 2 + CARD_SIDE_MARGIN + CARD_WIDTH / 2;
            const baseY = frame.y - frame.height / 2 + CARD_TOP_MARGIN;

            for (let i = 0; i < cards.length; i++) {
                const column = Math.floor(i / 4);
                const row = i % 4;

                cards[i].x = baseX + (column * (CARD_WIDTH + CARD_SPACING));
                cards[i].y = baseY + (row * (CARD_HEIGHT + CARD_SPACING));
                await cards[i].sync();
            }
        }

        updateStatus('✅ Cards organized!', false);
        setTimeout(() => updateStatus('', false), 2000);

    } catch (error) {
        console.error('❌ Error auto-sorting:', error);
        updateStatus('Failed to organize cards', true);
    }
}

// ============================================================================
// DASHBOARD & SYNC
// ============================================================================

async function updateDashboard() {
    try {
        // Count cards in each frame
        const stats = { todo: 0, progress: 0, done: 0 };

        for (const [status, frameId] of Object.entries(boardState.frames)) {
            if (!frameId) continue;

            const frame = await miro.board.getById(frameId);
            const children = await frame.getChildren();
            const cards = children.filter(item => item.type === 'card');
            stats[status] = cards.length;
        }

        boardState.stats = stats;
        boardState.lastSync = Date.now();

        // Update UI
        document.getElementById('todoCount').textContent = stats.todo;
        document.getElementById('progressCount').textContent = stats.progress;
        document.getElementById('doneCount').textContent = stats.done;

        const total = stats.todo + stats.progress + stats.done;
        document.getElementById('totalCount').textContent = total;

    } catch (error) {
        console.error('❌ Error updating dashboard:', error);
    }
}

function startSyncPolling() {
    // Update dashboard every 3 seconds
    syncInterval = setInterval(async () => {
        await updateDashboard();
    }, 3000);

    console.log('✅ Sync polling started');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getStatusLabel(status) {
    const labels = {
        todo: 'To Do',
        progress: 'In Progress',
        done: 'Done'
    };
    return labels[status] || status;
}

function updateStatus(message, isError = false) {
    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = isError ? 'error' : '';
    }
}

// ============================================================================
// BUTTON HANDLERS
// ============================================================================

async function handleSetupBoard() {
    // Check if frames already exist
    const hasFrames = Object.values(boardState.frames).some(id => id !== null);

    if (hasFrames) {
        const confirmed = confirm('Board already setup. Create new frames?');
        if (!confirmed) return;
    }

    await setupBoard();
}

// ============================================================================
// DRAG TEMPLATE SETUP
// ============================================================================

// Make drag template draggable
document.addEventListener('DOMContentLoaded', () => {
    const dragTemplate = document.getElementById('dragTemplate');
    
    if (dragTemplate) {
        dragTemplate.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('application/json', JSON.stringify({ source: 'sidebar' }));
            miro.board.ui.startDrag({ source: 'sidebar' });
        });
    }
});

// ============================================================================
// INITIALIZE APP
// ============================================================================

miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({ url: 'index.html' });
});

// Initialize when panel opens
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
