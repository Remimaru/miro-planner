# Miro Project Planner

A simple Kanban-style project planner built with Miro Web SDK v2.0. No frameworks, just vanilla JavaScript.

## Features

- **Add Tasks**: Create sticky notes directly from a sidebar panel
- **Status Colors**: 
  - 🔵 Blue (light_blue) = To Do
  - 🟢 Green (light_green) = Done
- **Auto-organize**: Group tasks by status into neat vertical columns
- **Kanban View**: Automatic column layout with headers

## Setup

1. Go to [Miro Developer Portal](https://miro.com/app/settings/user-profile/apps)
2. Create a new app
3. Set the following permissions:
   - `boards:read`
   - `boards:write`
4. Set the App URL to where you host these files (e.g., using a local server or hosting service)
5. For local development:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server -p 8000
   ```
6. Set your Web-plugin URL to: `http://localhost:8000/`
7. Install the app to your team
8. Open any Miro board and click the app icon in the left sidebar

## Files

- **index.html**: Sidebar UI with task input and organize button
- **src/index.js**: Miro SDK logic for creating and organizing sticky notes
- **README.md**: This file

## Usage

1. Click the app icon in the Miro board sidebar
2. Enter a task name
3. Select status (To Do or Done)
4. Click "Add Task to Board"
5. When you want to organize: click "Group by Status"

The app will automatically arrange all blue and green sticky notes into two columns.

## Technical Details

- Uses Miro Web SDK v2.0
- Pure vanilla JavaScript (no React/Vue/Angular)
- Color-based status identification
- Automatic viewport management
- Column-based layout system

## Customization

You can modify the colors and positions in `src/index.js`:

```javascript
const STATUS_COLORS = {
    todo: 'light_blue',  // Change sticky note colors
    done: 'light_green'
};

const COLUMN_CONFIG = {
    todo: { x: -400 },   // Adjust column positions
    done: { x: 400 }
};
```

Available Miro sticky note colors:
- `light_yellow`, `yellow`, `orange`, `light_pink`, `pink`, `violet`, `red`, `light_green`, `green`, `dark_green`, `cyan`, `light_blue`, `blue`, `dark_blue`, `gray`, `black`

## License

MIT - Feel free to use and modify as needed!
