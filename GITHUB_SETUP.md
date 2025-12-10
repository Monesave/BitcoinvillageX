# Setting Up GitHub Repository

## Option 1: Create a New Repository on GitHub (Recommended)

### Step 1: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `BitcoinvillageX` (or your preferred name)
   - **Description**: "A Bitcoin-only micro-economy where Villagers spend, receive, donate, trade services, and support each other using BTC over Lightning"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/BitcoinvillageX.git

# Or if you prefer SSH (requires SSH key setup):
# git remote add origin git@github.com:YOUR_USERNAME/BitcoinvillageX.git

# Verify the remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

## Option 2: Use Existing Repository

If you already have a GitHub repository:

```bash
# Add the remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify
git remote -v

# Push
git push -u origin main
```

## Troubleshooting

### If you get authentication errors:

**For HTTPS:**
- GitHub now requires a Personal Access Token instead of password
- Create one at: https://github.com/settings/tokens
- Use the token as your password when prompted

**For SSH:**
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Then use the SSH URL format: `git@github.com:USERNAME/REPO.git`

### If branch name is different:

If your branch is named `master` instead of `main`:

```bash
# Rename branch to main
git branch -M main

# Then push
git push -u origin main
```

### If you need to force push (use with caution):

```bash
git push -u origin main --force
```

**⚠️ Warning**: Only use `--force` if you're sure you want to overwrite the remote branch.

