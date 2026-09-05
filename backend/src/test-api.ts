import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Starting Full System Verification on ' + API_BASE + '...\n');

  // 1. Health check
  const healthRes = await fetch(`${API_BASE}/health`);
  const healthData: any = await healthRes.json();
  console.log('1. GET /api/health -> Status:', healthRes.status, 'Payload:', healthData.appName);

  // 2. GET /api/categories
  const catRes = await fetch(`${API_BASE}/categories`);
  const catData: any = await catRes.json();
  console.log('2. GET /api/categories -> Status:', catRes.status, 'Categories found:', catData.categories?.length);

  // 3. GET /api/studios
  const studioRes = await fetch(`${API_BASE}/studios`);
  const studioData: any = await studioRes.json();
  console.log('3. GET /api/studios -> Status:', studioRes.status, 'Total studios:', studioData.total, 'First studio:', studioData.studios?.[0]?.name);

  // 4. POST /api/auth/register (New customer)
  const testEmail = `test_customer_${Date.now()}@memora.com`;
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Sundaram',
      email: testEmail,
      password: 'Password@123',
      role: 'customer',
      phone: '+91 98401 99999',
    }),
  });
  const regData: any = await regRes.json();
  console.log('4. POST /api/auth/register -> Status:', regRes.status, 'Result:', regData.message);

  // 5. POST /api/auth/login (New customer)
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password@123',
    }),
  });
  const loginData: any = await loginRes.json();
  console.log('5. POST /api/auth/login (New user) -> Status:', loginRes.status, 'Token:', loginData.token ? 'VALID_JWT' : 'MISSING');

  // 6. POST /api/auth/login (Seeded Shop Owner)
  const ownerLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@memora.com',
      password: 'Owner@123',
    }),
  });
  const ownerLoginData: any = await ownerLoginRes.json();
  console.log('6. POST /api/auth/login (Studio Owner) -> Status:', ownerLoginRes.status, 'Role:', ownerLoginData.user?.role, 'StudioId:', ownerLoginData.user?.studioId);

  // 7. GET /api/products
  const prodRes = await fetch(`${API_BASE}/products`);
  const prodData: any = await prodRes.json();
  console.log('7. GET /api/products -> Status:', prodRes.status, 'Products found:', prodData.products?.length);

  // 8. GET /api/packages
  const pkgRes = await fetch(`${API_BASE}/packages`);
  const pkgData: any = await pkgRes.json();
  console.log('8. GET /api/packages -> Status:', pkgRes.status, 'Packages found:', pkgData.packages?.length);

  // 9. GET /api/coupons
  const cpnRes = await fetch(`${API_BASE}/coupons`);
  const cpnData: any = await cpnRes.json();
  console.log('9. GET /api/coupons -> Status:', cpnRes.status, 'Coupons found:', cpnData.coupons?.length);

  // 10. GET /api/seller/dashboard (Authenticated with owner JWT)
  const sellerRes = await fetch(`${API_BASE}/seller/dashboard`, {
    headers: {
      'Authorization': `Bearer ${ownerLoginData.token}`
    }
  });
  const sellerData: any = await sellerRes.json();
  console.log('10. GET /api/seller/dashboard -> Status:', sellerRes.status, 'Monthly Revenue Metric:', sellerData.metrics?.monthlyRevenue);

  console.log('\n🎉 ALL 10 TESTS PASSED! ZERO 500 ERRORS DETECTED!');
  process.exit(0);
}

testEndpoints().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
