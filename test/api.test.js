import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

process.env.NODE_ENV = 'test';
const { app } = await import('../server/index.js');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app).listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/health responds with status ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
});

test('Protected routes reject unauthenticated requests with 401', async () => {
  const protectedUrls = [
    { url: `${baseUrl}/api/consultations`, method: 'GET' },
    { url: `${baseUrl}/api/contacts`, method: 'GET' },
    { url: `${baseUrl}/api/admin/profile`, method: 'GET' },
    { url: `${baseUrl}/api/blogs`, method: 'POST', body: JSON.stringify({ title: 'Test', slug: 'test' }) },
  ];

  for (const item of protectedUrls) {
    const res = await fetch(item.url, {
      method: item.method,
      headers: { 'Content-Type': 'application/json' },
      body: item.body,
    });
    assert.equal(res.status, 401, `Expected 401 for ${item.method} ${item.url}`);
    const data = await res.json();
    assert.match(data.error, /Unauthorized/);
  }
});

test('Public consultation form submission works without authentication', async () => {
  const res = await fetch(`${baseUrl}/api/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Patient',
      phone: '+91 9999999999',
      concern: 'Medical Oncology',
      message: 'Initial consultation request',
    }),
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.name, 'Test Patient');
});

test('Public contact form submission works without authentication', async () => {
  const res = await fetch(`${baseUrl}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Inquirer',
      email: 'inquirer@example.com',
      phone: '+91 9876543210',
      subject: 'Reports & Scan Review',
      message: 'I would like to inquire about a PET-CT report review.',
    }),
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.name, 'Test Inquirer');
  assert.equal(data.subject, 'Reports & Scan Review');
  assert.equal(data.status, 'new');
});

test('Admin login rejects invalid credentials', async () => {
  const res = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
  });
  assert.equal(res.status, 401);
});

test('Admin login succeeds with valid credentials and issues session token and cookie', async () => {
  const res = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token, 'Token must be present in login response');

  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie && setCookie.includes('oncocure_admin_token='), 'Cookie must be set');

  // Authenticated request with Bearer token
  const authRes = await fetch(`${baseUrl}/api/consultations`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.equal(authRes.status, 200);
  const consultData = await authRes.json();
  assert.ok(Array.isArray(consultData.items));

  // Authenticated request with Cookie
  const cookieRes = await fetch(`${baseUrl}/api/admin/profile`, {
    headers: { Cookie: `oncocure_admin_token=${data.token}` },
  });
  assert.equal(cookieRes.status, 200);
  const profileData = await cookieRes.json();
  assert.ok(profileData.username);

  // Logout clears token
  const logoutRes = await fetch(`${baseUrl}/api/admin/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.equal(logoutRes.status, 200);

  // Subsequent request with the logged out token should fail
  const postLogoutRes = await fetch(`${baseUrl}/api/consultations`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.equal(postLogoutRes.status, 401);
});

test('Blog SEO canonicalUrl round-trips through POST / PUT / GET', async () => {
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.ok(loginData.token);

  const targetCanonical = 'https://oncocure.co.in/blogs/canonical-test-article';

  // Create a blog with a canonical URL
  const createRes = await fetch(`${baseUrl}/api/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({
      title: 'Canonical Test Article',
      slug: 'canonical-test-article',
      excerpt: 'A blog created to exercise the canonicalUrl SEO field.',
      content: '<p>Canonical round-trip test.</p>',
      category: 'Understanding Cancer',
      status: 'published',
      canonicalUrl: targetCanonical,
    }),
  });
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.canonicalUrl, targetCanonical);

  // GET the blog by slug and confirm the canonical landed
  const getRes = await fetch(`${baseUrl}/api/blogs/${encodeURIComponent(created.slug)}`);
  assert.equal(getRes.status, 200);
  const fetched = await getRes.json();
  assert.equal(fetched.canonicalUrl, targetCanonical);

  // Update to a different canonical URL
  const updatedCanonical = 'https://example.com/articles/canonical-now-changed';
  const updateRes = await fetch(`${baseUrl}/api/blogs/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({ canonicalUrl: updatedCanonical }),
  });
  assert.equal(updateRes.status, 200);
  const updated = await updateRes.json();
  assert.equal(updated.canonicalUrl, updatedCanonical);

  // Clearing the canonical should null it out
  const clearRes = await fetch(`${baseUrl}/api/blogs/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({ canonicalUrl: '' }),
  });
  assert.equal(clearRes.status, 200);
  const cleared = await clearRes.json();
  assert.equal(cleared.canonicalUrl, null);
});

test('Service SEO canonicalUrl round-trips through POST / PUT / GET', async () => {
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.ok(loginData.token);

  const slugSuffix = Date.now().toString(36);
  const targetCanonical = `https://oncocure.co.in/services/chemotherapy-canonical-${slugSuffix}`;
  const testSlug = `chemo-canonical-test-${slugSuffix}`;

  // Create a service with a canonical URL (POST /api/services)
  const createRes = await fetch(`${baseUrl}/api/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({
      title: 'Chemotherapy Canonical Test',
      slug: testSlug,
      group: 'Medical Oncology',
      summary: 'A service created to exercise the canonicalUrl SEO field.',
      description: '<p>Chemotherapy canonical round-trip test.</p>',
      canonicalUrl: targetCanonical,
    }),
  });
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.canonicalUrl, targetCanonical);
  assert.equal(created.slug, testSlug);

  // List services and confirm the canonical is present on the created service (GET /api/services)
  const listRes = await fetch(`${baseUrl}/api/services`);
  assert.equal(listRes.status, 200);
  const list = await listRes.json();
  assert.ok(Array.isArray(list.items));
  const found = list.items.find((s) => s.slug === testSlug);
  const byId = list.items.find((s) => s.id === created.id);
  assert.ok(found, 'created service should appear in the services list');
  assert.equal(found.canonicalUrl, targetCanonical, 'canonicalUrl should round-trip through the services list');
  assert.equal(byId?.canonicalUrl, targetCanonical, 'same service by id should also have the canonical in the list');

  // Update to a different canonical URL via PUT /api/services/:id
  const updatedCanonical = 'https://example.com/services/canonical-now-changed';
  const updateRes = await fetch(`${baseUrl}/api/services/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({ canonicalUrl: updatedCanonical }),
  });
  assert.equal(updateRes.status, 200);
  const updated = await updateRes.json();
  assert.equal(updated.canonicalUrl, updatedCanonical);

  // Confirm the update is reflected in the list too
  const listRes2 = await fetch(`${baseUrl}/api/services`);
  assert.equal(listRes2.status, 200);
  const list2 = await listRes2.json();
  const found2 = list2.items.find((s) => s.id === created.id);
  assert.ok(found2, 'updated service should still appear in the services list');
  assert.equal(found2.canonicalUrl, updatedCanonical, 'updated canonicalUrl should be visible in the services list');

  // Clearing the canonical should null it out (empty string -> null)
  const clearRes = await fetch(`${baseUrl}/api/services/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({ canonicalUrl: '' }),
  });
  assert.equal(clearRes.status, 200);
  const cleared = await clearRes.json();
  assert.equal(cleared.canonicalUrl, null);

  // Confirm the clear is reflected in the list too
  const listRes3 = await fetch(`${baseUrl}/api/services`);
  assert.equal(listRes3.status, 200);
  const list3 = await listRes3.json();
  const found3 = list3.items.find((s) => s.id === created.id);
  assert.ok(found3, 'cleared service should still appear in the services list');
  assert.equal(found3.canonicalUrl, null, 'cleared canonicalUrl should be null in the services list');
});
