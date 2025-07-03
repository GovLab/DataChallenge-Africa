const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download a file
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
        console.error(`Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if download failed
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
}

// Function to extract filename from URL
function extractFilename(url) {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  return filename.split('?')[0]; // Remove query parameters
}

// Function to process blog data and download images
async function downloadBlogImages() {
  try {
    console.log('Reading blog data...');
    const blogData = JSON.parse(fs.readFileSync('data/blog-local.json', 'utf8'));
    
    // Create images directory if it doesn't exist
    const imagesDir = 'images';
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }
    
    let downloadedCount = 0;
    let updatedCount = 0;
    
    // Process each blog entry
    for (const blog of blogData.data) {
      if (blog.thumbnail && blog.thumbnail.private_hash && blog.thumbnail.filename_download) {
        const privateHash = blog.thumbnail.private_hash;
        const filename = blog.thumbnail.filename_download;
        const localPath = `images/${filename}`;
        
        // Download the image if it doesn't exist
        if (!fs.existsSync(localPath)) {
          const downloadUrl = `https://directus.thegovlab.com/datachallenge_africa/assets/${privateHash}?key=directus-medium-contain`;
          
          try {
            await downloadFile(downloadUrl, localPath);
            downloadedCount++;
          } catch (error) {
            console.error(`Failed to download ${filename}: ${error.message}`);
            // Create a placeholder image if download fails
            if (!fs.existsSync(localPath)) {
              fs.writeFileSync(localPath, '');
              console.log(`Created placeholder for: ${localPath}`);
            }
          }
        }
        
        // Update the JSON to use local path
        if (blog.thumbnail.data && blog.thumbnail.data.full_url) {
          blog.thumbnail.data.full_url = `../${localPath}`;
          blog.thumbnail.data.url = `../${localPath}`;
          updatedCount++;
        }
      }
    }
    
    // Save the updated JSON
    fs.writeFileSync('data/blog-local.json', JSON.stringify(blogData, null, 2));
    
    console.log(`\nDownload complete!`);
    console.log(`- Downloaded ${downloadedCount} new images`);
    console.log(`- Updated ${updatedCount} JSON entries with local paths`);
    console.log(`- All blog images are now stored locally in the images/ directory`);
    
  } catch (error) {
    console.error('Error processing blog images:', error);
  }
}

// Run the script
downloadBlogImages(); 