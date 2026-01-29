/**
 * Modal handler for task creation and editing
 */

let modalMode = 'create'; // 'create' or 'edit'
let currentCardId = null;
let boardMembers = [];

// Initialize modal
async function initModal() {
    console.log('🔧 Initializing modal...');

    // Load board members
    await loadBoardMembers();

    // Get URL params to check if editing
    const urlParams = new URLSearchParams(window.location.search);
    modalMode = urlParams.get('mode') || 'create';
    currentCardId = urlParams.get('cardId');

    if (modalMode === 'edit' && currentCardId) {
        await loadCardData(currentCardId);
        document.getElementById('modalTitle').textContent = '✏️ Edit Task';
        document.getElementById('saveBtnText').textContent = 'Save Changes';
    }

    // Setup event listeners
    setupEventListeners();

    console.log(`✅ Modal ready (${modalMode} mode)`);
}

// Load board members
async function loadBoardMembers() {
    try {
        const info = await miro.board.getInfo();
        const members = info.members || [];
        
        boardMembers = [
            { id: null, name: 'Unassigned' }
        ];
        
        // Add all board members
        members.forEach(member => {
            boardMembers.push({
                id: member.id,
                name: member.name || 'Unknown',
                isCurrent: false
            });
        });

        populateAssigneeDropdown();
    } catch (error) {
        console.error('❌ Error loading board members:', error);
        boardMembers = [{ id: null, name: 'Unassigned' }];
        populateAssigneeDropdown();
    }
}

// Populate assignee dropdown
function populateAssigneeDropdown() {
    const select = document.getElementById('assignee');
    select.innerHTML = '';

    boardMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id || '';
        option.textContent = member.name + (member.isCurrent ? ' (You)' : '');
        select.appendChild(option);
    });
}

// Load card data for editing
async function loadCardData(cardId) {
    try {
        const cards = await miro.board.get({ type: 'card', id: cardId });
        const card = cards[0];

        if (!card) {
            throw new Error('Card not found');
        }

        // Extract data from card
        const taskName = card.title.replace(/^[🔴🟡🔵]\s+/, ''); // Remove priority emoji
        document.getElementById('taskName').value = taskName;

        // Extract status from description
        const description = card.description || '';
        if (description.includes('Status:</strong> Done')) {
            document.getElementById('status').value = 'done';
        } else if (description.includes('Status:</strong> In Progress')) {
            document.getElementById('status').value = 'progress';
        } else {
            document.getElementById('status').value = 'todo';
        }

        // Extract priority from title emoji
        if (card.title.startsWith('🔴')) {
            document.getElementById('priority').value = 'high';
            updatePriorityBadge('high');
        } else if (card.title.startsWith('🔵')) {
            document.getElementById('priority').value = 'low';
            updatePriorityBadge('low');
        } else {
            document.getElementById('priority').value = 'medium';
            updatePriorityBadge('medium');
        }

        // Load assignee from card (native property)
        if (card.assigneeId) {
            document.getElementById('assignee').value = card.assigneeId;
        }

        console.log('✅ Card data loaded');
    } catch (error) {
        console.error('❌ Error loading card:', error);
        alert('Failed to load card data');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Priority change
    document.getElementById('priority').addEventListener('change', (e) => {
        updatePriorityBadge(e.target.value);
    });

    // Form submit
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSave();
    });

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        miro.board.ui.closeModal();
    });
}

// Update priority badge
function updatePriorityBadge(priority) {
    const badge = document.getElementById('priorityBadge');
    const labels = {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
    };

    badge.textContent = labels[priority];
    badge.className = `priority-badge ${priority}`;
}

// Handle save
async function handleSave() {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;

    try {
        const taskData = {
            taskName: document.getElementById('taskName').value.trim(),
            assigneeId: document.getElementById('assignee').value || null,
            assigneeName: document.getElementById('assignee').selectedOptions[0].text,
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value
        };

        if (!taskData.taskName) {
            alert('Please enter a task name');
            return;
        }

        // Send data back to parent
        if (modalMode === 'create') {
            await miro.board.ui.closeModal({ action: 'create', data: taskData });
        } else {
            await miro.board.ui.closeModal({ 
                action: 'update', 
                data: taskData,
                cardId: currentCardId 
            });
        }

    } catch (error) {
        console.error('❌ Error saving:', error);
        alert('Failed to save task');
    } finally {
        saveBtn.disabled = false;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal);
} else {
    initModal();
}
