# 🧪 Testing Guide - Board-Centric Task Planner v3.0

## 📋 Pre-Test Setup

### Requirements
- ✅ Miro account (free or paid)
- ✅ Browser: Chrome, Firefox, or Edge (latest version)
- ✅ Miro board with app installed
- ✅ All files present: `index.html`, `app.js`, `modal.html`, `modal.js`

### Installation
1. Upload all files to your Miro app hosting
2. Configure `app.html` URL in Miro app settings
3. Add app to a Miro board
4. Click app icon in toolbar

---

## 🎯 Test Plan

### Test Suite 1: Initial Setup
**Goal:** Verify board initialization works correctly

#### Test 1.1: First Launch
**Steps:**
1. Click app icon in Miro toolbar
2. Sidebar panel should open

**Expected Results:**
- ✅ Sidebar opens on right side
- ✅ Shows dashboard with all zeros: `📋 0  ⚡ 0  ✅ 0  📈 0`
- ✅ Shows 2 buttons: "➕ New Task" and "⚙️ Setup Board"
- ✅ Shows drag template: "👆 Drag to Board"
- ✅ Shows "Auto-Sort Cards" button
- ✅ No error messages in status area

#### Test 1.2: Board Setup
**Steps:**
1. Click "⚙️ Setup Board" button
2. Wait for frames to be created

**Expected Results:**
- ✅ Status message: "Creating board structure..."
- ✅ Three frames appear on board:
  - 📋 TO DO (light blue)
  - ⚡ IN PROGRESS (light yellow)
  - ✅ DONE (light green)
- ✅ Viewport zooms to fit all frames
- ✅ Status message changes to: "✅ Board setup complete!"
- ✅ Status message disappears after 2 seconds

#### Test 1.3: Duplicate Setup Check
**Steps:**
1. Click "⚙️ Setup Board" button again
2. Confirm dialog should appear

**Expected Results:**
- ✅ Confirmation dialog: "Board already setup. Create new frames?"
- ✅ Click "Cancel" → Nothing happens
- ✅ Click "OK" → New frames created (old ones remain)

---

### Test Suite 2: Scrolling Fix
**Goal:** Verify sidebar scrolling works on all screen sizes

#### Test 2.1: Normal Screen (1920x1080)
**Steps:**
1. Open sidebar on full desktop screen
2. Observe all elements

**Expected Results:**
- ✅ All buttons visible without scrolling
- ✅ Dashboard stats visible at top
- ✅ "Auto-Sort" button visible at bottom
- ✅ No content cut off

#### Test 2.2: Small Screen (1366x768)
**Steps:**
1. Resize browser window to 1366x768
2. Open sidebar

**Expected Results:**
- ✅ Sidebar adapts to smaller height
- ✅ Content scrolls smoothly if needed
- ✅ All buttons remain accessible
- ✅ Scroll indicator appears if content overflows

#### Test 2.3: Very Small Screen (1024x600)
**Steps:**
1. Resize browser window to 1024x600
2. Open sidebar

**Expected Results:**
- ✅ Sidebar shows scroll bar
- ✅ Can scroll to reach all buttons
- ✅ Scroll is smooth (no janky behavior)
- ✅ "Auto-Sort" button reachable at bottom

---

### Test Suite 3: Task Creation (Button)
**Goal:** Verify modal-based task creation works

#### Test 3.1: Open New Task Modal
**Steps:**
1. Click "➕ New Task" button
2. Modal should open

**Expected Results:**
- ✅ Modal opens centered on screen
- ✅ Modal title: "➕ New Task"
- ✅ Form shows:
  - Task Name input (empty)
  - Assignee dropdown (default: "Unassigned")
  - Priority selector (default: "Medium" with 🟡 badge)
  - Status dropdown (default: "📋 To Do")
- ✅ Two buttons: "Cancel" and "Create Task"
- ✅ Background is dimmed (modal backdrop)

#### Test 3.2: Create Task (Valid Data)
**Steps:**
1. Open new task modal
2. Enter task name: "Test Task 1"
3. Select assignee: "Me (You)"
4. Select priority: "High"
5. Select status: "📋 To Do"
6. Click "Create Task"

**Expected Results:**
- ✅ Modal closes automatically
- ✅ New card appears in TO DO frame
- ✅ Card title: "🔴 Test Task 1" (high priority emoji)
- ✅ Card color: Red tint (high priority)
- ✅ Dashboard updates: TO DO count = 1, Total = 1
- ✅ Status message: "✅ Task created!"
- ✅ Status message disappears after 2 seconds

