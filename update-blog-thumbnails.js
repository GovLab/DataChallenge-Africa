const fs = require('fs');

// Function to update all thumbnail URLs in blog data
function updateBlogThumbnails() {
  try {
    console.log('Reading blog data...');
    const blogData = JSON.parse(fs.readFileSync('data/blog-local.json', 'utf8'));
    
    let updatedCount = 0;
    
    // Process each blog entry
    for (const blog of blogData.data) {
      if (blog.thumbnail && blog.thumbnail.data && blog.thumbnail.data.thumbnails) {
        const filename = blog.thumbnail.filename_download;
        const localPath = `../images/${filename}`;
        
        // Update the main full_url and url
        if (blog.thumbnail.data.full_url) {
          blog.thumbnail.data.full_url = localPath;
          updatedCount++;
        }
        if (blog.thumbnail.data.url) {
          blog.thumbnail.data.url = localPath;
          updatedCount++;
        }
        
        // Update all thumbnail URLs to use local path
        for (const thumbnail of blog.thumbnail.data.thumbnails) {
          if (thumbnail.url && thumbnail.url.includes('directus.thegovlab.com')) {
            thumbnail.url = localPath;
            thumbnail.relative_url = localPath;
            updatedCount++;
          }
        }
      }
    }
    
    // Save the updated JSON
    fs.writeFileSync('data/blog-local.json', JSON.stringify(blogData, null, 2));
    
    console.log(`\nUpdate complete!`);
    console.log(`- Updated ${updatedCount} thumbnail URLs to use local paths`);
    console.log(`- All blog thumbnails now reference local images`);
    
  } catch (error) {
    console.error('Error updating blog thumbnails:', error);
  }
}

// Run the script
updateBlogThumbnails(); 