const fs = require('fs');

// Function to fix all image paths in blog posts
function fixAllImagePaths() {
  try {
    console.log('Reading blog data...');
    const blogData = JSON.parse(fs.readFileSync('data/blog-local.json', 'utf8'));
    
    let updatedCount = 0;
    
    // Process each blog entry
    for (const blog of blogData.data) {
      if (!blog.post) continue;
      
      console.log(`Processing blog post: ${blog.title || blog.id}`);
      
      // Replace relative image paths with absolute paths
      const originalContent = blog.post;
      
      // Fix various image path patterns
      // 1. Replace ../images/ with /images/
      blog.post = blog.post.replace(/\.\.\/images\//g, '/images/');
      
      // 2. Fix double /images//images/ paths
      blog.post = blog.post.replace(/\/images\/\/images\//g, '/images/');
      
      // 3. Fix any remaining double slashes
      blog.post = blog.post.replace(/\/images\/\/images\//g, '/images/');
      
      if (originalContent !== blog.post) {
        updatedCount++;
        console.log(`Updated image paths in: ${blog.title || blog.id}`);
      }
    }
    
    // Save the updated blog data
    fs.writeFileSync('data/blog-local.json', JSON.stringify(blogData, null, 2));
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total blog posts updated: ${updatedCount}`);
    console.log(`Blog data saved to data/blog-local.json`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
fixAllImagePaths(); 