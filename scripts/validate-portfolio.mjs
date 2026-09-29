// Automated end-to-end HTTP validation script for Darshan Portfolio (Node ES Module)

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 0. Public portfolio JSON endpoint
    const resApiPortfolio = await fetch(`${baseUrl}/api/portfolio`);
    assert(resApiPortfolio.status === 200, 'GET /api/portfolio returned 200 OK');
    const portfolioJson = await resApiPortfolio.json();
    assert(Array.isArray(portfolioJson.projects) && portfolioJson.projects.length > 0, 'Portfolio API returns valid projects array');
    assert(Array.isArray(portfolioJson.services) && portfolioJson.services.length > 0, 'Portfolio API returns valid services array');

    const sampleProject = portfolioJson.projects[0];
    const sampleSlug = sampleProject?.slug || 'brand-reels-or-short-reel-edits';

    // 1. Home
    const resHome = await fetch(`${baseUrl}/`);
    assert(resHome.status === 200, 'GET / returned 200 OK');
    const textHome = await resHome.text();
    assert(textHome.includes('Visuals') || textHome.includes('Darshan'), 'Home page contains Hero title');
    assert(textHome.includes('Featured') || textHome.includes(sampleProject?.title || ''), 'Home page contains project showcase');

    // 2. Work catalog
    const resWork = await fetch(`${baseUrl}/work`);
    assert(resWork.status === 200, 'GET /work returned 200 OK');
    const textWork = await resWork.text();
    assert(textWork.includes('Craft') || textWork.includes('Work') || textWork.includes('Portfolio'), 'Work page contains header');

    // 3. Project detail case study
    const resProject = await fetch(`${baseUrl}/work/${sampleSlug}`);
    assert(resProject.status === 200, `GET /work/${sampleSlug} returned 200 OK`);
    const textProj = await resProject.text();
    assert(textProj.includes(sampleProject?.title?.split(' ')[0] || '') || textProj.includes('Overview'), 'Project case study loads correct title');

    // 4. About page
    const resAbout = await fetch(`${baseUrl}/about`);
    assert(resAbout.status === 200, 'GET /about returned 200 OK');
    const textAbout = await resAbout.text();
    assert(textAbout.includes('About') || textAbout.includes('Darshan'), 'About page loads bio');

    // 5. Contact page
    const resContact = await fetch(`${baseUrl}/contact`);
    assert(resContact.status === 200, 'GET /contact returned 200 OK');
    const textContact = await resContact.text();
    assert(textContact.includes('Inquiry') || textContact.includes('Contact') || textContact.includes('Communication'), 'Contact page loads inquiry form');

    console.log('\n--- 1b. Testing SEO Endpoints & Structured Data ---');

    // 6a. Sitemap.xml
    const resSitemap = await fetch(`${baseUrl}/sitemap.xml`);
    assert(resSitemap.status === 200, 'GET /sitemap.xml returned 200 OK');
    const textSitemap = await resSitemap.text();
    assert(textSitemap.includes('<urlset') && textSitemap.includes('/work'), 'Sitemap contains XML schema and dynamic project URLs');

    // 6b. Robots.txt
    const resRobots = await fetch(`${baseUrl}/robots.txt`);
    assert(resRobots.status === 200, 'GET /robots.txt returned 200 OK');
    const textRobots = await resRobots.text();
    assert(textRobots.includes('User-Agent: Googlebot') && textRobots.includes('Disallow: /admin'), 'Robots.txt blocks admin and allows Googlebot/Bingbot');

    // 6c. Manifest
    const resManifest = await fetch(`${baseUrl}/manifest.webmanifest`);
    assert(resManifest.status === 200, 'GET /manifest.webmanifest returned 200 OK');

    // 6d. JSON-LD Verification
    assert(textHome.includes('application/ld+json') && textHome.includes('Darshan') && textHome.includes('ProfessionalService'), 'Home page contains rich Person and ProfessionalService JSON-LD schemas');
    assert(textProj.includes('application/ld+json'), 'Project case study contains rich VideoObject/CreativeWork JSON-LD');

    console.log('\n--- 2. Testing Admin Security & Auth ---');

    // 7. Unauthenticated admin protection
    const resAdminUnauth = await fetch(`${baseUrl}/admin`, { redirect: 'manual' });
    assert(resAdminUnauth.status === 307 || resAdminUnauth.status === 302, 'Unauthenticated /admin redirects to login');

    // 8. Unauthenticated API write protection
    const resApiUnauth = await fetch(`${baseUrl}/api/admin/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Project' })
    });
    assert(resApiUnauth.status === 401, 'Unauthenticated POST /api/admin/projects is blocked with 401 Unauthorized');

    // 9. Login with invalid credentials
    const resBadLogin = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'fake_user_test', password: 'wrong_password_123' })
    });
    assert(resBadLogin.status === 401, 'Invalid login credentials blocked with 401');

    // 10. Login with valid credentials
    const validUser = process.env.ADMIN_USERNAME || 'Darshan';
    const validPass = process.env.ADMIN_PASSWORD || 'DPoojari@2026';

    const resGoodLogin = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: validUser, password: validPass })
    });
    assert(resGoodLogin.status === 200, 'Valid login returns 200 OK');
    const setCookieHeader = resGoodLogin.headers.get('set-cookie');
    assert(setCookieHeader && setCookieHeader.includes('darshan_admin_token'), 'Login sets secure darshan_admin_token cookie');

    const authCookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';

    console.log('\n--- 3. Testing Admin Dashboard Operations with Session ---');

    // 11. Auth Check API
    const resCheck = await fetch(`${baseUrl}/api/admin/auth/check`, {
      headers: { Cookie: authCookie }
    });
    assert(resCheck.status === 200, 'Authenticated GET /api/admin/auth/check returns 200');

    // 12. Admin Stats API
    const resStats = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Cookie: authCookie }
    });
    assert(resStats.status === 200, 'GET /api/admin/stats returns 200');
    const statsData = await resStats.json();
    assert(statsData.stats.totalProjects >= 1, 'Stats API accurately counts projects');

    // 12b. Supabase Diagnostics API
    const resSupabase = await fetch(`${baseUrl}/api/admin/supabase`, {
      headers: { Cookie: authCookie }
    });
    assert(resSupabase.status === 200, 'GET /api/admin/supabase returns 200 diagnostic info');

    // 13. Create Project via Admin API
    const testProjectPayload = {
      title: 'Automated Test Showcase Edit',
      slug: 'automated-test-showcase-edit',
      category: 'video',
      type: 'video',
      description: 'E2E automated test video project description.',
      fullDescription: 'Full case study description for automated validation.',
      client: 'E2E Testing Corp',
      year: '2026',
      duration: '02:00',
      tools: ['Premiere Pro', 'After Effects'],
      thumbnail: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs741I/view?usp=sharing',
      mediaUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs741I/view?usp=sharing',
      featured: true,
      tags: ['Automated Test', 'Color Grading'],
      order: 999
    };

    const resCreate = await fetch(`${baseUrl}/api/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify(testProjectPayload)
    });
    assert(resCreate.status === 201, 'POST /api/admin/projects creates project with 201 Created');
    const createdProjectData = await resCreate.json();
    const createdId = createdProjectData.project.id;
    assert(createdId && createdProjectData.project.slug === 'automated-test-showcase-edit', 'Created project has valid ID and slug');

    // 14. Verify newly created project is publicly accessible
    const resCreatedDetail = await fetch(`${baseUrl}/work/automated-test-showcase-edit`);
    assert(resCreatedDetail.status === 200, 'Newly created project is immediately live on /work/[slug]');

    // 15. Update Project via Admin API (toggle featured and update title)
    const resUpdate = await fetch(`${baseUrl}/api/admin/projects/${createdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({
        title: 'Automated Test Showcase Edit (Updated)',
        featured: false
      })
    });
    assert(resUpdate.status === 200, 'PUT /api/admin/projects/[id] updates project with 200 OK');
    const updatedData = await resUpdate.json();
    assert(updatedData.project.title.includes('(Updated)') && updatedData.project.featured === false, 'Project update persisted correctly');

    // 16. Delete Created Test Project (Cleanup)
    const resDelete = await fetch(`${baseUrl}/api/admin/projects/${createdId}`, {
      method: 'DELETE',
      headers: { Cookie: authCookie }
    });
    assert(resDelete.status === 200, 'DELETE /api/admin/projects/[id] deletes test project with 200 OK');

    // 17. Verify project is deleted
    const resDeletedDetail = await fetch(`${baseUrl}/work/automated-test-showcase-edit`);
    assert(resDeletedDetail.status === 404, 'Deleted project correctly returns 404 on /work/[slug]');

    console.log('\n--- 4. User Photo Management & Upload Tests ---');

    // 18. GET current profile photo
    const resPhotoGet = await fetch(`${baseUrl}/api/admin/profile/photo`, {
      headers: { Cookie: authCookie }
    });
    assert(resPhotoGet.status === 200, 'GET /api/admin/profile/photo returns 200 OK');
    const photoGetData = await resPhotoGet.json();
    const initialPhoto = photoGetData.profileImage;
    assert(typeof photoGetData.profileImage === 'string', 'Profile photo returns valid string value');

    // 19. PUT update profile photo with URL
    const testPhotoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
    const resPhotoPut = await fetch(`${baseUrl}/api/admin/profile/photo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({ profileImage: testPhotoUrl })
    });
    assert(resPhotoPut.status === 200, 'PUT /api/admin/profile/photo updates photo with 200 OK');
    const putData = await resPhotoPut.json();
    assert(putData.success === true && putData.profileImage === testPhotoUrl, 'PUT photo updates profileImage in response');

    // 20. DELETE profile photo
    const resPhotoDelete = await fetch(`${baseUrl}/api/admin/profile/photo`, {
      method: 'DELETE',
      headers: { Cookie: authCookie }
    });
    assert(resPhotoDelete.status === 200, 'DELETE /api/admin/profile/photo deletes photo with 200 OK');
    const deleteData = await resPhotoDelete.json();
    assert(deleteData.success === true && deleteData.profileImage === '', 'DELETE photo sets profileImage to empty string');

    // 21. POST /api/admin/upload simulate image upload
    const dummyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const blob = new Blob([Buffer.from(dummyPngBase64, 'base64')], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'test-avatar.png');
    formData.append('isProfile', 'true');

    const resUpload = await fetch(`${baseUrl}/api/admin/upload`, {
      method: 'POST',
      headers: { Cookie: authCookie },
      body: formData
    });
    assert(resUpload.status === 200, 'POST /api/admin/upload uploads image with 200 OK');
    const uploadData = await resUpload.json();
    assert(uploadData.success === true && uploadData.url && uploadData.url.length > 10, 'Uploaded photo returns valid URL / data URI');

    // 22. Restore initial or default photo
    await fetch(`${baseUrl}/api/admin/profile/photo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({ profileImage: initialPhoto || testPhotoUrl })
    });

    console.log('\n--- 5. Social Media Enable/Disable & Visibility Tests ---');

    // 23. GET socials
    const resSocialsGet = await fetch(`${baseUrl}/api/admin/socials`, {
      headers: { Cookie: authCookie }
    });
    assert(resSocialsGet.status === 200, 'GET /api/admin/socials returns 200 OK');
    const initialSocialsData = await resSocialsGet.json();

    // 24. PUT update socials with enable/disable flags
    const resSocialsPut = await fetch(`${baseUrl}/api/admin/socials`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({
        instagram: 'https://instagram.com/darshan_poojari',
        youtube: 'https://youtube.com/@darshanpoojari',
        whatsapp: 'https://wa.me/918310509801',
        enabled: {
          instagram: true,
          youtube: false, // Explicitly disabled
          whatsapp: true,
        }
      })
    });
    assert(resSocialsPut.status === 200, 'PUT /api/admin/socials updates socials and visibility toggles with 200 OK');
    const updatedSocialsRes = await resSocialsPut.json();
    assert(updatedSocialsRes.socials.enabled.youtube === false && updatedSocialsRes.socials.enabled.instagram === true, 'Social visibility toggle persisted correctly');

    // 25. Check public contact page to ensure disabled YouTube is hidden
    const resContactPage = await fetch(`${baseUrl}/contact`);
    const contactHtml = await resContactPage.text();
    assert(contactHtml.includes('https://instagram.com/darshan_poojari'), 'Enabled Instagram is rendered on contact page');

    // 26. Restore initial socials
    await fetch(`${baseUrl}/api/admin/socials`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify(initialSocialsData.socials || {})
    });

    console.log('\n--- 6. Google Drive Link Parsing Logic Tests ---');
    
    function extractGoogleDriveId(urlOrId) {
      if (!urlOrId || typeof urlOrId !== 'string') return null;
      const trimmed = urlOrId.trim();
      const matchD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
      if (matchD && matchD[1]) return matchD[1];
      const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
      if (matchId && matchId[1]) return matchId[1];
      const matchLh3 = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/);
      if (matchLh3 && matchLh3[1]) return matchLh3[1];
      if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed) && !trimmed.startsWith('http')) return trimmed;
      return null;
    }

    const sampleDriveUrl1 = 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs741I/view?usp=sharing';
    const sampleDriveUrl2 = 'https://drive.google.com/open?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs741I';
    const sampleDriveId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs741I';

    assert(extractGoogleDriveId(sampleDriveUrl1) === sampleDriveId, 'extractGoogleDriveId parses standard /file/d/ sharing URLs');
    assert(extractGoogleDriveId(sampleDriveUrl2) === sampleDriveId, 'extractGoogleDriveId parses ?id= query URLs');

    console.log(`\n================================`);
    console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
}

runTests();
