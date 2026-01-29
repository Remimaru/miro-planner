# 🎯 Kanban Pro - Professional Miro Project Planner

A production-ready Kanban board application built with **Miro Web SDK v2.0**. Features professional App Cards, automatic frame-based organization, drag-and-drop support, and real-time progress tracking.

Built with **pure vanilla JavaScript** - no frameworks required.

---

## ✨ Features

### 🎴 Professional App Cards
- **Rich task cards** with metadata (not basic sticky notes)
- **Task details**: Name, Assignee, Priority (High/Med/Low), Status
- **Visual indicators**: Color-coded priority badges
- **Structured data**: Metadata stored in card fields for filtering

### 📊 Smart Kanban Board
- **Three organized columns**: To Do, In Progress, Done
- **Frame-based layout**: Uses Miro Frames for visual organization
- **Auto-initialization**: One-click board setup with colored columns
- **Professional appearance**: Clean, color-coded columns

### 🚀 Auto-Sorting Intelligence
- **Smart positioning**: Automatically snaps cards into correct columns
- **Status detection**: Reads card metadata to determine placement
- **Batch organization**: Sorts all cards at once
- **Maintains order**: Vertical stacking with proper spacing

### 📈 Real-Time Progress Dashboard
- **Visual progress bar**: See completion percentage at a glance
- **Task statistics**: Count of tasks in each column
- **Live updates**: Refresh stats with one click
- **Color-coded metrics**: Easy to read at a glance

### 🖱️ Drag & Drop Support
- **Direct placement**: Drag tasks from sidebar to board
- **Precise positioning**: Place cards exactly where you want them
- **Instant creation**: Cards appear immediately on drop
- **Intuitive workflow**: Natural interaction pattern

---

## 🚀 Quick Start

### 1. Local Development Setup

```powershell
# Clone or download this repository
cd miro-planner

# Start a local web server (choose one):

# Option A: Python 3
python -m http.server 8000

# Option B: Node.js
npx http-server -p 8000

# Option C: PHP
php -S localhost:8000
```

Your app will be available at `http://localhost:8000`

### 2. Create Miro App

