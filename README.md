# NexCore — Software Release Site

A minimal, professional static site for distributing software releases.
Built with pure HTML5, CSS3, and Vanilla JavaScript. Ready for GitHub Pages.

---

## Project Structure

```
project-root/
 ├── index.html          # Main page (all sections)
 ├── css/
 │    └── style.css      # All styling, design tokens, responsive layout
 ├── js/
 │    └── script.js      # Release data injection, nav, scroll, OS detection
 ├── assets/
 │    └── images/        # Place screenshots or logo here (optional)
 └── README.md           # This file
```

---

## Deploying to GitHub Pages

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `nexcore` (or whatever your project is called)
3. Set visibility to **Public**
4. Do NOT initialize with a README (you already have one)

### Step 2 — Push the project

```bash
git init
git add .
git commit -m "chore: initial release site"
git branch -M main
git remote add origin https://github.com/yourusername/nexcore.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select `Deploy from a branch`
3. Choose branch: `main`, folder: `/ (root)`
4. Click **Save**

Your site will be live at:
```
https://yourusername.github.io/nexcore/
```

---

## Releasing a New Version

When you ship a new release, update **one object** in `js/script.js`:

```javascript
const RELEASE = {
  version:   "v1.3.0",           // ← bump version
  date:      "April 15, 2026",   // ← update release date
  dateShort: "April 2026",       // ← short form for hero
  checksum:  "abc123...",        // ← SHA-256 of your binary
};
```

Then update the download `href` links in `index.html` to point to your new
GitHub release assets:

```html
<a href="https://github.com/yourusername/nexcore/releases/latest/download/nexcore-windows.exe" ...>
```

Commit and push — the site updates automatically.

---

## Customization Checklist

- [ ] Replace `NexCore` / `Your Name` / `yourusername` throughout `index.html`
- [ ] Update feature cards to describe your actual software
- [ ] Update changelog entries in `index.html`
- [ ] Update contact email and social links
- [ ] Update `RELEASE` object in `script.js`
- [ ] Add your avatar image in `assets/images/` and swap the initials avatar

---

## License

MIT — free to use, modify, and redistribute.
