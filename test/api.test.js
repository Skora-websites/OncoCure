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
