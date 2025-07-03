const fs = require('fs');

// Function to fix image paths in French blog posts
function fixFrenchBlogPaths() {
  try {
    console.log('Reading blog data...');
    const blogData = JSON.parse(fs.readFileSync('data/blog-local.json', 'utf8'));
    
    let updatedCount = 0;
    
    // Process each blog entry
    for (const blog of blogData.data) {
      if (!blog.post) continue;
      
      // Check if this is a French blog post (language == true)
      if (blog.language === true) {
        console.log(`Processing French blog post: ${blog.title || blog.id}`);
        
        // Replace relative image paths with absolute paths
        const originalContent = blog.post;
        
        // Replace ../images/ with /images/ for French blog posts
        blog.post = blog.post.replace(/\.\.\/images\//g, '/images/');
        
        if (originalContent !== blog.post) {
          updatedCount++;
          console.log(`Updated image paths in: ${blog.title || blog.id}`);
        }
      }
    }
    
    // Save the updated blog data
    fs.writeFileSync('data/blog-local.json', JSON.stringify(blogData, null, 2));
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total French blog posts updated: ${updatedCount}`);
    console.log(`Blog data saved to data/blog-local.json`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
fixFrenchBlogPaths(); 