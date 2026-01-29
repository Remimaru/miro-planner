# 🚀 Deployment Guide - Board-Centric Task Planner v3.0

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ All 4 core files: `index.html`, `app.js`, `modal.html`, `modal.js`
- ✅ Valid Miro developer account
- ✅ Miro app created in developer portal
- ✅ Hosting solution (GitHub Pages, Netlify, etc.)

---

## 🔧 Step-by-Step Deployment

### Step 1: Create Miro App

1. Go to [Miro Developer Portal](https://developers.miro.com/)
2. Sign in with your Miro account
3. Click **"Create new app"**
4. Fill in details:
   - **App Name:** Board Task Planner
   - **Description:** A board-centric task management app
   - **Your development team:** [Your team name]
5. Click **"Create app"**
6. Note your **App ID** and **Client Secret** (save securely)

### Step 2: Configure App Permissions

In the app settings, enable these permissions:
- ✅ `board:read` - Read board content
- ✅ `board:write` - Create and modify cards/frames
- ✅ `identity:read` - Read user information

Click **"Save"** to apply permissions.

### Step 3: Upload Files to Hosting

#### Option A: GitHub Pages (Recommended)

1. Create GitHub repository: `miro-task-planner`
2. Upload files:
   ```bash
   git init
   git add index.html app.js modal.html modal.js
   git commit -m "Initial deployment"
   git remote add origin https://github.com/YOUR-USERNAME/miro-task-planner.git
   git push -u origin main
   ```
3. Enable GitHub Pages:
   - Go to repository **Settings → Pages**
   - Source: **Deploy from branch**
   - Branch: **main** / (root)
   - Click **Save**
4. Note your URL: `https://YOUR-USERNAME.github.io/miro-task-planner/`

#### Option B: Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click **"Add new site → Deploy manually"**
3. Drag and drop your project folder
4. Wait for deployment
5. Note your URL: `https://YOUR-SITE-NAME.netlify.app/`

#### Option C: Self-Hosted

1. Upload files to your web server via FTP/SFTP
2. Ensure files are in public directory
3. Note your URL: `https://yourdomain.com/miro-planner/`

### Step 4: Configure Miro App URLs

Back in the Miro Developer Portal:

1. Go to your app settings
2. Under **"App URLs"**, enter:

   - **App URL (Panel):**
     ```
     https://YOUR-HOSTING-URL/index.html
     ```
   
   - **Modal URL:**
     ```
     https://YOUR-HOSTING-URL/modal.html
     ```

3. Click **"Save"**

### Step 5: Set App Icon

1. In app settings, go to **"Appearance"**
2. Upload icon (recommended size: 256x256px)
3. Choose icon color
4. Set display name: **"Task Planner"**

### Step 6: Install App to Board

1. Go to any Miro board
2. Click **"Apps"** icon in left toolbar (or press `/`)
3. Search for your app name
4. Click **"Add"** or **"Open"**
5. Authorize permissions if prompted
6. App icon appears in toolbar

### Step 7: Test Installation

1. Click app icon in toolbar
2. Sidebar should open
3. Click **"⚙️ Setup Board"**
4. Verify 3 frames appear
5. Test creating a task
6. Test clicking a card to edit
7. Test drag-and-drop

---

## 🔍 Troubleshooting Deployment

### Issue: App icon not appearing in toolbar

**Solution:**
1. Refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check app is installed on the board
4. Verify app status is "Active" in developer portal

### Issue: "Failed to load" error when opening sidebar

**Solution:**
1. Check **App URL** in developer portal matches your hosting URL
2. Ensure files are publicly accessible (try opening URL directly)
3. Check HTTPS is enabled (Miro requires HTTPS)
4. Verify CORS settings if self-hosting

### Issue: Modal doesn't open

**Solution:**
1. Check **Modal URL** is configured correctly
2. Ensure `modal.html` and `modal.js` are in same directory as `index.html`
3. Check browser console for errors (F12)
4. Verify file paths in `modal.html` script tag

### Issue: Cards not created

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Verify permissions are enabled in app settings
4. Check if frames exist on board (click "Setup Board")

### Issue: Scrolling not working

**Solution:**
1. Clear browser cache
2. Verify `index.html` has latest CSS (flexbox layout)
3. Check browser compatibility (Chrome, Firefox, Edge recommended)

---

## 🌐 Custom Domain Setup

If using custom domain:

1. **Update DNS records:**
   - Add CNAME record pointing to hosting provider
   - Wait for DNS propagation (up to 48 hours)

2. **Enable HTTPS:**
   - Use Let's Encrypt SSL certificate
   - Or use hosting provider's SSL

3. **Update Miro App URLs:**
   - Change to custom domain in developer portal
   - Save and test

---

## 🔐 Security Best Practices

1. **HTTPS Only:**
   - Always use HTTPS URLs
   - Miro requires secure connections

2. **API Keys:**
   - Never commit secrets to Git
   - Use environment variables

3. **CORS Configuration:**
   ```
   Access-Control-Allow-Origin: https://miro.com
   ```

4. **Content Security Policy:**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self' https://miro.com; script-src 'self' 'unsafe-inline' https://miro.com;">
   ```

---

## 📊 Production Monitoring

### Key Metrics to Track

1. **Usage:**
   - Number of boards with app installed
   - Daily active users
   - Tasks created per day

2. **Performance:**
   - Modal open time
   - Dashboard sync latency
   - Error rate

3. **User Behavior:**
   - Most used features
   - Common workflows
   - Feature adoption rates

### Error Tracking

Add error logging:
```javascript
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to error tracking service
});
```

### Analytics (Optional)

Add Google Analytics or similar:
```html
<!-- In index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔄 Update Workflow

