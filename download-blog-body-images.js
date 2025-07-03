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

// Find all directus uploads/originals image URLs in HTML
function extractDirectusOriginalsUrls(html) {
  const urls = [];
  const regex = /https:\/\/directus\.thegovlab\.com\/uploads\/datachallenge_africa\/originals\/([a-f0-9\-]{36}\.(jpg|jpeg|png|gif))/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push({
      full: match[0],
      filename: match[1]
    });
  }
  return urls;
}

// Main function
async function processBlogBodyImages() {
  const blogPath = 'data/blog-local.json';
  const imagesDir = 'images';
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
  const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
  let downloadCount = 0, updateCount = 0;

  for (const blog of blogData.data) {
    if (!blog.post) continue;
    let html = blog.post;
    let changed = false;
    const urls = extractDirectusOriginalsUrls(html);
    for (let { full, filename } of urls) {
      const localPath = path.join(imagesDir, filename);
      if (!fs.existsSync(localPath)) {
        const downloadUrl = `https://directus.thegovlab.com/uploads/datachallenge_africa/originals/${filename}`;
        try {
          await downloadFile(downloadUrl, localPath);
          downloadCount++;
        } catch {
          console.warn(`Could not download file ${filename}`);
          continue;
        }
      }
      // Replace all occurrences of the remote URL in HTML with the local path
      const relPath = `../images/${filename}`;
      html = html.split(full).join(relPath);
      changed = true;
    }
    if (changed) {
      blog.post = html;
      updateCount++;
    }
  }
  fs.writeFileSync(blogPath, JSON.stringify(blogData, null, 2));
  console.log(`\nDone! Downloaded ${downloadCount} images and updated ${updateCount} blog posts.`);
}

processBlogBodyImages(); 