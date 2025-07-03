const fs = require('fs');
const https = require('https');
const path = require('path');

const endpoints = [
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/splash_page_text?fields=*.*',
    file: 'data/splash-page-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/winners?fields=*.*',
    file: 'data/winners-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/blog?sort=-created&fields=*.*',
    file: 'data/blog-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/insights?fields=*.*',
    file: 'data/insights-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/domains?fields=*.*',
    file: 'data/domains-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/faq?fields=*.*',
    file: 'data/faq-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/key_information?fields=*.*',
    file: 'data/key-information-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/actionable_insights_list?fields=*.*',
    file: 'data/actionable-insights-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/alert_banner?fields=*.*',
    file: 'data/alerts-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/documents?fields=*.*',
    file: 'data/documents-local.json',
  },
  {
    url: 'https://directus.thegovlab.com/datachallenge_africa/items/privacy_policy?fields=*.*',
    file: 'data/privacy-local.json',
  },
];

function downloadJSON(url, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
          console.log(`✓ Saved: ${filePath}`);
          resolve(jsonData);
        } catch (error) {
          console.error(`✗ Error parsing JSON for ${url}:`, error.message);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error(`✗ Error downloading ${url}:`, error.message);
      reject(error);
    });
  });
}

async function downloadAllJSON() {
  console.log('Starting download of all JSON data...\n');
  
  for (const endpoint of endpoints) {
    try {
      await downloadJSON(endpoint.url, endpoint.file);
    } catch (error) {
      console.error(`Failed to download ${endpoint.url}`);
    }
  }
  
  console.log('\n✓ All JSON downloads completed!');
}

downloadAllJSON().catch(console.error); 