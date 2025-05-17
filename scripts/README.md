
# Payload Download Script

This script downloads security payload files from the GitHub repository and saves them to the project's public assets directory.

## Usage

Run the script using Node.js:

```bash
node scripts/downloadPayloads.js
```

This will download all .txt files from the GitHub repository to the `public/assets/payloads/` directory.

## Requirements

- Node.js 14+
- Internet connection to access GitHub API

## What it does

1. Creates `public/assets/payloads/` directory if it doesn't exist
2. Fetches file list from GitHub repository API
3. Downloads each .txt file to the payloads directory
4. Logs progress and any errors encountered

After running this script, restart the application to use the local payload files.
