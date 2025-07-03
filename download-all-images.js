const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download image
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Function to extract images from JSON data
function extractImagesFromData(data, prefix = '') {
  const images = [];
  
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      images.push(...extractImagesFromData(item, `${prefix}[${index}]`));
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value === 'object' && value !== null) {
        // Check if this is an image object with full_url
        if (value.data && value.data.full_url) {
          const filename = value.data.full_url.split('/').pop();
          images.push({
            url: value.data.full_url,
            filename: filename,
            path: `${prefix}.${key}`,
            object: value
          });
        } else {
          images.push(...extractImagesFromData(value, `${prefix}.${key}`));
        }
      }
    });
  }
  
  return images;
}

// Function to process a JSON file
async function processJSONFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const images = extractImagesFromData(jsonData);
    
    if (images.length === 0) {
      console.log(`  No images found in ${filePath}`);
      return;
    }
    
    console.log(`  Found ${images.length} image(s):`);
    
    let updated = false;
    
    for (const image of images) {
      const localPath = path.join('images', image.filename);
      
      console.log(`    ${image.filename} (${image.path})`);
      
      // Check if file exists and has content
      if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
        try {
          console.log(`      Downloading...`);
          await downloadImage(image.url, localPath);
          console.log(`      ✓ Downloaded successfully`);
        } catch (error) {
          console.log(`      ✗ Download failed: ${error.message}`);
          continue;
        }
      } else {
        console.log(`      ✓ File already exists`);
      }
      
      // Update the JSON to use local path
      const pathParts = image.path.split('.');
      let current = jsonData;
      
      // Navigate to the object
      for (let i = 1; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (part.startsWith('[') && part.endsWith(']')) {
          const index = parseInt(part.slice(1, -1));
          current = current[index];
        } else {
          current = current[part];
        }
      }
      
      const lastPart = pathParts[pathParts.length - 1];
      if (current[lastPart] && current[lastPart].data) {
        if (current[lastPart].data.url !== `/images/${image.filename}`) {
          current[lastPart].data.url = `/images/${image.filename}`;
          updated = true;
          console.log(`      ✓ Updated JSON to use local path: /images/${image.filename}`);
        }
      }
    }
    
    // Save updated JSON if changes were made
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log(`  ✓ Updated ${filePath}`);
    }
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
  }
}

// Main function
async function downloadAllImages() {
  console.log('Starting download of all images...\n');
  
  const dataDir = 'data';
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    await processJSONFile(path.join(dataDir, file));
    console.log('');
  }
  
  console.log('✓ All image downloads completed!');
}

downloadAllImages().catch(console.error); 