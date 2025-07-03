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

async function downloadDocuments() {
  console.log('Downloading missing documents...\n');
  
  // List of documents to download with their original API URLs
  const documents = [
    { filename: '56a0db02-8b23-4ba8-823d-faf966fc5723.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/56a0db02-8b23-4ba8-823d-faf966fc5723.pdf', title: 'Cadre Logique' },
    { filename: 'ec536031-ec20-4d1c-90f9-a8ec371e63f8.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/ec536031-ec20-4d1c-90f9-a8ec371e63f8.pdf', title: 'Logframe Matrix' },
    { filename: '1c603d97-9869-4ede-b56e-970b0062df45.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/1c603d97-9869-4ede-b56e-970b0062df45.pdf', title: "Applicant's Declaration" },
    { filename: '379243ab-64cc-4692-bec8-8a5fc3c9879f.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/379243ab-64cc-4692-bec8-8a5fc3c9879f.pdf', title: 'Déclaration du demandeur' },
    { filename: '99be9603-ce27-4c9d-a0a2-e93e78bef4b3.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/99be9603-ce27-4c9d-a0a2-e93e78bef4b3.pdf', title: 'Déclaration des partenaires' },
    { filename: '2ae021d3-d718-4e63-972a-92a2b8ad27f7.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/2ae021d3-d718-4e63-972a-92a2b8ad27f7.pdf', title: 'Description of Partners' },
    { filename: 'f8275628-d8ef-4534-8165-e18614e59460.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/f8275628-d8ef-4534-8165-e18614e59460.pdf', title: 'Action Plan' },
    { filename: '96776889-5bcd-4aad-9aa2-2494171bf5ba.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/96776889-5bcd-4aad-9aa2-2494171bf5ba.pdf', title: 'Plan d\'action' },
    { filename: '3d1c9f38-9765-4981-87ec-4d3451f9a7a9.pdf', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/3d1c9f38-9765-4981-87ec-4d3451f9a7a9.pdf', title: 'Budget Template' },
    { filename: 'fd2964b0-ea57-491a-bab1-808bbf53c5c8.xlsx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/fd2964b0-ea57-491a-bab1-808bbf53c5c8.xlsx', title: 'Budget Template (.xls)' },
    { filename: '798e0cd8-69d0-4a8d-a2d0-87a97dfd1dea.xlsx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/798e0cd8-69d0-4a8d-a2d0-87a97dfd1dea.xlsx', title: 'Budget Template (.xls)' },
    { filename: '0273104a-b426-4880-9280-09c9c920d618.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/0273104a-b426-4880-9280-09c9c920d618.docx', title: 'Plain D\'action (.doc)' },
    { filename: '3e33046c-2460-417b-bacb-50366657981d.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/3e33046c-2460-417b-bacb-50366657981d.docx', title: 'Déclaration des partenaires (.doc)' },
    { filename: '3e5daead-136a-466a-8238-247ca5d4b15f.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/3e5daead-136a-466a-8238-247ca5d4b15f.docx', title: 'Déclaration du demandeur (.doc)' },
    { filename: '6ede7bdd-5cc6-4fc5-a363-37092a8e1089.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/6ede7bdd-5cc6-4fc5-a363-37092a8e1089.docx', title: 'Cadre Logique (.doc)' },
    { filename: '48bbc6d8-7340-4fc7-94fa-2bb152aef349.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/48bbc6d8-7340-4fc7-94fa-2bb152aef349.docx', title: 'Action Plan (.doc)' },
    { filename: 'ad8d672b-eebe-4987-858e-20ef5ef52824.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/ad8d672b-eebe-4987-858e-20ef5ef52824.docx', title: 'Partners Declaration (.doc)' },
    { filename: 'cde18b96-8c66-49ef-b70e-e6e6ecb13234.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/cde18b96-8c66-49ef-b70e-e6e6ecb13234.docx', title: 'Applicant\'s Declaration (.doc)' },
    { filename: '88ce1b05-55bf-4466-8888-606b7a7b4123.docx', url: 'https://directus.thegovlab.com/uploads/datachallenge_africa/originals/88ce1b05-55bf-4466-8888-606b7a7b4123.docx', title: 'Logframe Matrix (.doc)' }
  ];
  
  for (const doc of documents) {
    const localPath = path.join('images', doc.filename);
    
    if (!fs.existsSync(localPath)) {
      try {
        console.log(`Downloading: ${doc.filename} (${doc.title})`);
        await downloadFile(doc.url, localPath);
        console.log(`✓ Downloaded: ${doc.filename}`);
      } catch (error) {
        console.log(`✗ Failed to download ${doc.filename}: ${error.message}`);
      }
    } else {
      console.log(`✓ Already exists: ${doc.filename}`);
    }
  }
  
  console.log('\n✓ All documents download completed!');
}

downloadDocuments().catch(console.error); 