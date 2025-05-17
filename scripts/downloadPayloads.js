
// Script to download all payload files from GitHub repository
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '../public/assets/payloads');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('Created assets directory at', assetsDir);
}

// GitHub API URL for the repository contents
const repoApiUrl = 'https://api.github.com/repos/aw-junaid/Hacking-Tools/contents/Payloads/Payloads%20TXT';

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Make a request to GitHub API to get the list of files
https.get(repoApiUrl, {
  headers: {
    'User-Agent': 'Node.js Script'
  }
}, async (response) => {
  let data = '';
  
  response.on('data', (chunk) => {
    data += chunk;
  });
  
  response.on('end', async () => {
    try {
      const files = JSON.parse(data);
      
      if (!Array.isArray(files)) {
        console.error('Unexpected response format:', files);
        return;
      }
      
      console.log(`Found ${files.length} files to download`);
      
      // For each file in the repository
      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.txt')) {
          const filePath = path.join(assetsDir, file.name);
          console.log(`Downloading ${file.name}...`);
          
          try {
            await downloadFile(file.download_url, filePath);
            console.log(`Downloaded ${file.name}`);
          } catch (err) {
            console.error(`Failed to download ${file.name}:`, err);
          }
        }
      }
      
      console.log('All files downloaded successfully!');
      
    } catch (err) {
      console.error('Error parsing response:', err);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching repository contents:', err);
});