1. Go to [Miro Developer Portal](https://miro.com/app/settings/user-profile/apps)
2. Click **"Create new app"**
3. Fill in app details:
   - **App Name**: Kanban Pro
   - **Description**: Professional project management for Miro

### 3. Configure Permissions

Set the following permissions (required):
- ✅ `boards:read` - Read board content
- ✅ `boards:write` - Create and update cards/frames

### 4. Set App URLs

- **App URL**: `http://localhost:8000/`
- **Web-plugin URL**: `http://localhost:8000/`

### 5. Install & Use

1. Click **"Install app and get OAuth token"**
2. Select your team and authorize
3. Open any Miro board
4. Click the **Kanban Pro icon** in the left sidebar
5. Start creating tasks!

---

## 📖 User Guide

### Initial Board Setup

1. **Open the app** by clicking its icon in the sidebar
2. **Click "Initialize Board"** to create three columns:
   - 📋 To Do (Blue)
   - ⚡ In Progress (Yellow)
   - ✅ Done (Green)
3. Board is ready for tasks!

### Creating Tasks

**Method 1: Add to Board**
1. Enter **Task Name** (e.g., "Design homepage mockup")
2. Enter **Assignee** (e.g., "Sarah Chen")
3. Select **Priority**: High 🔴, Medium 🟡, or Low 🔵
4. Select **Status**: To Do, In Progress, or Done
5. Click **"Add to Board"**

**Method 2: Drag & Drop**
1. Fill in task details
2. **Click and hold** the "Drag to Board" button
3. **Drag** onto the board
4. **Drop** at your desired position

### Organizing Cards

- **Auto-Sort**: Click "Auto-Sort" to organize all cards into their correct columns
- **Manual Move**: Drag cards between columns manually
- **Status Update**: Edit card descriptions to change status

### Progress Tracking

- **Dashboard** shows:
  - Overall completion percentage
  - Count of tasks in each column
- **Refresh Stats** button updates metrics
- **Color-coded** for quick scanning

---

## 📁 Project Structure

```
miro-planner/
├── index.html          # Sidebar UI (card creator + dashboard)
├── app.js              # Miro SDK logic (core functionality)
└── README.md           # This file
```

### `index.html`
- Responsive sidebar interface
- Task creation form with validation
- Real-time progress dashboard
- Gradient design with smooth animations
- Drag-and-drop button with visual feedback

### `app.js`
- **Configuration**: Column layout, priority styles
- **Initialization**: SDK setup and event registration
- **Card Management**: Create, update, position App Cards
- **Frame Management**: Initialize and manage column frames
- **Auto-Sorting**: Intelligent card positioning algorithm
- **Progress Tracking**: Real-time statistics calculation
- **Drag & Drop**: Handler for sidebar-to-board dragging

---

## 🛠️ Technical Details

### Technologies
- **Miro Web SDK v2.0** - Official Miro integration API
- **Vanilla JavaScript** - No frameworks (React/Vue/etc)
- **Modern CSS3** - Gradients, animations, flexbox/grid
- **HTML5** - Semantic markup

### Key Miro SDK Methods Used

```javascript
// Create professional app cards
miro.board.createAppCard({
    title, description, x, y, width,
    style, fields
})

// Create visual columns
miro.board.createFrame({
    title, x, y, width, height,
    style: { fillColor }
})

// Drag and drop support
miro.board.ui.on('drop', async ({ x, y }) => {
    // Handle drop event
})

// Update card positions
miro.board.update({
    id, x, y
})

// Query board items
miro.board.get() // Returns all items
```

### Architecture Patterns

- **State Management**: Cached frame references for performance
- **Event-Driven**: Reactive UI updates via event listeners
- **Async/Await**: Clean asynchronous code handling
- **Error Handling**: Try-catch blocks with user-friendly messages
- **Modular Functions**: Single-responsibility principle
- **Extensive Comments**: Self-documenting code

---

## 🎨 Customization Guide

### Modify Column Positions

Edit the `COLUMNS` object in [app.js](app.js):

```javascript
const COLUMNS = {
    todo: {
        title: '📋 TO DO',
        x: -800,        // Left position
        y: 0,           // Vertical center
        width: 450,     // Frame width
        height: 1200,   // Frame height
        color: '#e0f2fe' // Light blue
    },
    // ... more columns
};
```

### Change Priority Colors

Edit `PRIORITY_STYLES` in [app.js](app.js):

```javascript
const PRIORITY_STYLES = {
    high: {
        emoji: '🔴',
        color: '#fecaca',  // Light red
        label: 'High'
    },
    // ... more priorities
};
```

### Adjust Card Spacing

Modify layout constants in [app.js](app.js):

```javascript
const CARD_WIDTH = 300;        // Card width in pixels
const CARD_SPACING_Y = 20;     // Vertical gap between cards
const CARD_PADDING_X = 75;     // Horizontal padding from frame
const CARD_START_Y = 150;      // Starting Y position
```

### Customize UI Colors

Edit CSS variables in [index.html](index.html):

```css
/* Gradient backgrounds */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Button colors */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## 🚢 Deployment

### GitHub Pages (Free Hosting)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kanban-pro.git
git push -u origin main
```

2. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Source: **Deploy from branch**
   - Branch: **main** / **root**
   - Click **Save**

3. **Update Miro App URLs**:
   - App URL: `https://yourusername.github.io/kanban-pro/`
   - Web-plugin URL: `https://yourusername.github.io/kanban-pro/`

### Other Hosting Options

- **Netlify**: Drag and drop folder → Get instant URL
- **Vercel**: Connect GitHub repo → Auto-deploy
- **Firebase Hosting**: `firebase init` → `firebase deploy`
- **AWS S3**: Static website hosting

---

## 🐛 Troubleshooting

### Cards not appearing?
- **Check**: Is the board initialized? Click "Initialize Board" first
- **Verify**: App permissions include `boards:write`
- **Test**: Open browser console (F12) for error messages

### Drag & drop not working?
- **Browser**: Ensure you're using a modern browser (Chrome, Firefox, Edge)
- **HTTPS**: Drag & drop requires secure context (localhost or HTTPS)
- **Permissions**: Check `boards:write` permission is granted

### Dashboard shows 0% despite having cards?
- **Click**: "Refresh Stats" button to update
- **Check**: Are cards created by this app? (App Cards, not sticky notes)
- **Verify**: Card descriptions contain status metadata

### Auto-sort puts cards in wrong columns?
- **Status metadata**: Ensure cards have proper status in description
- **Re-initialize**: Try clicking "Initialize Board" again
- **Manual fix**: Edit card descriptions to include correct status

---

## 📝 Code Quality

- ✅ **Extensively commented** - Every function documented
- ✅ **Error handling** - Try-catch blocks throughout
- ✅ **Type safety** - Careful null/undefined checks
- ✅ **Clean code** - Follows best practices
- ✅ **Modular design** - Single-responsibility functions
- ✅ **Performance** - Cached references, batch operations
- ✅ **User feedback** - Loading states, success messages

---

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Fork and customize for your team
- Add new features (labels, due dates, etc.)
- Improve the UI/UX
- Submit issues or suggestions

---

## 📄 License

MIT License - Free to use and modify for personal or commercial projects.

---

## 🙋 Support

- **Miro SDK Docs**: https://developers.miro.com/docs
- **Miro Community**: https://community.miro.com/
- **SDK Reference**: https://developers.miro.com/docs/web-sdk-reference

---

## 🎉 Credits

Built by a **Senior Frontend Engineer** specializing in:
- Miro Web SDK integrations
- Vanilla JavaScript applications
- Professional Kanban/project management tools

**Version**: 2.0  
**Last Updated**: January 2026  
**Miro SDK**: v2.0

---

**Happy Planning! 🚀**
