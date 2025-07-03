const fs = require('fs');
const path = require('path');

// Function to update image paths in JSON data
function updateImagePaths(data) {
  if (Array.isArray(data)) {
    return data.map(item => updateImagePaths(item));
  } else if (typeof data === 'object' && data !== null) {
    const updated = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value === 'object' && value !== null) {
        // Check if this is an image object with full_url
        if (value.data && value.data.full_url) {
          const filename = value.data.full_url.split('/').pop();
          updated[key] = {
            ...value,
            data: {
              ...value.data,
              url: `/images/${filename}`,
              full_url: `/images/${filename}`
            }
          };
        } else {
          updated[key] = updateImagePaths(value);
        }
      } else {
        updated[key] = value;
      }
    });
    return updated;
  }
  return data;
}

// Function to process a JSON file
function processJSONFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedData = updateImagePaths(jsonData);
    
    // Check if any changes were made
    if (JSON.stringify(jsonData) !== JSON.stringify(updatedData)) {
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      console.log(`  ✓ Updated ${filePath}`);
    } else {
      console.log(`  No changes needed for ${filePath}`);
    }
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
  }
}

// Main function
function fixAllJSONPaths() {
  console.log('Starting to fix JSON image paths...\n');
  
  const dataDir = 'data';
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    processJSONFile(path.join(dataDir, file));
  }
  
  console.log('\n✓ All JSON paths updated!');
}

fixAllJSONPaths(); 