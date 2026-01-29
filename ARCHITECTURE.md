# 🏗️ Kanban Pro - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Miro Board (Canvas)                     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   📋 TO DO   │  │ ⚡ IN PROGRESS│  │   ✅ DONE    │      │
│  │  (Frame)     │  │   (Frame)     │  │   (Frame)    │      │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│  │ 🔴 App Card  │  │ 🟡 App Card   │  │ 🔵 App Card  │      │
│  │ Task 1       │  │ Task 3        │  │ Task 2       │      │
│  │ @Sarah       │  │ @John         │  │ @Mike        │      │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│  │ 🟡 App Card  │  │               │  │ 🔴 App Card  │      │
│  │ Task 4       │  │               │  │ Task 5       │      │
│  │ @Lisa        │  │               │  │ @Sarah       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Miro Web SDK v2.0 API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       app.js (Core Logic)                    │
├─────────────────────────────────────────────────────────────┤
│  • SDK Initialization                                        │
│  • Event Listeners (click, drag, drop)                      │
│  • Frame Management (create, find, cache)                   │
│  • Card Management (create, update, position)               │
│  • Auto-Sort Algorithm (detect status, snap to column)      │
│  • Progress Calculation (count cards by status)             │
│  • Viewport Control (zoom, pan)                             │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ DOM Events
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  index.html (Sidebar UI)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │           📊 Progress Dashboard                       │  │
│  │  ████████████████░░░░░░░░  65% Complete              │  │
│  │  To Do: 5  │  In Progress: 3  │  Done: 12            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           ✨ Create Task Card                         │  │
│  │  Task Name:    [Design homepage mockups       ]      │  │
│  │  Assignee:     [Sarah Chen                    ]      │  │
│  │  Priority:     [🟡 Medium ▼]                         │  │
│  │  Status:       [📋 To Do ▼]                          │  │
│  │  [➕ Add to Board]                                    │  │
│  │  [👆 Drag to Board] ← Draggable                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           🎨 Board Management                         │  │
│  │  [🚀 Initialize Board]                                │  │
│  │  [🔄 Auto-Sort]  [📈 Refresh Stats]                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action → Event Listener → Core Function → Miro SDK API → Board Update
    ↓              ↓                ↓               ↓              ↓
Click "Add"    setupButtons()   createAppCard()  miro.board.*   New Card
    │              │                │               │              │
    └──────────────┴────────────────┴───────────────┴──────────────┘
                          ↓
                   Update Dashboard
                   refreshDashboard()
```

## Key Components

### 1. **Configuration Layer** (`COLUMNS`, `PRIORITY_STYLES`)
- Defines board layout
- Sets visual styling
- Configurable constants

### 2. **State Management** (`currentTaskData`, `frameCache`)
- Tracks form inputs
- Caches frame references for performance
- Reduces API calls

### 3. **Event Handlers**
```javascript
setupFormInputs()      → Tracks user input
setupButtons()         → Button click handlers
setupDragAndDrop()     → Drag/drop functionality
```

### 4. **Core Operations**
```javascript
createAppCard()        → Create professional cards
createColumnFrame()    → Build Kanban columns
handleAutoSort()       → Intelligent positioning
refreshDashboard()     → Update statistics
```

### 5. **Utility Functions**
```javascript
calculateNextCardPosition()  → Smart card placement
detectCardStatus()           → Status identification
zoomToBoard()                → Viewport management
```

## Miro SDK Methods Used

| Method | Purpose | Frequency |
|--------|---------|-----------|
| `miro.board.createAppCard()` | Create task cards | Per task |
| `miro.board.createFrame()` | Create columns | Once (init) |
| `miro.board.get()` | Fetch all items | On demand |
| `miro.board.update()` | Move/modify items | Per sort |
| `miro.board.ui.on('drop')` | Handle drag-drop | Real-time |
| `miro.board.viewport.zoomTo()` | Adjust view | As needed |

## File Structure

```
miro-planner/
│
├── index.html           # UI + Styles (480 lines)
│   ├── Dashboard component
│   ├── Task form
│   ├── Management buttons
│   └── CSS styles
│
├── app.js              # Logic (600+ lines)
│   ├── Configuration
│   ├── Initialization
│   ├── Event handlers
│   ├── Card operations
│   ├── Frame management
│   ├── Auto-sorting
│   └── Progress tracking
│
├── README.md           # Documentation
├── SETUP.html          # Visual setup guide
├── app.config.json     # Configuration metadata
└── .gitignore          # Git exclusions
```

## Performance Optimizations

1. **Frame Caching**: Stores frame references to avoid repeated lookups
2. **Batch Operations**: Groups multiple updates together
3. **Event Debouncing**: Prevents excessive API calls
4. **Lazy Loading**: Only fetches data when needed
5. **Minimal DOM Updates**: Updates UI efficiently

## Error Handling Strategy

```javascript
try {
    // Attempt operation
    await miro.board.createAppCard(...)
    
    // Success feedback
    console.log('✅ Success')
    alert('Task added!')
    
} catch (error) {
    // Error logging
    console.error('❌ Error:', error)
    
    // User-friendly message
    alert('Failed to add task. Please try again.')
}
```

## Security Considerations

- ✅ No sensitive data in client code
- ✅ Input validation on all forms
- ✅ OAuth 2.0 authentication via Miro
- ✅ Scoped permissions (boards:read, boards:write)
- ✅ No external dependencies (no npm packages)

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Miro SDK | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| ES6+ | ✅ | ✅ | ✅ | ✅ |
| Async/Await | ✅ | ✅ | ✅ | ✅ |

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Maintainer**: Senior Frontend Engineer
