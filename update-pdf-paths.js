const fs = require('fs');

// Update splash page JSON to use local PDF paths
function updateSplashPagePDFs() {
  console.log('Updating splash page PDF paths...');
  
  const splashData = JSON.parse(fs.readFileSync('data/splash-page-local.json', 'utf8'));
  let updated = false;
  
  // Update English report URL
  if (splashData.data[0].report_url && splashData.data[0].report_url.startsWith('https://')) {
    splashData.data[0].report_url = '/images/request-for-proposals-en.pdf';
    updated = true;
    console.log('  ✓ Updated English report URL');
  }
  
  // Update French report URL
  if (splashData.data[0].report_url_fr && splashData.data[0].report_url_fr.startsWith('https://')) {
    splashData.data[0].report_url_fr = '/images/request-for-proposals-fr.pdf';
    updated = true;
    console.log('  ✓ Updated French report URL');
  }
  
  if (updated) {
    fs.writeFileSync('data/splash-page-local.json', JSON.stringify(splashData, null, 2));
    console.log('  ✓ Saved updated splash page JSON');
  } else {
    console.log('  No changes needed');
  }
}

updateSplashPagePDFs(); 