#### Test 3.3: Create Task (Empty Name)
**Steps:**
1. Open new task modal
2. Leave task name empty
3. Click "Create Task"

**Expected Results:**
- ✅ Alert appears: "Please enter a task name"
- ✅ Modal stays open
- ✅ No card created

#### Test 3.4: Priority Badge Preview
**Steps:**
1. Open new task modal
2. Change priority from "Medium" to "High"
3. Observe badge
4. Change to "Low"

**Expected Results:**
- ✅ Badge changes to "High" with red styling
- ✅ Badge changes to "Low" with blue styling
- ✅ Changes are immediate (no delay)

#### Test 3.5: Cancel Task Creation
**Steps:**
1. Open new task modal
2. Fill in some fields
3. Click "Cancel" button

**Expected Results:**
- ✅ Modal closes
- ✅ No card created
- ✅ No error messages

---

### Test Suite 4: Card Click Editing
**Goal:** Verify board-first interaction (click cards to edit)

#### Test 4.1: Click Card to Edit
**Steps:**
1. Create a task: "Edit Test Task"
2. Click the card on the board

**Expected Results:**
- ✅ Edit modal opens immediately
- ✅ Modal title: "✏️ Edit Task"
- ✅ Form pre-populated with card data:
  - Task name: "Edit Test Task"
  - Priority matches card (emoji removed from title)
  - Status matches frame location
- ✅ Button text: "Save Changes" (not "Create Task")

#### Test 4.2: Update Task Name
**Steps:**
1. Click card to edit
2. Change task name to "Updated Task Name"
3. Click "Save Changes"

**Expected Results:**
- ✅ Modal closes
- ✅ Card title updates to "🔴 Updated Task Name" (priority emoji preserved)
- ✅ Status message: "✅ Task updated!"

#### Test 4.3: Change Priority
**Steps:**
1. Click card (high priority, red)
2. Change priority to "Low"
3. Click "Save Changes"

**Expected Results:**
- ✅ Card emoji changes: 🔴 → 🔵
- ✅ Card color changes: Red → Blue
- ✅ Card description updates to show "Priority: Low"

#### Test 4.4: Change Status (Move Between Columns)
**Steps:**
1. Create task in TO DO column
2. Click card to edit
3. Change status from "To Do" to "In Progress"
4. Click "Save Changes"

**Expected Results:**
- ✅ Card disappears from TO DO frame
- ✅ Card appears in IN PROGRESS frame
- ✅ Card positioned at next available slot in IN PROGRESS
- ✅ Dashboard updates: TO DO -1, IN PROGRESS +1

#### Test 4.5: Edit Cancel
**Steps:**
1. Click card to edit
2. Change some fields
3. Click "Cancel"

**Expected Results:**
- ✅ Modal closes
- ✅ Card unchanged on board
- ✅ No error messages

---

### Test Suite 5: Drag-and-Drop
**Goal:** Verify sidebar-to-board drag functionality

#### Test 5.1: Drag Template Visual Feedback
**Steps:**
1. Hover over "👆 Drag to Board" template
2. Start dragging

**Expected Results:**
- ✅ Cursor changes to grab/grabbing
- ✅ Element follows mouse cursor
- ✅ Drag ghost image appears

#### Test 5.2: Drop in TO DO Column
**Steps:**
1. Drag "👆 Drag to Board" template
2. Drop in center of TO DO frame
3. Fill modal form: "Dragged Task 1"
4. Click "Create Task"

**Expected Results:**
- ✅ Modal opens immediately on drop
- ✅ Status pre-selected: "📋 To Do"
- ✅ Card created in TO DO frame
- ✅ Card positioned at drop location (approximately)

#### Test 5.3: Drop in IN PROGRESS Column
**Steps:**
1. Drag template
2. Drop in IN PROGRESS frame
3. Check status dropdown

**Expected Results:**
- ✅ Modal opens
- ✅ Status pre-selected: "⚡ In Progress"
- ✅ Card created in IN PROGRESS frame

#### Test 5.4: Drop Outside Columns
**Steps:**
1. Drag template
2. Drop outside any frame (on empty board area)
3. Observe behavior

**Expected Results:**
- ✅ Status message: "Please drop inside a column"
- ✅ No modal opens
- ✅ No card created

