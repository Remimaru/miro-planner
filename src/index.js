// Miro Web SDK v2.0 - Project Planner Logic

// Color mapping for sticky notes
const STATUS_COLORS = {
    todo: 'light_blue',  // Blue for To Do
    done: 'light_green'  // Green for Done
};

// Column positions for Kanban layout
const COLUMN_CONFIG = {
    todo: {
        x: -400,
        label: 'TO DO'
    },
    done: {
        x: 400,
        label: 'DONE'
    }
};

const COLUMN_WIDTH = 350;
const CARD_SPACING = 20;
const START_Y = -300;

// State
let selectedStatus = 'todo';

// Initialize the app
async function init() {
    await miro.board.ui.on('icon:click', async () => {
        await miro.board.ui.openPanel({ url: 'index.html' });
    });

    // Set up event listeners once DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
        setupEventListeners();
    }
}

function setupEventListeners() {
    // Status selector
    const statusOptions = document.querySelectorAll('.status-option');
    statusOptions.forEach(option => {
        option.addEventListener('click', () => {
            statusOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedStatus = option.getAttribute('data-status');
        });
    });

    // Add task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskName');

    addTaskBtn.addEventListener('click', async () => {
        const taskName = taskNameInput.value.trim();
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        await addTaskToBoard(taskName, selectedStatus);
        taskNameInput.value = '';
        taskNameInput.focus();
    });

    // Allow Enter key to add task
    taskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Group by status button
    const groupByStatusBtn = document.getElementById('groupByStatusBtn');
    groupByStatusBtn.addEventListener('click', async () => {
        await groupTasksByStatus();
    });
}

// Add a new task to the Miro board
async function addTaskToBoard(taskName, status) {
    try {
        const viewport = await miro.board.viewport.get();
        
        // Create sticky note at viewport center
        const stickyNote = await miro.board.createStickyNote({
            content: taskName,
            style: {
                fillColor: STATUS_COLORS[status]
            },
            x: viewport.x + viewport.width / 2,
            y: viewport.y + viewport.height / 2,
            width: 250
        });

        console.log('Created sticky note:', stickyNote.id);
        
        // Optionally zoom to the new note
        await miro.board.viewport.zoomTo(stickyNote);
        
    } catch (error) {
        console.error('Error creating sticky note:', error);
        alert('Failed to create task. Please try again.');
    }
}

// Group tasks by status into Kanban columns
async function groupTasksByStatus() {
    try {
        // Get all sticky notes from the board
        const allItems = await miro.board.get();
        const stickyNotes = allItems.filter(item => item.type === 'sticky_note');

        if (stickyNotes.length === 0) {
            alert('No sticky notes found on the board');
            return;
        }

        // Group notes by color (status)
        const todoNotes = stickyNotes.filter(note => 
            note.style.fillColor === STATUS_COLORS.todo
        );
        const doneNotes = stickyNotes.filter(note => 
            note.style.fillColor === STATUS_COLORS.done
        );

        console.log(`Found ${todoNotes.length} To Do tasks and ${doneNotes.length} Done tasks`);

        // Position the notes in columns
        await positionNotesInColumn(todoNotes, COLUMN_CONFIG.todo.x);
        await positionNotesInColumn(doneNotes, COLUMN_CONFIG.done.x);

        // Create column headers
        await createColumnHeaders();

        // Zoom to fit all content
        const viewport = await miro.board.viewport.get();
        await miro.board.viewport.zoomTo({
            x: 0,
            y: START_Y,
            width: 1200,
            height: Math.max(todoNotes.length, doneNotes.length) * 120 + 200
        });

        alert(`Organized ${stickyNotes.length} tasks into columns!`);
        
    } catch (error) {
        console.error('Error grouping tasks:', error);
        alert('Failed to organize tasks. Please try again.');
    }
}

// Position notes in a vertical column
async function positionNotesInColumn(notes, columnX) {
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const newY = START_Y + (i * (note.height + CARD_SPACING));
        
        try {
            await miro.board.update({
                type: 'sticky_note',
                id: note.id,
                x: columnX,
                y: newY
            });
        } catch (error) {
            console.error(`Error updating note ${note.id}:`, error);
        }
    }
}

// Create column header labels
async function createColumnHeaders() {
    try {
        // Remove existing headers (text items at specific positions)
        const allItems = await miro.board.get();
        const existingHeaders = allItems.filter(item => 
            item.type === 'text' && 
            (item.content === COLUMN_CONFIG.todo.label || item.content === COLUMN_CONFIG.done.label)
        );
        
        for (const header of existingHeaders) {
            await miro.board.remove(header);
        }

        // Create new headers
        await miro.board.createText({
            content: `<strong>${COLUMN_CONFIG.todo.label}</strong>`,
            x: COLUMN_CONFIG.todo.x,
            y: START_Y - 100,
            width: COLUMN_WIDTH,
            style: {
                color: '#2d9bf0',
                fillColor: 'transparent',
                fillOpacity: 1,
                borderColor: 'transparent',
                borderWidth: 0,
                borderOpacity: 1,
                borderStyle: 'normal',
                fontSize: 24,
                textAlign: 'center'
            }
        });

        await miro.board.createText({
            content: `<strong>${COLUMN_CONFIG.done.label}</strong>`,
            x: COLUMN_CONFIG.done.x,
            y: START_Y - 100,
            width: COLUMN_WIDTH,
            style: {
                color: '#2ea44f',
                fillColor: 'transparent',
                fillOpacity: 1,
                borderColor: 'transparent',
                borderWidth: 0,
                borderOpacity: 1,
                borderStyle: 'normal',
                fontSize: 24,
                textAlign: 'center'
            }
        });
    } catch (error) {
        console.error('Error creating column headers:', error);
    }
}

// Initialize the app
init();
