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

// Function to extract all image references from HTML content
function extractImageReferences(htmlContent) {
  const imageRefs = new Set();
  
  // Pattern 1: <img src="..."> tags
  const imgTagPattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgTagPattern.exec(htmlContent)) !== null) {
    imageRefs.add(match[1]);
  }
  
  // Pattern 2: Direct URLs to Directus assets
  const directusUrlPattern = /https:\/\/directus\.thegovlab\.com\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
  while ((match = directusUrlPattern.exec(htmlContent)) !== null) {
    imageRefs.add(match[0]);
  }
  
  // Pattern 3: UUID filenames (like 4a5b0346-d503-4648-a2c3-706e4fd025a4.jpg)
  const uuidFilenamePattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(jpg|jpeg|png|gif|webp)/gi;
  while ((match = uuidFilenamePattern.exec(htmlContent)) !== null) {
    imageRefs.add(match[0]);
  }
  
  // Pattern 4: Any other image filenames with extensions
  const imageFilenamePattern = /[a-zA-Z0-9\-_]+\.(jpg|jpeg|png|gif|webp)/gi;
  while ((match = imageFilenamePattern.exec(htmlContent)) !== null) {
    // Skip if it's already a UUID or if it's a local path
    if (!match[0].match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\./) && 
        !match[0].startsWith('../') && 
        !match[0].startsWith('./') && 
        !match[0].startsWith('/')) {
      imageRefs.add(match[0]);
    }
  }
  
  return Array.from(imageRefs);
}

// Function to determine download URL for an image reference
function getDownloadUrl(imageRef) {
  // If it's already a full URL
  if (imageRef.startsWith('http')) {
    return imageRef;
  }
  
  // If it's a UUID filename, try the datachallenge_africa originals path
  if (imageRef.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\./)) {
    return `https://directus.thegovlab.com/uploads/datachallenge_africa/originals/${imageRef}`;
  }
  
  // For other filenames, try the datachallenge_africa originals path
  return `https://directus.thegovlab.com/uploads/datachallenge_africa/originals/${imageRef}`;
}

// Function to update HTML content to use local paths
function updateHtmlContent(htmlContent, imageRef, localPath) {
  // Replace in img src attributes
  htmlContent = htmlContent.replace(
    new RegExp(`src=["']${imageRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'gi'),
    `src="${localPath}"`
  );
  
  // Replace direct URLs
  htmlContent = htmlContent.replace(
    new RegExp(imageRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
    localPath
  );
  
  return htmlContent;
}

async function downloadAllBlogImages() {
  try {
    console.log('Reading blog data...');
    const blogData = JSON.parse(fs.readFileSync('data/blog-local.json', 'utf8'));
    
    let totalImagesFound = 0;
    let totalImagesDownloaded = 0;
    let totalPostsUpdated = 0;
    
    // Ensure images directory exists
    if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
    }
    
    // Process each blog entry
    for (const blog of blogData.data) {
      if (!blog.post) continue;
      
      console.log(`\nProcessing blog post: ${blog.title || blog.id}`);
      
      // Extract all image references from the post content
      const imageRefs = extractImageReferences(blog.post);
      console.log(`Found ${imageRefs.length} image references:`, imageRefs);
      
      let postUpdated = false;
      
      for (const imageRef of imageRefs) {
        totalImagesFound++;
        
        // Skip if it's already a local path
        if (imageRef.startsWith('../images/') || imageRef.startsWith('./images/')) {
          console.log(`Skipping local image: ${imageRef}`);
          continue;
        }
        
        // Determine the filename
        let filename;
        if (imageRef.includes('/')) {
          filename = imageRef.split('/').pop();
        } else {
          filename = imageRef;
        }
        
        // Clean the filename (remove query parameters, etc.)
        filename = filename.split('?')[0];
        
        const localPath = `../images/${filename}`;
        const localFilePath = `images/${filename}`;
        
        // Check if file already exists locally
        if (fs.existsSync(localFilePath)) {
          console.log(`Image already exists locally: ${filename}`);
        } else {
          // Download the image
          try {
            const downloadUrl = getDownloadUrl(imageRef);
            console.log(`Downloading: ${downloadUrl} -> ${localFilePath}`);
            await downloadFile(downloadUrl, localFilePath);
            totalImagesDownloaded++;
          } catch (error) {
            console.error(`Failed to download ${imageRef}:`, error.message);
            continue;
          }
        }
        
        // Update the HTML content
        const originalContent = blog.post;
        blog.post = updateHtmlContent(blog.post, imageRef, localPath);
        
        if (originalContent !== blog.post) {
          postUpdated = true;
        }
      }
      
      if (postUpdated) {
        totalPostsUpdated++;
      }
    }
    
    // Save the updated blog data
    fs.writeFileSync('data/blog-local.json', JSON.stringify(blogData, null, 2));
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total image references found: ${totalImagesFound}`);
    console.log(`Total images downloaded: ${totalImagesDownloaded}`);
    console.log(`Total blog posts updated: ${totalPostsUpdated}`);
    console.log(`Blog data saved to data/blog-local.json`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
downloadAllBlogImages(); 