#### Test 5.5: Drop Cancel
**Steps:**
1. Drag template
2. Drop in column
3. Modal opens
4. Click "Cancel"

**Expected Results:**
- ✅ Modal closes
- ✅ No card created
- ✅ No error messages

---

### Test Suite 6: Auto-Sort
**Goal:** Verify card organization by priority

#### Test 6.1: Sort Multiple Priorities
**Steps:**
1. Create tasks in TO DO:
   - "Low Priority Task" (Low)
   - "High Priority Task" (High)
   - "Medium Priority Task" (Medium)
2. Click "Auto-Sort Cards"

**Expected Results:**
- ✅ Status message: "Organizing cards..."
- ✅ Cards reorder:
  1. High Priority Task (🔴) at top
  2. Medium Priority Task (🟡) in middle
  3. Low Priority Task (🔵) at bottom
- ✅ Status message: "✅ Cards organized!"
- ✅ All frames sorted (TO DO, IN PROGRESS, DONE)

#### Test 6.2: Sort Grid Layout
**Steps:**
1. Create 10 tasks in TO DO (mix of priorities)
2. Click "Auto-Sort Cards"

**Expected Results:**
- ✅ High priority (🔴) tasks in first rows
- ✅ Cards arranged in grid: 4 cards per column
- ✅ Spacing consistent (25px between cards)
- ✅ Cards aligned to frame edges with 30px margin

---

### Test Suite 7: Dashboard Sync
**Goal:** Verify real-time statistics updates

#### Test 7.1: Initial Counts
**Steps:**
1. Open sidebar
2. Observe dashboard

**Expected Results:**
- ✅ All counts zero before creating tasks
- ✅ Counts accurate after creating tasks

