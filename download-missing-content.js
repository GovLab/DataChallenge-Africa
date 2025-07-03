const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download file
function downloadFile(url, dest) {
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

// Function to extract filename from URL
function getFilenameFromUrl(url) {
  return url.split('/').pop();
}

async function downloadMissingContent() {
  console.log('Starting download of missing content...\n');
  
  // 1. Download PDFs from splash page
  console.log('1. Downloading PDFs from splash page...');
  const splashData = JSON.parse(fs.readFileSync('data/splash-page-local.json', 'utf8'));
  const splashPdfs = [
    { url: splashData.data[0].report_url, name: 'request-for-proposals-en.pdf' },
    { url: splashData.data[0].report_url_fr, name: 'request-for-proposals-fr.pdf' }
  ];
  
  for (const pdf of splashPdfs) {
    if (pdf.url && !pdf.url.startsWith('/')) {
      const localPath = path.join('images', pdf.name);
      if (!fs.existsSync(localPath)) {
        try {
          console.log(`  Downloading: ${pdf.name}`);
          await downloadFile(pdf.url, localPath);
          console.log(`  ✓ Downloaded: ${pdf.name}`);
        } catch (error) {
          console.log(`  ✗ Failed to download ${pdf.name}: ${error.message}`);
        }
      } else {
        console.log(`  ✓ Already exists: ${pdf.name}`);
      }
    }
  }
  
  // 2. Download documents from documents JSON
  console.log('\n2. Downloading documents...');
  const documentsData = JSON.parse(fs.readFileSync('data/documents-local.json', 'utf8'));
  
  for (const doc of documentsData.data) {
    if (doc.document_pdf && doc.document_pdf.data && doc.document_pdf.data.full_url) {
      const originalUrl = doc.document_pdf.data.full_url;
      if (!originalUrl.startsWith('/images/')) {
        // This is still pointing to the API, need to download
        const filename = getFilenameFromUrl(originalUrl);
        const localPath = path.join('images', filename);
        
        if (!fs.existsSync(localPath)) {
          try {
            console.log(`  Downloading: ${filename} (${doc.document_title})`);
            await downloadFile(originalUrl, localPath);
            console.log(`  ✓ Downloaded: ${filename}`);
          } catch (error) {
            console.log(`  ✗ Failed to download ${filename}: ${error.message}`);
          }
        } else {
          console.log(`  ✓ Already exists: ${filename}`);
        }
      }
    }
  }
  
  // 3. Download blog images
  console.log('\n3. Downloading blog images...');
  const blogData = JSON.parse(fs.readFileSync('data/blog-local.json', 'utf8'));
  
  for (const blog of blogData.data) {
    if (blog.thumbnail && blog.thumbnail.data && blog.thumbnail.data.full_url) {
      const originalUrl = blog.thumbnail.data.full_url;
      if (!originalUrl.startsWith('/images/')) {
        // This is still pointing to the API, need to download
        const filename = getFilenameFromUrl(originalUrl);
        const localPath = path.join('images', filename);
        
        if (!fs.existsSync(localPath)) {
          try {
            console.log(`  Downloading: ${filename} (${blog.title})`);
            await downloadFile(originalUrl, localPath);
            console.log(`  ✓ Downloaded: ${filename}`);
          } catch (error) {
            console.log(`  ✗ Failed to download ${filename}: ${error.message}`);
          }
        } else {
          console.log(`  ✓ Already exists: ${filename}`);
        }
      }
    }
  }
  
  console.log('\n✓ All missing content download completed!');
}

downloadMissingContent().catch(console.error); 