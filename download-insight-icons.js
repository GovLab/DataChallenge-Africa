const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadInsightIcons() {
  try {
    const data = JSON.parse(fs.readFileSync('data/insights-local.json', 'utf8'));
    const imagesDir = 'images';
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    let downloaded = 0;
    for (const insight of data.data) {
      if (insight.insight_icon && insight.insight_icon.filename_disk) {
        const filename = insight.insight_icon.filename_disk;
        const localPath = path.join(imagesDir, filename);
        if (!fs.existsSync(localPath)) {
          const url = `https://directus.thegovlab.com/uploads/datachallenge_africa/originals/${filename}`;
          try {
            await downloadFile(url, localPath);
            downloaded++;
          } catch (e) {
            console.error(`Failed to download ${filename}: ${e.message}`);
          }
        } else {
          console.log(`Already exists: ${filename}`);
        }
      }
    }
    console.log(`Downloaded ${downloaded} new insight icon images.`);
  } catch (e) {
    console.error('Error:', e);
  }
}

downloadInsightIcons(); 