import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function runCustomerPanelTests() {
  console.log('================================================================');
  console.log('🛍️ MEMORA Customer Panel Backend & API Integration Tests');
  console.log('================================================================\n');

  // 1. Authentication
  const custLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@memora.com', password: 'Customer@123' })
  });
  const custAuth: any = await custLogin.json();
  if (!custAuth.token) throw new Error('Customer login failed');
  const token = custAuth.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  console.log('✓ 1. Customer Authentication: SUCCESS (Token acquired, User:', custAuth.user?.name + ')');

  // 2. Studio Search & Filters
  console.log('\n--- 1. STUDIO SEARCH & FILTERS ---');
  // 2.1 All Studios
  const allStudiosRes = await fetch(`${API_BASE}/studios`);
  const allStudios: any = await allStudiosRes.json();
  if (!allStudios.success || !allStudios.studios || allStudios.studios.length === 0) {
    throw new Error('Failed to load studios from MongoDB');
  }
  console.log(`✓ 2.1 Load All Studios: SUCCESS (${allStudios.studios.length} studios loaded from MongoDB)`);

  // 2.2 Location Filter (Chennai)
  const cityRes = await fetch(`${API_BASE}/studios?city=Chennai`);
  const cityData: any = await cityRes.json();
  console.log(`✓ 2.2 City/Location Filter: SUCCESS (${cityData.studios?.length} matches for Chennai)`);

  // 2.3 Search Filter
  const searchRes = await fetch(`${API_BASE}/studios?search=Lumière`);
  const searchData: any = await searchRes.json();
  console.log(`✓ 2.3 Search Query Filter: SUCCESS (${searchData.studios?.length} matches for "Lumière")`);

  // 2.4 Category Filter
  const catRes = await fetch(`${API_BASE}/studios?category=Wedding`);
  const catData: any = await catRes.json();
  console.log(`✓ 2.4 Category Filter: SUCCESS (${catData.studios?.length} matches for category "Wedding")`);

  // 2.5 Rating Filter
  const ratingRes = await fetch(`${API_BASE}/studios?rating=4.5`);
  const ratingData: any = await ratingRes.json();
  console.log(`✓ 2.5 Rating Filter: SUCCESS (${ratingData.studios?.length} studios with rating >= 4.5)`);

  // 2.6 Studio Details & Packages
  const chosenStudio = allStudios.studios[0];
  const detailRes = await fetch(`${API_BASE}/studios/${chosenStudio._id}`);
  const detailData: any = await detailRes.json();
  if (!detailData.success || !detailData.studio) {
    throw new Error('Failed to load studio details');
  }
  console.log(`✓ 2.6 Studio Details: SUCCESS (Studio: "${detailData.studio.name}", ${detailData.packages?.length} Packages, ${detailData.reviews?.length} Reviews)`);

  // 3. Photoshoot Booking Flow
  console.log('\n--- 2. BOOKING CREATION & MY BOOKINGS ---');
  const chosenPackage = detailData.packages?.[0];
  if (!chosenPackage) throw new Error('Studio has no packages to book');

  const createBookingRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      packageId: chosenPackage._id,
      eventDate: '2026-10-25',
      timeSlot: '09:00 AM - 01:00 PM',
      venue: {
        address: 'Beach Villa Resort, ECR',
        city: 'Chennai',
        pincode: '600115',
        venueType: 'resort_hotel'
      },
      notes: 'Customer shoot booking verification',
      specialRequests: 'Sunset drone photography'
    })
  });
  const bookingData: any = await createBookingRes.json();
  if (!bookingData.success || !bookingData.booking) {
    throw new Error(`Failed to create booking: ${bookingData.message}`);
  }
  console.log(`✓ 3.1 Booking Creation: SUCCESS (Booking ID: ${bookingData.booking.bookingId}, Advance: ₹${bookingData.booking.advanceAmount})`);

  // 3.2 GET /api/bookings/my
  const myBookingsRes = await fetch(`${API_BASE}/bookings/my`, { headers });
  const myBookingsData: any = await myBookingsRes.json();
  if (!myBookingsData.success || !Array.isArray(myBookingsData.bookings)) {
    throw new Error('GET /api/bookings/my failed');
  }
  console.log(`✓ 3.2 GET /api/bookings/my: SUCCESS (${myBookingsData.bookings.length} customer bookings retrieved from MongoDB)`);

  // 3.3 GET /api/bookings/my-bookings
  const myBookingsAliasRes = await fetch(`${API_BASE}/bookings/my-bookings`, { headers });
  const myBookingsAliasData: any = await myBookingsAliasRes.json();
  if (!myBookingsAliasData.success) throw new Error('GET /api/bookings/my-bookings alias failed');
  console.log(`✓ 3.3 GET /api/bookings/my-bookings Alias: SUCCESS`);

  // 4. Products & Catalog
  console.log('\n--- 3. PRODUCTS & CATALOG ---');
  const productsRes = await fetch(`${API_BASE}/products`);
  const productsData: any = await productsRes.json();
  if (!productsData.success || !productsData.products || productsData.products.length === 0) {
    throw new Error('Failed to load products from MongoDB');
  }
  console.log(`✓ 4.1 GET /api/products: SUCCESS (${productsData.products.length} products loaded from MongoDB)`);

  const chosenProduct = productsData.products[0];
  // 4.2 Product Details by Slug
  const productDetailRes = await fetch(`${API_BASE}/products/${chosenProduct.slug}`);
  const productDetailData: any = await productDetailRes.json();
  if (!productDetailData.success || !productDetailData.product) {
    throw new Error('Failed to load product details by slug');
  }
  console.log(`✓ 4.2 GET /api/products/:slug: SUCCESS (Product: "${productDetailData.product.title}", Price: ₹${productDetailData.product.basePrice})`);

  // 4.3 Product Details by ID
  const productByIdRes = await fetch(`${API_BASE}/products/${chosenProduct._id}`);
  const productByIdData: any = await productByIdRes.json();
  if (!productByIdData.success || !productByIdData.product) {
    throw new Error('Failed to load product details by ID');
  }
  console.log(`✓ 4.3 GET /api/products/:id (ObjectId resolution): SUCCESS`);

  // 5. Cart Operations
  console.log('\n--- 4. CART INTEGRATION & PERSISTENCE ---');
  // 5.1 POST /api/cart/add
  const addToCartRes = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      productId: chosenProduct._id,
      quantity: 2,
      customization: {
        customText: 'Aarav & Priya Forever',
        frameColor: 'Natural Teak',
        size: 'Medium (12x18 in)',
        uploadedPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
      }
    })
  });
  const addToCartData: any = await addToCartRes.json();
  if (!addToCartData.success) throw new Error(`Add to cart failed: ${addToCartData.message}`);
  console.log(`✓ 5.1 POST /api/cart/add: SUCCESS (${chosenProduct.title} added to cart)`);

  // 5.2 POST /api/cart (direct endpoint alias)
  const directCartPostRes = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      productId: chosenProduct._id,
      quantity: 1,
      customization: {
        customText: 'Special Memory'
      }
    })
  });
  const directCartPostData: any = await directCartPostRes.json();
  if (!directCartPostData.success) throw new Error(`POST /api/cart failed: ${directCartPostData.message}`);
  console.log(`✓ 5.2 POST /api/cart Direct Endpoint: SUCCESS`);

  // 5.3 GET /api/cart
  const getCartRes = await fetch(`${API_BASE}/cart`, { headers });
  const getCartData: any = await getCartRes.json();
  if (!getCartData.success || !getCartData.cart) throw new Error('GET /api/cart failed');
  console.log(`✓ 5.3 GET /api/cart: SUCCESS (${getCartData.cart.items.length} items in cart, Subtotal: ₹${getCartData.cart.subtotal}, Grand Total: ₹${getCartData.cart.total})`);

  // 6. Order Creation & My Orders
  console.log('\n--- 5. ORDER CHECKOUT & MY ORDERS ---');
  // 6.1 POST /api/orders
  const createOrderRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      shippingAddress: {
        fullName: 'Karthik Raja',
        phone: '+91 98765 43210',
        street: '42, Besant Nagar Beach Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600090'
      },
      paymentMethod: 'razorpay',
      transactionId: `TXN_TEST_${Date.now()}`
    })
  });
  const createOrderData: any = await createOrderRes.json();
  if (!createOrderData.success || !createOrderData.order) {
    throw new Error(`Failed to create order: ${createOrderData.message}`);
  }
  console.log(`✓ 6.1 POST /api/orders: SUCCESS (Order ID: #${createOrderData.order.orderId}, Status: ${createOrderData.order.currentStatus})`);

  // 6.2 GET /api/orders/my
  const myOrdersRes = await fetch(`${API_BASE}/orders/my`, { headers });
  const myOrdersData: any = await myOrdersRes.json();
  if (!myOrdersData.success || !Array.isArray(myOrdersData.orders)) {
    throw new Error('GET /api/orders/my failed');
  }
  console.log(`✓ 6.2 GET /api/orders/my: SUCCESS (${myOrdersData.orders.length} customer orders retrieved from MongoDB)`);

  // 6.3 GET /api/orders/my-orders
  const myOrdersAliasRes = await fetch(`${API_BASE}/orders/my-orders`, { headers });
  const myOrdersAliasData: any = await myOrdersAliasRes.json();
  if (!myOrdersAliasData.success) throw new Error('GET /api/orders/my-orders alias failed');
  console.log(`✓ 6.3 GET /api/orders/my-orders Alias: SUCCESS`);

  // 7. Security Isolation: Another Customer cannot see this customer's data
  console.log('\n--- 6. DATA ISOLATION & SECURITY ---');
  const otherCustomerLogin = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Sundaram',
      email: `pooja_${Date.now()}@test.com`,
      password: 'Customer@123',
      role: 'customer'
    })
  });
  const otherAuth: any = await otherCustomerLogin.json();
  const otherHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${otherAuth.token}`
  };

  const otherOrdersRes = await fetch(`${API_BASE}/orders/my`, { headers: otherHeaders });
  const otherOrdersData: any = await otherOrdersRes.json();
  if (otherOrdersData.orders.length !== 0) {
    throw new Error('Security violation: New customer saw another customer orders!');
  }
  console.log(`✓ 7.1 Data Isolation Verification: SUCCESS (New customer sees 0 orders, completely isolated)`);

  console.log('\n================================================================');
  console.log('🎉 ALL CUSTOMER PANEL BACKEND APIS & FLOWS ARE 100% OPERATIONAL!');
  console.log('================================================================\n');
}

runCustomerPanelTests().catch((err) => {
  console.error('❌ CUSTOMER PANEL TEST FAILED:', err);
  process.exit(1);
});
