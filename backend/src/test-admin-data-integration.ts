import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function runAdminDataIntegrationTest() {
  console.log('================================================================');
  console.log('🛡️ MEMORA Full Admin Data Integration & Synchronization Verification');
  console.log('================================================================\n');

  // 1. Authenticate All 3 Roles
  console.log('--- STEP 1: AUTHENTICATION (CUSTOMER, SHOP OWNER, ADMIN) ---');
  // Admin Login
  const adminLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@memora.com', password: 'Admin@123' })
  });
  const adminAuth: any = await adminLogin.json();
  if (!adminAuth.token || adminAuth.user.role !== 'admin') throw new Error('Admin login failed');
  const adminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminAuth.token}`
  };
  console.log(`✓ 1.1 Super Admin Authenticated: ${adminAuth.user.name} (Role: ${adminAuth.user.role})`);

  // Customer Login
  const custLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@memora.com', password: 'Customer@123' })
  });
  const custAuth: any = await custLogin.json();
  const custHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${custAuth.token}`
  };
  console.log(`✓ 1.2 Customer Authenticated: ${custAuth.user.name}`);

  // Shop Owner Login
  const ownerLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@memora.com', password: 'Owner@123' })
  });
  const ownerAuth: any = await ownerLogin.json();
  const ownerHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ownerAuth.token}`
  };
  console.log(`✓ 1.3 Shop Owner Authenticated: ${ownerAuth.user.name}`);

  // 2. Admin Data Display from Real MongoDB
  console.log('\n--- STEP 2: ADMIN LIVE DATASETS VERIFICATION ---');

  // 2.1 Customers
  const custUsersRes = await fetch(`${API_BASE}/admin/users?role=customer`, { headers: adminHeaders });
  const custUsersData: any = await custUsersRes.json();
  if (!custUsersData.success || !Array.isArray(custUsersData.users)) throw new Error('Failed to load customers');
  console.log(`✓ 2.1 Admin Customers Directory: SUCCESS (${custUsersData.users.length} live customers found)`);

  // 2.2 Shop Owners
  const ownerUsersRes = await fetch(`${API_BASE}/admin/users?role=shop_owner`, { headers: adminHeaders });
  const ownerUsersData: any = await ownerUsersRes.json();
  if (!ownerUsersData.success || !Array.isArray(ownerUsersData.users)) throw new Error('Failed to load shop owners');
  console.log(`✓ 2.2 Admin Shop Owners Directory: SUCCESS (${ownerUsersData.users.length} live shop owners found)`);

  // 2.3 Studios
  const studiosRes = await fetch(`${API_BASE}/studios?status=all&limit=50`, { headers: adminHeaders });
  const studiosData: any = await studiosRes.json();
  if (!studiosData.success || !Array.isArray(studiosData.studios)) throw new Error('Failed to load studios');
  console.log(`✓ 2.3 Admin Studios Directory: SUCCESS (${studiosData.studios.length} studios with verifiedStatus tracking)`);

  // 2.4 Products
  const productsRes = await fetch(`${API_BASE}/admin/products`, { headers: adminHeaders });
  const productsData: any = await productsRes.json();
  if (!productsData.success || !Array.isArray(productsData.products)) throw new Error('Failed to load products');
  console.log(`✓ 2.4 Admin Products Catalog: SUCCESS (${productsData.products.length} live products loaded)`);

  // 2.5 Bookings
  const bookingsRes = await fetch(`${API_BASE}/admin/bookings`, { headers: adminHeaders });
  const bookingsData: any = await bookingsRes.json();
  if (!bookingsData.success || !Array.isArray(bookingsData.bookings)) throw new Error('Failed to load bookings');
  console.log(`✓ 2.5 Admin Bookings Master Ledger: SUCCESS (${bookingsData.bookings.length} photoshoot bookings loaded)`);

  // 2.6 Orders
  const ordersRes = await fetch(`${API_BASE}/admin/orders`, { headers: adminHeaders });
  const ordersData: any = await ordersRes.json();
  if (!ordersData.success || !Array.isArray(ordersData.orders)) throw new Error('Failed to load orders');
  console.log(`✓ 2.6 Admin Keepsake Orders: SUCCESS (${ordersData.orders.length} orders tracked)`);

  // 2.7 Payments
  const paymentsRes = await fetch(`${API_BASE}/admin/payments`, { headers: adminHeaders });
  const paymentsData: any = await paymentsRes.json();
  if (!paymentsData.success || !Array.isArray(paymentsData.payments)) throw new Error('Failed to load payments');
  console.log(`✓ 2.7 Admin Gateway Transactions: SUCCESS (${paymentsData.payments.length} transactions audited)`);

  // 2.8 Reviews
  const reviewsRes = await fetch(`${API_BASE}/admin/reviews`, { headers: adminHeaders });
  const reviewsData: any = await reviewsRes.json();
  if (!reviewsData.success || !Array.isArray(reviewsData.reviews)) throw new Error('Failed to load reviews');
  console.log(`✓ 2.8 Admin Reviews Moderation: SUCCESS (${reviewsData.reviews.length} reviews loaded)`);

  // 2.9 Complaints
  const complaintsRes = await fetch(`${API_BASE}/admin/complaints`, { headers: adminHeaders });
  const complaintsData: any = await complaintsRes.json();
  if (!complaintsData.success || !Array.isArray(complaintsData.complaints)) throw new Error('Failed to load complaints');
  console.log(`✓ 2.9 Admin Dispute Tickets: SUCCESS (${complaintsData.complaints.length} tickets on file)`);

  // 3. Admin Governance Actions: Approve Studio & User Status Toggle
  console.log('\n--- STEP 3: ADMIN GOVERNANCE & MODERATION ACTIONS ---');
  const targetStudio = studiosData.studios[0];
  const modStudioRes = await fetch(`${API_BASE}/studios/${targetStudio._id}/moderate`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'approved' })
  });
  const modStudioData: any = await modStudioRes.json();
  if (!modStudioData.success) throw new Error('Studio moderation failed');
  console.log(`✓ 3.1 Studio Verification / Moderation: SUCCESS (Studio "${targetStudio.name}" approved)`);

  const targetCustomer = custUsersData.users[0];
  const toggleUserRes = await fetch(`${API_BASE}/admin/users/${targetCustomer._id}/toggle-status`, {
    method: 'PUT',
    headers: adminHeaders
  });
  const toggleUserData: any = await toggleUserRes.json();
  if (!toggleUserData.success) throw new Error('User status toggle failed');
  console.log(`✓ 3.2 User Account Status Toggle: SUCCESS (${toggleUserData.message})`);

  // Re-enable customer
  await fetch(`${API_BASE}/admin/users/${targetCustomer._id}/toggle-status`, {
    method: 'PUT',
    headers: adminHeaders
  });

  // Moderate Review
  if (reviewsData.reviews.length > 0) {
    const targetRev = reviewsData.reviews[0];
    const modRevRes = await fetch(`${API_BASE}/admin/reviews/${targetRev._id}/moderate`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ isApproved: true })
    });
    const modRevData: any = await modRevRes.json();
    if (!modRevData.success) throw new Error('Review moderation failed');
    console.log(`✓ 3.3 Customer Review Moderation: SUCCESS (${modRevData.message})`);
  }

  // Create and Resolve Support Ticket
  const createTktRes = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: custHeaders,
    body: JSON.stringify({
      subject: 'Inquiry on Special Lens Delivery',
      description: 'Requesting confirmation on prime f/1.2 portrait lens availability for beach shoot',
      priority: 'medium',
      targetType: 'general'
    })
  });
  const createTktData: any = await createTktRes.json();
  if (!createTktData.success || !createTktData.complaint) throw new Error('Complaint creation failed');
  const ticketId = createTktData.complaint._id;
  console.log(`✓ 3.4 Support Ticket Registered: #${createTktData.complaint.ticketId}`);

  const resolveTktRes = await fetch(`${API_BASE}/admin/complaints/${ticketId}/status`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      status: 'resolved',
      resolution: 'Confirmed with Studio Lead: Sony 50mm f/1.2 GM prime lens is reserved and packed.'
    })
  });
  const resolveTktData: any = await resolveTktRes.json();
  if (!resolveTktData.success) throw new Error('Complaint resolution failed');
  console.log(`✓ 3.5 Support Ticket Resolved by Admin: SUCCESS (Status: ${resolveTktData.complaint.status})`);

  // 4. Complete Cross-Panel Synchronization Flow
  console.log('\n--- STEP 4: END-TO-END 3-PANEL SYNCHRONIZATION FLOW ---');
  console.log('Customer creates booking & order → Shop Owner receives → Admin sees → Shop Owner updates → Customer & Admin see update');

  // 4.1 Customer creates photoshoot booking
  const pkgRes = await fetch(`${API_BASE}/studios/${targetStudio._id}`);
  const pkgData: any = await pkgRes.json();
  const chosenPkg = pkgData.packages[0];

  const createBkgRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: custHeaders,
    body: JSON.stringify({
      packageId: chosenPkg._id,
      eventDate: '2026-12-05',
      timeSlot: '07:00 AM - 11:00 AM',
      venue: {
        address: 'Mahabalipuram Shore Temple Heritage Site',
        city: 'Chennai',
        pincode: '603104',
        venueType: 'temple_hall'
      },
      notes: 'Sunrise Temple Architecture Pre-Wedding Shoot'
    })
  });
  const createBkgData: any = await createBkgRes.json();
  if (!createBkgData.success) throw new Error('Booking creation failed');
  const syncBookingId = createBkgData.booking._id;
  console.log(`✓ 4.1 [Customer] Created Booking: #${createBkgData.booking.bookingId}`);

  // Advance payment
  const payRes = await fetch(`${API_BASE}/payments/verify`, {
    method: 'POST',
    headers: custHeaders,
    body: JSON.stringify({
      bookingId: syncBookingId,
      razorpay_order_id: `order_${Date.now()}`,
      razorpay_payment_id: `pay_${Date.now()}`,
      razorpay_signature: 'sig_ok'
    })
  });
  const payData: any = await payRes.json();
  console.log(`✓ 4.2 [Customer] Advance Payment Verified & Linked to Booking`);

  // 4.3 Customer creates order
  const prod = productsData.products[0];
  const createOrdRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: custHeaders,
    body: JSON.stringify({
      items: [
        {
          productId: prod._id,
          title: prod.title,
          category: prod.category,
          price: prod.discountPrice || prod.basePrice,
          quantity: 1,
          customization: { customText: 'Anand & Divya Temple Memories' }
        }
      ],
      shippingAddress: {
        fullName: custAuth.user.name,
        phone: '+91 98765 12345',
        street: 'Temple View Villa, Shore Road',
        city: 'Mahabalipuram',
        state: 'Tamil Nadu',
        pincode: '603104'
      },
      paymentMethod: 'razorpay',
      transactionId: `TXN_SYNC_${Date.now()}`
    })
  });
  const createOrdData: any = await createOrdRes.json();
  if (!createOrdData.success) throw new Error('Order creation failed');
  const syncOrderId = createOrdData.order._id;
  console.log(`✓ 4.3 [Customer] Created Physical Keepsake Order: #${createOrdData.order.orderId}`);

  // 4.4 Shop Owner receives booking & order
  const ownerBkgRes = await fetch(`${API_BASE}/bookings/studio-bookings`, { headers: ownerHeaders });
  const ownerBkgData: any = await ownerBkgRes.json();
  const ownerSawBooking = ownerBkgData.bookings?.some((b: any) => b._id === syncBookingId);
  if (!ownerSawBooking) throw new Error('Shop Owner did not receive customer booking');

  const ownerOrdRes = await fetch(`${API_BASE}/seller/orders`, { headers: ownerHeaders });
  const ownerOrdData: any = await ownerOrdRes.json();
  const ownerSawOrder = ownerOrdData.orders?.some((o: any) => o._id === syncOrderId);
  if (!ownerSawOrder) throw new Error('Shop Owner did not receive customer order');
  console.log(`✓ 4.4 [Shop Owner] Received Customer Booking & Order in Studio Hub`);

  // 4.5 Admin sees booking & order
  const adminBkgRes = await fetch(`${API_BASE}/admin/bookings`, { headers: adminHeaders });
  const adminBkgData: any = await adminBkgRes.json();
  const adminSawBooking = adminBkgData.bookings?.some((b: any) => b._id === syncBookingId);
  if (!adminSawBooking) throw new Error('Admin did not see customer booking');

  const adminOrdRes = await fetch(`${API_BASE}/admin/orders`, { headers: adminHeaders });
  const adminOrdData: any = await adminOrdRes.json();
  const adminSawOrder = adminOrdData.orders?.some((o: any) => o._id === syncOrderId);
  if (!adminSawOrder) throw new Error('Admin did not see customer order');
  console.log(`✓ 4.5 [Admin] Verified Customer Booking & Order in Admin Master Ledger`);

  // 4.6 Shop Owner updates booking to 'in_progress' and order to 'PRINTING'
  await fetch(`${API_BASE}/bookings/${syncBookingId}/status`, {
    method: 'PUT',
    headers: ownerHeaders,
    body: JSON.stringify({ bookingStatus: 'in_progress' })
  });

  await fetch(`${API_BASE}/orders/${syncOrderId}/status`, {
    method: 'PUT',
    headers: ownerHeaders,
    body: JSON.stringify({ status: 'PRINTING', note: 'Fine-art matte paper printing initiated' })
  });
  console.log(`✓ 4.6 [Shop Owner] Advanced Status: Booking → "in_progress", Order → "PRINTING"`);

  // 4.7 Customer sees updated status
  const custBkgVerifyRes = await fetch(`${API_BASE}/bookings/my`, { headers: custHeaders });
  const custBkgVerifyData: any = await custBkgVerifyRes.json();
  const verifiedCustBkg = custBkgVerifyData.bookings?.find((b: any) => b._id === syncBookingId);
  if (verifiedCustBkg.bookingStatus !== 'in_progress') {
    throw new Error(`Customer booking status mismatch: expected "in_progress", got "${verifiedCustBkg.bookingStatus}"`);
  }

  const custOrdVerifyRes = await fetch(`${API_BASE}/orders/my`, { headers: custHeaders });
  const custOrdVerifyData: any = await custOrdVerifyRes.json();
  const verifiedCustOrd = custOrdVerifyData.orders?.find((o: any) => o._id === syncOrderId);
  if (verifiedCustOrd.currentStatus !== 'PRINTING') {
    throw new Error(`Customer order status mismatch: expected "PRINTING", got "${verifiedCustOrd.currentStatus}"`);
  }
  console.log(`✓ 4.7 [Customer] Real-Time Verification: Sees Booking "in_progress" & Order "PRINTING"`);

  // 4.8 Admin sees updated status in real-time
  const adminBkgVerifyRes = await fetch(`${API_BASE}/admin/bookings`, { headers: adminHeaders });
  const adminBkgVerifyData: any = await adminBkgVerifyRes.json();
  const verifiedAdminBkg = adminBkgVerifyData.bookings?.find((b: any) => b._id === syncBookingId);
  if (verifiedAdminBkg.bookingStatus !== 'in_progress') {
    throw new Error(`Admin booking status mismatch: expected "in_progress", got "${verifiedAdminBkg.bookingStatus}"`);
  }

  const adminOrdVerifyRes = await fetch(`${API_BASE}/admin/orders`, { headers: adminHeaders });
  const adminOrdVerifyData: any = await adminOrdVerifyRes.json();
  const verifiedAdminOrd = adminOrdVerifyData.orders?.find((o: any) => o._id === syncOrderId);
  if (verifiedAdminOrd.currentStatus !== 'PRINTING') {
    throw new Error(`Admin order status mismatch: expected "PRINTING", got "${verifiedAdminOrd.currentStatus}"`);
  }
  console.log(`✓ 4.8 [Admin] Real-Time Verification: Sees Booking "in_progress" & Order "PRINTING"`);

  // 4.9 Admin advances order to OUT_FOR_DELIVERY
  await fetch(`${API_BASE}/admin/orders/${syncOrderId}/status`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ currentStatus: 'OUT_FOR_DELIVERY', note: 'Dispatched via Blue Dart Air Express' })
  });
  console.log(`✓ 4.9 [Admin] Updated Order Status directly to "OUT_FOR_DELIVERY"`);

  // Customer checks order again
  const custFinalOrdRes = await fetch(`${API_BASE}/orders/my`, { headers: custHeaders });
  const custFinalOrdData: any = await custFinalOrdRes.json();
  const verifiedFinalOrd = custFinalOrdData.orders?.find((o: any) => o._id === syncOrderId);
  if (verifiedFinalOrd.currentStatus !== 'OUT_FOR_DELIVERY') {
    throw new Error(`Customer final status mismatch: expected "OUT_FOR_DELIVERY", got "${verifiedFinalOrd.currentStatus}"`);
  }
  console.log(`✓ 4.10 [Customer] Real-Time Reflection: Sees Order Status "OUT_FOR_DELIVERY" with Admin update`);

  // 5. Payments Linked to Bookings & Orders Verification
  console.log('\n--- STEP 5: PAYMENTS LINKED TO BOOKINGS & ORDERS ---');
  const allAdminPaysRes = await fetch(`${API_BASE}/admin/payments`, { headers: adminHeaders });
  const allAdminPaysData: any = await allAdminPaysRes.json();
  const linkedPayment = allAdminPaysData.payments?.find((p: any) => p.bookingId?._id === syncBookingId || p.bookingId?.bookingId === createBkgData.booking.bookingId);
  if (!linkedPayment) throw new Error('Payment was not linked to photoshoot booking');
  console.log(`✓ 5.1 Payment Linked to Booking: #${linkedPayment.paymentId} → Booking #${createBkgData.booking.bookingId} (₹${linkedPayment.amount})`);

  console.log('\n================================================================');
  console.log('🎉 MEMORA ADMIN DATA INTEGRATION & 3-PANEL SYNCHRONIZATION 100% VERIFIED!');
  console.log('   - Customers, Shop Owners & Studios: LIVE MONGODB DATA');
  console.log('   - Products, Bookings & Orders: LIVE MONGODB DATA');
  console.log('   - Payments, Reviews & Complaints: LIVE MONGODB DATA');
  console.log('   - Full Admin Governance & Moderation: 100% OPERATIONAL');
  console.log('   - Customer ↔ Shop Owner ↔ Admin Cross-Panel Sync: 100% OPERATIONAL');
  console.log('================================================================\n');
}

runAdminDataIntegrationTest().catch((err) => {
  console.error('❌ ADMIN DATA INTEGRATION TEST FAILED:', err);
  process.exit(1);
});