When releasing updates:

1. **Test locally:**
   - Test all features
   - Run test suite (TESTING-v3.0.md)
   - Verify no errors

2. **Deploy to staging:**
   - Upload to staging environment
   - Test in Miro with staging URL

3. **Deploy to production:**
   - Upload to production hosting
   - Files automatically refresh (may take 5-10 minutes)
   - Clear CDN cache if applicable

4. **Notify users:**
   - Post in Miro board announcements
   - Email team about new features

5. **Monitor:**
   - Watch error logs
   - Check performance metrics
   - Gather user feedback

---

## 📁 Deployment File Structure

Ensure your hosting has this structure:

```
public/
├── index.html       (sidebar panel)
├── app.js           (core logic)
├── modal.html       (task form)
└── modal.js         (modal handler)
```

**Note:** All files must be in the **same directory** for relative paths to work.

---

## 🧪 Post-Deployment Testing

After deployment, test these critical paths:

### Test 1: Initial Setup
1. Open app in Miro
2. Click "Setup Board"
3. Verify frames created

### Test 2: Create Task
1. Click "New Task"
2. Fill form
3. Click "Create Task"
4. Verify card appears

### Test 3: Edit Task
1. Click any card on board
2. Modal opens
3. Edit data
4. Click "Save Changes"
5. Verify card updates

### Test 4: Drag-and-Drop
1. Drag template from sidebar
2. Drop in column
3. Modal opens
4. Fill form
5. Verify card created

### Test 5: Auto-Sort
1. Create 3+ tasks with different priorities
2. Click "Auto-Sort"
3. Verify cards reorder

If all tests pass: ✅ **Deployment Successful!**

---

## 📞 Support Contacts

### Hosting Issues
- **GitHub Pages:** https://github.com/contact
- **Netlify:** https://www.netlify.com/support/

### Miro Issues
- **Developer Support:** https://developers.miro.com/contact
- **Community Forum:** https://community.miro.com/

### App Issues
- Check browser console (F12)
- Review README.md troubleshooting
- Test with TESTING-v3.0.md guide

---

## 🎉 Deployment Complete!

Once deployed, your app will be live at:
```
https://YOUR-HOSTING-URL/index.html
```

Users can:
- ✅ Install from Miro app marketplace
- ✅ Add to any board
- ✅ Create and manage tasks
- ✅ Use board-first interaction
- ✅ Drag-and-drop from sidebar

---

## 🔮 Next Steps

1. **Share with team:**
   - Add app to shared boards
   - Train team on features

2. **Gather feedback:**
   - Monitor usage
   - Collect user feedback
   - Plan v3.1 features

3. **Maintain:**
   - Monitor error logs
   - Keep dependencies updated
   - Apply security patches

---

## 📝 Deployment Checklist

```
Pre-Deployment:
[ ] All files ready (index.html, app.js, modal.html, modal.js)
[ ] Miro developer account created
[ ] Hosting solution chosen

Deployment:
[ ] Miro app created in developer portal
[ ] Permissions configured (board:read, board:write, identity:read)
[ ] Files uploaded to hosting
[ ] HTTPS enabled
[ ] App URL configured in Miro
[ ] Modal URL configured in Miro
[ ] App icon uploaded
[ ] Display name set

Testing:
[ ] App appears in Miro toolbar
[ ] Sidebar opens correctly
[ ] Setup Board creates frames
[ ] New Task opens modal
[ ] Card creation works
[ ] Card editing works (click on board)
[ ] Drag-and-drop works
[ ] Auto-sort works
[ ] Dashboard updates

Post-Deployment:
[ ] Error monitoring setup
[ ] Usage tracking enabled (optional)
[ ] Team notified
[ ] Documentation shared (README.md)

Status: [ ] DEPLOYED [ ] VERIFIED [ ] LIVE
```

---

**Deployment Guide v3.0**  
**Last Updated:** January 2026  
**Status:** Production Ready

---

🚀 **Your app is ready for production!**