#### Test 7.2: Auto-Update (3-Second Polling)
**Steps:**
1. Create 3 tasks in different columns
2. Observe dashboard (don't interact)
3. Wait 3+ seconds

**Expected Results:**
- ✅ Counts update automatically
- ✅ TO DO: 1, IN PROGRESS: 1, DONE: 1, TOTAL: 3

#### Test 7.3: Manual Card Movement
**Steps:**
1. Manually drag a card from TO DO to DONE (on board)
2. Observe dashboard
3. Wait up to 3 seconds

**Expected Results:**
- ✅ Dashboard updates within 3 seconds
- ✅ TO DO count decreases
- ✅ DONE count increases
- ✅ TOTAL count stays same

#### Test 7.4: Card Deletion
**Steps:**
1. Delete a card manually from board
2. Observe dashboard
3. Wait up to 3 seconds

**Expected Results:**
- ✅ Dashboard updates within 3 seconds
- ✅ Counts decrease by 1
- ✅ TOTAL decreases

---

### Test Suite 8: Edge Cases
**Goal:** Test unusual scenarios and error handling

#### Test 8.1: No Frames Exist
**Steps:**
1. Delete all frames from board
2. Try to create a task

**Expected Results:**
- ✅ Status message: "⚠️ Please setup board first"
- ✅ No card created
- ✅ No crash/error

#### Test 8.2: Frame Deleted After Setup
**Steps:**
1. Setup board
2. Manually delete TO DO frame
3. Try to create task with status "To Do"

**Expected Results:**
- ✅ Error handled gracefully
- ✅ User notified frame missing

#### Test 8.3: Very Long Task Name
**Steps:**
1. Create task with 200+ character name
2. Observe card

**Expected Results:**
- ✅ Card accepts long name
- ✅ Text wraps inside card
- ✅ Card expands height if needed

#### Test 8.4: Special Characters in Task Name
**Steps:**
1. Create task with name: "Test <>&"🎯"
2. Observe card

**Expected Results:**
- ✅ Special characters displayed correctly
- ✅ No HTML injection
- ✅ Emojis render properly

#### Test 8.5: Rapid Button Clicks
**Steps:**
1. Click "➕ New Task" button 5 times rapidly

**Expected Results:**
- ✅ Only one modal opens
- ✅ Button disabled during modal open
- ✅ No multiple modals

#### Test 8.6: Concurrent Edits
**Steps:**
1. Open card to edit
2. In another browser tab, edit same card
3. Save in first tab

**Expected Results:**
- ✅ Last save wins
- ✅ No data corruption
- ✅ Dashboard syncs correctly

---

### Test Suite 9: Browser Compatibility
**Goal:** Verify app works across browsers

#### Test 9.1: Chrome
- ✅ All features work
- ✅ Modals open correctly
- ✅ Drag-and-drop smooth
- ✅ Scrolling perfect

#### Test 9.2: Firefox
- ✅ All features work
- ✅ Modals centered correctly
- ✅ Drag visual feedback correct

#### Test 9.3: Edge
- ✅ All features work
- ✅ No console errors

---

### Test Suite 10: Performance
**Goal:** Verify app performance with many tasks

#### Test 10.1: Many Cards (50+)
**Steps:**
1. Create 50 tasks across all columns
2. Observe performance

**Expected Results:**
- ✅ Dashboard updates within 3 seconds
- ✅ Auto-sort completes within 5 seconds
- ✅ No lag when opening modals
- ✅ No lag when clicking cards

#### Test 10.2: Rapid Task Creation
**Steps:**
1. Create 10 tasks rapidly (< 30 seconds)
2. Observe dashboard

**Expected Results:**
- ✅ All cards created successfully
- ✅ Dashboard counts accurate
- ✅ No duplicate cards

---

## 📊 Test Results Template

Use this template to record your test results:

```
Date: __________
Tester: __________
Version: v3.0

Test Suite 1: Initial Setup
[ ] Test 1.1: First Launch - PASS / FAIL
[ ] Test 1.2: Board Setup - PASS / FAIL
[ ] Test 1.3: Duplicate Setup Check - PASS / FAIL

Test Suite 2: Scrolling Fix
[ ] Test 2.1: Normal Screen - PASS / FAIL
[ ] Test 2.2: Small Screen - PASS / FAIL
[ ] Test 2.3: Very Small Screen - PASS / FAIL

Test Suite 3: Task Creation (Button)
[ ] Test 3.1: Open Modal - PASS / FAIL
[ ] Test 3.2: Create Valid Task - PASS / FAIL
[ ] Test 3.3: Empty Name Validation - PASS / FAIL
[ ] Test 3.4: Priority Badge - PASS / FAIL
[ ] Test 3.5: Cancel Creation - PASS / FAIL

Test Suite 4: Card Click Editing
[ ] Test 4.1: Click to Edit - PASS / FAIL
[ ] Test 4.2: Update Name - PASS / FAIL
[ ] Test 4.3: Change Priority - PASS / FAIL
[ ] Test 4.4: Change Status - PASS / FAIL
[ ] Test 4.5: Cancel Edit - PASS / FAIL

Test Suite 5: Drag-and-Drop
[ ] Test 5.1: Visual Feedback - PASS / FAIL
[ ] Test 5.2: Drop in TO DO - PASS / FAIL
[ ] Test 5.3: Drop in IN PROGRESS - PASS / FAIL
[ ] Test 5.4: Drop Outside - PASS / FAIL
[ ] Test 5.5: Cancel Drop - PASS / FAIL

Test Suite 6: Auto-Sort
[ ] Test 6.1: Sort Priorities - PASS / FAIL
[ ] Test 6.2: Grid Layout - PASS / FAIL

Test Suite 7: Dashboard Sync
[ ] Test 7.1: Initial Counts - PASS / FAIL
[ ] Test 7.2: Auto-Update - PASS / FAIL
[ ] Test 7.3: Manual Movement - PASS / FAIL
[ ] Test 7.4: Card Deletion - PASS / FAIL

Test Suite 8: Edge Cases
[ ] Test 8.1: No Frames - PASS / FAIL
[ ] Test 8.2: Deleted Frame - PASS / FAIL
[ ] Test 8.3: Long Name - PASS / FAIL
[ ] Test 8.4: Special Characters - PASS / FAIL
[ ] Test 8.5: Rapid Clicks - PASS / FAIL
[ ] Test 8.6: Concurrent Edits - PASS / FAIL

Test Suite 9: Browser Compatibility
[ ] Test 9.1: Chrome - PASS / FAIL
[ ] Test 9.2: Firefox - PASS / FAIL
[ ] Test 9.3: Edge - PASS / FAIL

Test Suite 10: Performance
[ ] Test 10.1: Many Cards - PASS / FAIL
[ ] Test 10.2: Rapid Creation - PASS / FAIL

Overall Result: PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🐛 Known Issues

None at this time. Report issues to development team.

---

## ✅ Sign-Off

**QA Approved:** ___________  
**Date:** ___________  
**Version:** v3.0  
**Status:** Ready for Production

---

*Last Updated: January 2026*
