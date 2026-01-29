# 🎯 Board-Centric Task Planner for Miro

A modern, native-feeling task management app for Miro boards with **board-first interaction**, modal forms, and drag-and-drop functionality.

## ✨ Key Features

### 🖱️ Board-First Interaction
- **Click any task card on the board to edit it** - no need to find it in the sidebar
- All editing happens in clean modal dialogs
- Sidebar is minimal with just essential actions

### 📝 Modal-Based Forms
- Task creation and editing opens in centered modal windows
- Clean, focused interface without cluttering the sidebar
- Form includes: Task name, Assignee, Priority, Status

### 🎯 Drag and Drop
- **Drag the "👆 Drag to Board" template** from sidebar to board
- Drop anywhere in a column to create a new task
- Task form opens automatically with correct status pre-selected

### 🎨 Professional Kanban
- **3 columns:** 📋 TO DO, ⚡ IN PROGRESS, ✅ DONE
- Uses Miro's native **App Cards** (not sticky notes)
- Uses Miro's native **Frames** for columns
- Color-coded by priority: 🔴 High, 🟡 Medium, 🔵 Low

### 🔄 Real-Time Sync
- **Live dashboard** shows task counts (updates every 3 seconds)
- Move cards between frames on the board → dashboard updates automatically
- Bi-directional synchronization

### ⚡ Smart Auto-Sort
- Click "Auto-Sort" to organize cards by priority
- High priority (🔴) cards move to top
- Cards arranged in clean grid layout

---

## 🚀 Quick Start

### 1. Setup Board
1. Open the Miro board
2. Click the app icon in the toolbar
3. Click **"⚙️ Setup Board"** button
4. Three frames will be created automatically

### 2. Create Tasks

**Method 1: New Task Button**
- Click **"➕ New Task"** in sidebar
- Fill out the form in the modal
- Click "Create Task"

**Method 2: Drag and Drop**
- Drag the **"👆 Drag to Board"** template from sidebar
- Drop it in any column (TO DO, IN PROGRESS, or DONE)
- Fill out the form in the modal
- Click "Create Task"

### 3. Edit Tasks
- **Simply click any task card on the board**
- Modal opens with current task data
- Make changes and click "Save Changes"

### 4. Organize
- Click **"Auto-Sort"** to organize cards by priority
- Cards are arranged automatically in a clean grid

---

## 📊 Dashboard Stats

The sidebar shows live statistics:
- **📋 TO DO:** Number of tasks in To Do column
- **⚡ IN PROGRESS:** Number of tasks in progress
- **✅ DONE:** Number of completed tasks
- **📈 TOTAL:** Total tasks across all columns

Updates automatically every 3 seconds.

---

## 🎨 Priority System

Tasks are color-coded by priority:

| Priority | Emoji | Card Color | When to Use |
|----------|-------|------------|-------------|
| **High** | 🔴 | Red | Urgent, critical tasks |
| **Medium** | 🟡 | Yellow | Standard priority |
| **Low** | 🔵 | Blue | Nice to have, low urgency |

---

## 🔧 Technical Details

### Architecture
- **SDK:** Miro Web SDK v2.0
- **Language:** Vanilla JavaScript (no frameworks)
- **UI:** Native HTML/CSS with flexbox layout
- **Storage:** Miro's `setAppData()` / `getAppData()` APIs

### Components

#### Main Files
- `index.html` - Sidebar panel UI (minimal, board-centric design)
- `app.js` - Core logic (event handlers, board management)
- `modal.html` - Task creation/editing form
- `modal.js` - Modal form handler

#### Key Miro SDK Features Used
- **App Cards:** Professional task cards with metadata
- **Frames:** Kanban columns with automatic child management
- **Event Handlers:**
  - `app_card:click` - Detect card clicks for editing
  - `drop` - Handle drag-and-drop from sidebar
  - `icon:click` - Open sidebar panel
- **Modals:** `miro.board.ui.openModal()` for forms
- **Board Data:** Persistent storage for frame references

### Card Structure
Each task card contains:
- **Title:** Priority emoji + task name (e.g., "🔴 Fix login bug")
- **Description:** Priority, Status, Assignee (HTML formatted)
- **Style:** Color theme based on priority
- **Dimensions:** 280px width, automatic height

