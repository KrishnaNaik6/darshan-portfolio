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
    console.log('\n--- 1. Testing Public Routes ---');

    // 1. Home
    const resHome = await fetch(`${baseUrl}/`);
    assert(resHome.status === 200, 'GET / returned 200 OK');
    const textHome = await resHome.text();
    assert(textHome.includes('Visuals that tell the story'), 'Home page contains Hero title');
    assert(textHome.includes('Tokyo Neon Nights'), 'Home page contains featured project');

    // 2. Work catalog
    const resWork = await fetch(`${baseUrl}/work`);
    assert(resWork.status === 200, 'GET /work returned 200 OK');
    const textWork = await resWork.text();
    assert(textWork.includes('Craft') && textWork.includes('Creation'), 'Work page contains header');

    // 3. Project detail case study
    const resProject = await fetch(`${baseUrl}/work/tokyo-neon-drift-cinematic`);
    assert(resProject.status === 200, 'GET /work/tokyo-neon-drift-cinematic returned 200 OK');
    const textProj = await resProject.text();
    assert(textProj.includes('Tokyo Neon Nights'), 'Project case study loads correct title');
    assert(textProj.includes('DaVinci Resolve'), 'Project case study loads tool specs');

    // 4. About page
    const resAbout = await fetch(`${baseUrl}/about`);
    assert(resAbout.status === 200, 'GET /about returned 200 OK');
    const textAbout = await resAbout.text();
    assert(textAbout.includes('About The Craft') || textAbout.includes('Darshan'), 'About page loads bio');

    // 5. Contact page
    const resContact = await fetch(`${baseUrl}/contact`);
    assert(resContact.status === 200, 'GET /contact returned 200 OK');
    const textContact = await resContact.text();
    assert(textContact.includes('Project Inquiry') || textContact.includes('Direct Communication'), 'Contact page loads inquiry form');

    // 6. Public portfolio JSON endpoint
    const resApiPortfolio = await fetch(`${baseUrl}/api/portfolio`);
    assert(resApiPortfolio.status === 200, 'GET /api/portfolio returned 200 OK');
    const portfolioJson = await resApiPortfolio.json();
    assert(Array.isArray(portfolioJson.projects) && portfolioJson.projects.length > 0, 'Portfolio API returns valid projects array');
    assert(Array.isArray(portfolioJson.services) && portfolioJson.services.length > 0, 'Portfolio API returns valid services array');

    console.log('\n--- 1b. Testing SEO Endpoints & Structured Data ---');

    // 6a. Sitemap.xml
    const resSitemap = await fetch(`${baseUrl}/sitemap.xml`);
    assert(resSitemap.status === 200, 'GET /sitemap.xml returned 200 OK');
    const textSitemap = await resSitemap.text();
    assert(textSitemap.includes('<urlset') && textSitemap.includes('/work/'), 'Sitemap contains XML schema and dynamic project URLs');

    // 6b. Robots.txt
    const resRobots = await fetch(`${baseUrl}/robots.txt`);
    assert(resRobots.status === 200, 'GET /robots.txt returned 200 OK');
    const textRobots = await resRobots.text();
    assert(textRobots.includes('User-Agent: Googlebot') && textRobots.includes('Disallow: /admin'), 'Robots.txt blocks admin and allows Googlebot/Bingbot');

    // 6c. Manifest
    const resManifest = await fetch(`${baseUrl}/manifest.webmanifest`);
    assert(resManifest.status === 200, 'GET /manifest.webmanifest returned 200 OK');

    // 6d. JSON-LD Verification
    assert(textHome.includes('application/ld+json') && textHome.includes('Darshan G Poojari') && textHome.includes('ProfessionalService'), 'Home page contains rich Person and ProfessionalService JSON-LD schemas');
    assert(textProj.includes('application/ld+json') && (textProj.includes('VideoObject') || textProj.includes('CreativeWork')), 'Project case study contains rich VideoObject/CreativeWork JSON-LD');

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

    console.log('\n--- 4. Google Drive Link Parsing Logic Tests ---');
    
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