### Frame Layout
- **Width:** 500px per frame
- **Height:** 2000px (accommodates many cards)
- **Spacing:** 550px horizontal spacing between frames
- **Colors:**
  - TO DO: Light blue (#dbeafe)
  - IN PROGRESS: Light yellow (#fef3c7)
  - DONE: Light green (#d1fae5)

### Card Positioning
- **Grid Layout:** 4 cards per column, then start new column
- **Top Margin:** 100px below frame title
- **Side Margin:** 30px from frame edges
- **Card Spacing:** 25px between cards
- **Auto-positioning:** New cards automatically placed in next available slot

---

## 🎯 Usage Tips

### Best Practices
1. **Setup Board First:** Always click "Setup Board" before creating tasks
2. **Click Cards to Edit:** Don't search in sidebar - just click the card on the board
3. **Use Drag-and-Drop:** Fastest way to create tasks directly where you want them
4. **Auto-Sort Regularly:** Keep board organized by clicking Auto-Sort
5. **Priority Colors:** Use colors to quickly scan board for urgent tasks

### Workflow Example
```
1. Click "Setup Board" (first time only)
2. Drag template → Drop in TO DO column → Create task "Design login page"
3. Drag template → Drop in TO DO column → Create task "Setup database"
4. Click "Auto-Sort" to organize
5. Click a task card → Change status to "In Progress" → Save
6. Task automatically moves to IN PROGRESS column
```

---

## 🐛 Troubleshooting

### Cards Not Appearing
- **Solution:** Click "Setup Board" to create the frames first
- Frames must exist before cards can be created

### Can't Scroll Sidebar
- **Solution:** This is fixed in v3.0 with flexbox layout
- Body has `height: 100vh; display: flex; flex-direction: column;`
- Container has `flex: 1; overflow-y: auto;`

### Modal Not Opening
- **Solution:** Check browser console for errors
- Ensure `modal.html` and `modal.js` are in the same directory as `index.html`

### Cards Not Moving to Correct Frame
- **Solution:** Frames are saved by ID - if deleted, click "Setup Board" again

### Drag-and-Drop Not Working
- **Solution:** Must drag the "👆 Drag to Board" template, not other elements
- Drop must be inside one of the three columns

---

## 📝 Development

### File Structure
```
miro-planner/
├── index.html          # Sidebar UI (board-centric, minimal)
├── app.js             # Core logic (850 lines)
├── modal.html         # Task form UI
├── modal.js           # Form handler
└── README.md          # This file
```

### Event Flow

**Creating a Task:**
```
User clicks "New Task" button
  → app.js opens modal (miro.board.ui.openModal)
  → modal.html loads with empty form
  → modal.js populates assignee dropdown
  → User fills form and clicks "Create Task"
  → modal.js returns data to app.js
  → app.js creates App Card with data
  → app.js places card in correct frame
  → app.js updates dashboard stats
```

**Editing a Task:**
```
User clicks card on board
  → Miro fires 'app_card:click' event
  → app.js opens modal with cardId parameter
  → modal.html loads with form
  → modal.js fetches card data from board
  → modal.js populates form with current values
  → User makes changes and clicks "Save"
  → modal.js returns updated data
  → app.js updates card title, description, style
  → app.js moves card to new frame if status changed
  → app.js updates dashboard stats
```

### Adding New Features

To add a new priority level:
1. Update `PRIORITY_CONFIG` in app.js
2. Add option to priority dropdown in modal.html
3. Update `updatePriorityBadge()` in modal.js

To add a new status column:
1. Update `FRAME_CONFIG` in app.js
2. Update `boardState.frames` to include new frame key
3. Add option to status dropdown in modal.html

---

## 📄 Version History

### v3.0 - Board-Centric Edition (Current)
- ✨ Click cards on board to edit (board-first interaction)
- ✨ Modal forms replace sidebar forms
- ✨ Drag-and-drop from sidebar to board
- ✨ Minimal sidebar with just essential buttons
- 🐛 Fixed scrolling with flexbox layout (`height: 100vh`)
- 🎨 Removed all branding for native Miro tool appearance

### v2.1 - Board-Native Edition
- Native board member integration
- Automatic card placement inside frames
- Bi-directional sync with 3-second polling
- Compact UI improvements

### v2.0 - Professional Edition
- Upgraded from sticky notes to App Cards
- Added Frames for Kanban columns
- Added priority system and auto-sort

### v1.0 - Initial Release
- Basic sticky note planner
- Sidebar-based task creation

---

## 🎓 Learning Resources

- [Miro Web SDK v2.0 Documentation](https://developers.miro.com/docs/web-sdk-reference)
- [App Cards API](https://developers.miro.com/docs/app-card)
- [Frames API](https://developers.miro.com/docs/frame)
- [Modal UI](https://developers.miro.com/docs/ui_openmodal)

---

## 🤝 Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review the browser console for error messages
3. Ensure Miro SDK v2.0 is loaded correctly
4. Verify all HTML/JS files are in the same directory

---

## 📜 License

This is a custom Miro app built with the Miro Web SDK v2.0.

---

**Built with ❤️ using Miro Web SDK v2.0**
