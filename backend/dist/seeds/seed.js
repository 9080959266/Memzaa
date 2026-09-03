"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("../config/db.js");
const User_js_1 = require("../models/User.js");
const Studio_js_1 = require("../models/Studio.js");
const PhotoshootCategory_js_1 = require("../models/PhotoshootCategory.js");
const Package_js_1 = require("../models/Package.js");
const Product_js_1 = require("../models/Product.js");
const Inventory_js_1 = require("../models/Inventory.js");
const Booking_js_1 = require("../models/Booking.js");
const Order_js_1 = require("../models/Order.js");
const PhotoJob_js_1 = require("../models/PhotoJob.js");
const Proof_js_1 = require("../models/Proof.js");
const Invoice_js_1 = require("../models/Invoice.js");
const Coupon_js_1 = require("../models/Coupon.js");
const Review_js_1 = require("../models/Review.js");
const Notification_js_1 = require("../models/Notification.js");
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting MEMORA Database Seed...');
        await (0, db_js_1.connectDB)();
        // Clear existing collections
        await Promise.all([
            User_js_1.User.deleteMany({}),
            Studio_js_1.Studio.deleteMany({}),
            PhotoshootCategory_js_1.PhotoshootCategory.deleteMany({}),
            Package_js_1.Package.deleteMany({}),
            Product_js_1.Product.deleteMany({}),
            Inventory_js_1.Inventory.deleteMany({}),
            Booking_js_1.Booking.deleteMany({}),
            Order_js_1.Order.deleteMany({}),
            PhotoJob_js_1.PhotoJob.deleteMany({}),
            Proof_js_1.Proof.deleteMany({}),
            Invoice_js_1.Invoice.deleteMany({}),
            Coupon_js_1.Coupon.deleteMany({}),
            Review_js_1.Review.deleteMany({}),
            Notification_js_1.Notification.deleteMany({})
        ]);
        console.log('🧹 Cleaned existing database tables.');
        // 1. Create Users
        const salt = await bcryptjs_1.default.genSalt(10);
        const customerPassword = await bcryptjs_1.default.hash('Customer@123', salt);
        const ownerPassword = await bcryptjs_1.default.hash('Owner@123', salt);
        const adminPassword = await bcryptjs_1.default.hash('Admin@123', salt);
        const customerUser = await User_js_1.User.create({
            name: 'Priya Ramanathan',
            email: 'customer@memora.com',
            password: customerPassword,
            role: 'customer',
            phone: '+91 98401 23456',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            addresses: [
                {
                    label: 'Home',
                    fullName: 'Priya Ramanathan',
                    phone: '+91 98401 23456',
                    street: '14, 4th Main Road, Besant Nagar',
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    pincode: '600090',
                    isDefault: true
                }
            ],
            isVerified: true
        });
        const ownerUser = await User_js_1.User.create({
            name: 'Karthik Subramanian',
            email: 'owner@memora.com',
            password: ownerPassword,
            role: 'shop_owner',
            phone: '+91 98840 98765',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            addresses: [
                {
                    label: 'Studio',
                    fullName: 'Lumière Studio Office',
                    phone: '+91 98840 98765',
                    street: '45, Cathedral Road, Poes Garden',
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    pincode: '600086',
                    isDefault: true
                }
            ],
            isVerified: true
        });
        const ownerUser2 = await User_js_1.User.create({
            name: 'Rajesh Sharma',
            email: 'rajesh@voguecanvas.com',
            password: ownerPassword,
            role: 'shop_owner',
            phone: '+91 99001 55443',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            isVerified: true
        });
        const adminUser = await User_js_1.User.create({
            name: 'MEMORA Platform Admin',
            email: 'admin@memora.com',
            password: adminPassword,
            role: 'admin',
            phone: '+91 90000 11223',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
            isVerified: true
        });
        console.log('✅ Created Demo Users (Customer, Shop Owner, Admin).');
        // 2. Photoshoot Categories
        const categoriesData = [
            {
                name: 'Wedding Photography',
                slug: 'wedding',
                description: 'Grand royal wedding rituals, candid moments & cinematic portraits.',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                icon: 'heart',
                featured: true,
                order: 1
            },
            {
                name: 'Pre-Wedding & Couple',
                slug: 'pre-wedding',
                description: 'Romantic outdoor, beach & heritage destination couple shoots.',
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                icon: 'sparkles',
                featured: true,
                order: 2
            },
            {
                name: 'Baby & Newborn',
                slug: 'baby',
                description: 'Adorable themed backdrops, soft wraps & milestone captures for your little one.',
                image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
                icon: 'smile',
                featured: true,
                order: 3
            },
            {
                name: 'Puberty Ceremony',
                slug: 'puberty-ceremony',
                description: 'Traditional Manjal Neerattu Vizha / Ritu Kala Samskara ritual celebrations.',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                icon: 'flower',
                featured: true,
                order: 4
            },
            {
                name: 'Birthday & Cake Smash',
                slug: 'birthday',
                description: 'Fun, colorful birthday shoots with custom balloon backdrops & cake smash setups.',
                image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
                icon: 'gift',
                featured: true,
                order: 5
            },
            {
                name: 'Maternity Shoots',
                slug: 'maternity',
                description: 'Graceful maternity silhouettes and glowing mother-to-be gowns.',
                image: 'https://images.unsplash.com/photo-1557971370-e7298ee473fb?auto=format&fit=crop&w=800&q=80',
                icon: 'sun',
                featured: true,
                order: 6
            },
            {
                name: 'Family & Kinship',
                slug: 'family',
                description: 'Cherished multi-generational family group portraits and reunions.',
                image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?auto=format&fit=crop&w=800&q=80',
                icon: 'users',
                featured: true,
                order: 7
            },
            {
                name: 'Fashion & Portrait',
                slug: 'portrait',
                description: 'Editorial magazine style lighting, model portfolios & corporate headshots.',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                icon: 'camera',
                featured: true,
                order: 8
            },
            {
                name: 'Outdoor & Travel',
                slug: 'outdoor',
                description: 'Sunset golden hour, temple architectures & lush green scenic outdoor shoots.',
                image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
                icon: 'compass',
                featured: true,
                order: 9
            }
        ];
        const createdCategories = await PhotoshootCategory_js_1.PhotoshootCategory.insertMany(categoriesData);
        console.log(`✅ Created ${createdCategories.length} Photoshoot Categories.`);
        // 3. Create Studios
        const weddingCat = createdCategories.find(c => c.slug === 'wedding');
        const preWedCat = createdCategories.find(c => c.slug === 'pre-wedding');
        const babyCat = createdCategories.find(c => c.slug === 'baby');
        const pubertyCat = createdCategories.find(c => c.slug === 'puberty-ceremony');
        const maternityCat = createdCategories.find(c => c.slug === 'maternity');
        const studiosData = [
            {
                name: 'Lumière Weddings & Cinematography',
                ownerId: ownerUser._id,
                tagline: 'Capturing South Indian Weddings & Royal Heritage Moments',
                description: 'Award-winning photo studio in Chennai specializing in grand destination weddings, candid laughter, traditional temple ceremonies, and cinematic 4K films.',
                city: 'Chennai',
                address: '45, Cathedral Road, Poes Garden, Chennai - 600086',
                phone: '+91 98840 98765',
                email: 'hello@lumierechennai.com',
                rating: 4.9,
                reviewCount: 42,
                startingPrice: 15000,
                priceRange: '₹₹₹',
                verifiedStatus: 'approved',
                featured: true,
                bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                logoImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
                amenities: ['Air Conditioned Studio Floor', 'Bridal Suite & Changing Room', 'Drone Pilot Certified', 'Same-Day Preview Teaser', 'Client Coffee Lounge', 'Dedicated Parking'],
                equipment: ['Sony Alpha 1 & A7R V', 'Canon EOS R5C', 'DJI Ronin 4D Gimbal', 'Profoto B10X Strobes', 'Carl Zeiss Master Primes'],
                portfolio: [
                    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', title: 'Grand Temple Wedding', category: 'Wedding', featured: true },
                    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', title: 'Sunset Beach Romance', category: 'Pre-Wedding', featured: true },
                    { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', title: 'Silk Saree Puberty Ritual', category: 'Puberty Ceremony', featured: true },
                    { url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80', title: 'Newborn Floral Basket', category: 'Baby', featured: false }
                ]
            },
            {
                name: 'Vogue Canvas Creative Studio',
                ownerId: ownerUser2._id,
                tagline: 'Modern Editorial & Contemporary Portrait Hub',
                description: 'Bengaluru’s premier studio for high-fashion portraits, maternity glow shoots, and artistic couple stories with 8 custom themed indoor sets.',
                city: 'Bengaluru',
                address: '82, 100 Feet Road, Indiranagar, Bengaluru - 560038',
                phone: '+91 99001 55443',
                email: 'info@voguecanvas.in',
                rating: 4.8,
                reviewCount: 36,
                startingPrice: 8500,
                priceRange: '₹₹',
                verifiedStatus: 'approved',
                featured: true,
                bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
                logoImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                amenities: ['8 Themed Indoor Sets', 'Wardrobe & Saree Draping', 'Makeup Artist On-Site', 'Cyclorama Infinity Wall', 'Instant Cloud Proofing'],
                equipment: ['Hasselblad X2D 100C', 'Sony A7 IV', 'Broncolor Lighting Kits', 'Aputure Continuous LED'],
                portfolio: [
                    { url: 'https://images.unsplash.com/photo-1557971370-e7298ee473fb?auto=format&fit=crop&w=800&q=80', title: 'Golden Hour Maternity', category: 'Maternity', featured: true },
                    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', title: 'High Fashion Monochrome', category: 'Portrait', featured: true },
                    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', title: 'Urban Couple Story', category: 'Pre-Wedding', featured: false }
                ]
            },
            {
                name: 'Royal Heritage Studios Mumbai',
                ownerId: ownerUser._id,
                tagline: 'Timeless Luxury & Celebrity Photoshoots',
                description: 'Iconic studio based in Bandra, Mumbai crafting heirloom visual stories, palace weddings, and luxury fine-art family albums.',
                city: 'Mumbai',
                address: '12, Bandstand Promenade, Bandra West, Mumbai - 400050',
                phone: '+91 98200 44332',
                email: 'contact@royalheritage.com',
                rating: 4.9,
                reviewCount: 58,
                startingPrice: 22000,
                priceRange: '₹₹₹₹',
                verifiedStatus: 'approved',
                featured: true,
                bannerImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
                logoImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                amenities: ['VIP Vanity Room', 'Heritage Prop Library', 'Fine Art Velvet Printing', 'Private Valet'],
                equipment: ['Leica SL2', 'Canon R5', 'Elinchrom Digital Strobes'],
                portfolio: [
                    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', title: 'Palace Wedding Reception', category: 'Wedding', featured: true }
                ]
            },
            {
                name: 'BabyShots & Little Wonders',
                ownerId: ownerUser2._id,
                tagline: 'Gentle, Safe & Magical Newborn Photography',
                description: 'Delhi’s most trusted certified newborn and baby milestone photography studio with sanitized climate-controlled sets and sanitized props.',
                city: 'Delhi',
                address: 'C-14, Greater Kailash 1, New Delhi - 110048',
                phone: '+91 98110 77665',
                email: 'care@babyshotsdelhi.com',
                rating: 4.8,
                reviewCount: 29,
                startingPrice: 6500,
                priceRange: '₹₹',
                verifiedStatus: 'approved',
                featured: false,
                bannerImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80',
                logoImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=300&q=80',
                amenities: ['Sanitized Heating System', 'Certified Newborn Handlers', '100+ Designer Knitted Wraps', 'Mother Feeding Room'],
                equipment: ['Sony A7 III', 'Soft Natural Light Modifiers'],
                portfolio: [
                    { url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80', title: 'Cozy Bunny Theme', category: 'Baby', featured: true }
                ]
            }
        ];
        const createdStudios = await Studio_js_1.Studio.insertMany(studiosData);
        console.log(`✅ Created ${createdStudios.length} Photo Studios.`);
        const primaryStudio = createdStudios[0];
        const secondStudio = createdStudios[1];
        // 4. Photoshoot Packages
        const packagesData = [
            {
                studioId: primaryStudio._id,
                categoryId: weddingCat._id,
                title: 'Royal Traditional Wedding Extravaganza',
                slug: 'royal-traditional-wedding',
                description: 'Comprehensive 2-day wedding coverage including Muhurtham, Reception, Candid Moments, and 4K Cinematic Highlights.',
                price: 75000,
                discountPrice: 64999,
                advancePercentage: 20,
                durationHours: 16,
                editedPhotosCount: 150,
                rawPhotosCount: 1200,
                deliverables: [
                    'Handcrafted Velvet Photo Album (40 Pages)',
                    '4K Cinematic Wedding Highlights Teaser (3-5 mins)',
                    'Full-Length Documentary Video (45-60 mins)',
                    'Private Cloud Gallery with 1-Year Access',
                    '2 Framed Archival Canvas Prints (16x24 in)'
                ],
                inclusions: [
                    '2 Traditional Photographers + 2 Candid Specialists',
                    '1 Dedicated Drone Videographer',
                    'Professional Audio Recording Setup',
                    'Same-Day Instagram Reel Edit'
                ],
                exclusions: ['Travel & Stay outside Chennai district'],
                isPopular: true,
                bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
            },
            {
                studioId: primaryStudio._id,
                categoryId: preWedCat._id,
                title: 'Candid Outdoor & Beach Romance',
                slug: 'candid-outdoor-beach-romance',
                description: 'A 4-hour scenic photoshoot along the ECR coastline with sunset golden hour lighting and 3 wardrobe changes.',
                price: 18000,
                discountPrice: 14999,
                advancePercentage: 25,
                durationHours: 4,
                editedPhotosCount: 35,
                rawPhotosCount: 350,
                deliverables: [
                    '35 High-Resolution Retouched Digital Photos',
                    '1 Premium Acrylic Frame (12x18 in)',
                    'Musical Slideshow Video for Invitations',
                    'Full Raw Photo Dump via Cloud Drive'
                ],
                inclusions: ['Portable Strobes & Diffusers', 'Props (Smoke bombs, fairy lights, vintage camera)', 'Up to 3 Wardrobe Changes'],
                exclusions: ['Location entry tickets (resorts/heritage sites)'],
                isPopular: true,
                bannerImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
            },
            {
                studioId: primaryStudio._id,
                categoryId: pubertyCat._id,
                title: 'Manjal Neerattu Vizha Traditional Rituals',
                slug: 'manjal-neerattu-vizha-traditional',
                description: 'Complete auspicious coverage of traditional rituals, floral bath, silk saree makeover, and family blessings.',
                price: 25000,
                discountPrice: 21500,
                advancePercentage: 20,
                durationHours: 6,
                editedPhotosCount: 50,
                rawPhotosCount: 450,
                deliverables: [
                    'Embossed Leatherette Photo Book (30 Pages)',
                    '50 Color Graded Master Prints',
                    'Highlight Video Reel (60 secs)',
                    'USB Gift Box with High-Res Originals'
                ],
                inclusions: ['Traditional + Candid Photographer', 'Stage Lighting Assistance'],
                exclusions: ['Stage floral decor'],
                isPopular: true,
                bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
            },
            {
                studioId: secondStudio._id,
                categoryId: maternityCat._id,
                title: 'Goddess Maternity Indoor & Silk Drapes',
                slug: 'goddess-maternity-indoor-silk',
                description: 'Elegant studio photoshoot with flowing chiffon gowns, artistic silhouettes, and partner participation.',
                price: 12000,
                discountPrice: 9999,
                advancePercentage: 20,
                durationHours: 2,
                editedPhotosCount: 20,
                rawPhotosCount: 150,
                deliverables: [
                    '20 Fine Art Magazine-Edited Photos',
                    '1 Premium Framed Desk Print (8x10 in)',
                    'High-Res Online Gallery'
                ],
                inclusions: ['Access to Studio Wardrobe (Gowns & Drapes)', 'Partner & Sibling Inclusion'],
                exclusions: ['Hair & Makeup (Available as add-on for ₹2,500)'],
                isPopular: true,
                bannerImage: 'https://images.unsplash.com/photo-1557971370-e7298ee473fb?auto=format&fit=crop&w=800&q=80'
            },
            {
                studioId: secondStudio._id,
                categoryId: babyCat._id,
                title: 'Newborn Dreamland & Cake Smash',
                slug: 'newborn-dreamland-cake-smash',
                description: 'Whimsical baby milestone shoot with soft handcrafted wooden props, mini floral tubs, and cake smash fun.',
                price: 15000,
                discountPrice: 12999,
                advancePercentage: 20,
                durationHours: 3,
                editedPhotosCount: 30,
                rawPhotosCount: 200,
                deliverables: [
                    '30 Retouched High-Res Photos',
                    'Hardcover Baby Photo Book (20 Pages)',
                    'Online Digital Cloud Archive'
                ],
                inclusions: ['Sanitized Props, Outfits & Headbands', 'Organic Vanilla Smash Cake Included'],
                exclusions: ['Extended family members beyond parents'],
                isPopular: false,
                bannerImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80'
            }
        ];
        const createdPackages = await Package_js_1.Package.insertMany(packagesData);
        console.log(`✅ Created ${createdPackages.length} Photoshoot Packages.`);
        // 5. Products & Customizer Catalog
        const productsData = [
            {
                title: 'Personalized Solid Teak Wood Frame',
                slug: 'personalized-solid-teak-wood-frame',
                category: 'Frames',
                description: 'Museum-grade natural teak wood photo frame with anti-glare acrylic glass and custom engraved couple names or wedding dates.',
                basePrice: 899,
                discountPrice: 699,
                stock: 45,
                thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
                images: [
                    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
                ],
                customizationOptions: {
                    allowPhoto: true,
                    allowText: true,
                    allowDate: true,
                    allowName: true,
                    frameColors: ['Natural Teak', 'Matte Black', 'Royal Gold', 'Vintage White'],
                    sizes: [
                        { name: 'Standard (8x10 in)', priceOffset: 0, dimensions: '8x10 inches' },
                        { name: 'Medium (12x18 in)', priceOffset: 400, dimensions: '12x18 inches' },
                        { name: 'Large Gallery (16x24 in)', priceOffset: 900, dimensions: '16x24 inches' }
                    ]
                },
                rating: 4.9,
                reviewCount: 28,
                isFeatured: true,
                tags: ['frame', 'custom', 'wood', 'gift', 'anniversary']
            },
            {
                title: 'Magic Color-Changing Ceramic Photo Mug',
                slug: 'magic-color-changing-photo-mug',
                category: 'Mugs',
                description: 'Appears as sleek black ceramic until you pour hot coffee or tea, magically revealing your favorite photo and custom quote!',
                basePrice: 499,
                discountPrice: 349,
                stock: 120,
                thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
                images: [
                    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80'
                ],
                customizationOptions: {
                    allowPhoto: true,
                    allowText: true,
                    allowDate: true,
                    allowName: true,
                    frameColors: ['Classic Magic Black', 'Glossy Heart Red', 'Royal Blue']
                },
                rating: 4.8,
                reviewCount: 64,
                isFeatured: true,
                tags: ['mug', 'magic', 'coffee', 'gift', 'custom']
            },
            {
                title: 'Fine-Art Gallery Canvas Wrap (300 GSM)',
                slug: 'fine-art-gallery-canvas-wrap',
                category: 'Canvas Prints',
                description: 'Cotton blend archival canvas stretched over treated pine wood bars, UV-protected coating with vibrant life-like color reproduction.',
                basePrice: 1499,
                discountPrice: 1199,
                stock: 30,
                thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
                images: [
                    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
                ],
                customizationOptions: {
                    allowPhoto: true,
                    allowText: true,
                    allowDate: false,
                    allowName: true,
                    sizes: [
                        { name: 'Square (12x12 in)', priceOffset: 0, dimensions: '12x12 inches' },
                        { name: 'Landscape (18x24 in)', priceOffset: 650, dimensions: '18x24 inches' },
                        { name: 'Panoramic (20x40 in)', priceOffset: 1500, dimensions: '20x40 inches' }
                    ]
                },
                rating: 4.9,
                reviewCount: 19,
                isFeatured: true,
                tags: ['canvas', 'wallart', 'wedding', 'home decor']
            },
            {
                title: 'Premium Handcrafted Leatherette Photo Album',
                slug: 'premium-leatherette-photo-album',
                category: 'Albums',
                description: 'Lay-flat flush mount album with metallic luster printing, golden corner guards, and personalized gold-foil typography on the cover.',
                basePrice: 3499,
                discountPrice: 2799,
                stock: 18,
                thumbnail: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
                images: [
                    'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80'
                ],
                customizationOptions: {
                    allowPhoto: true,
                    allowText: true,
                    allowDate: true,
                    allowName: true,
                    frameColors: ['Cognac Brown', 'Midnight Black', 'Burgundy Wine', 'Emerald Green']
                },
                rating: 5.0,
                reviewCount: 31,
                isFeatured: true,
                tags: ['album', 'wedding', 'heirloom', 'photobook']
            },
            {
                title: 'Custom Year Calendar with 12 Memories',
                slug: 'custom-year-calendar-2025',
                category: 'Calendars',
                description: '12-month spiral desktop or wall calendar personalized with 12 distinct photos for each month and custom family birthday highlights.',
                basePrice: 699,
                discountPrice: 499,
                stock: 75,
                thumbnail: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80',
                images: [
                    'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80'
                ],
                customizationOptions: {
                    allowPhoto: true,
                    allowText: true,
                    allowDate: true,
                    allowName: true
                },
                rating: 4.7,
                reviewCount: 15,
                isFeatured: false,
                tags: ['calendar', 'new year', 'desk', 'gift']
            },
            {
                title: 'Cozy Velvet Personalized Photo Cushion',
                slug: 'cozy-velvet-photo-cushion',
                category: 'Cushions',
                description: 'Soft Dutch velvet cushion with edge-to-edge vibrant permanent sublimation printing. Comes complete with fluffy microfiber insert.',
                basePrice: 799,
                discountPrice: 599,
                stock: 50,
                thumbnail: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
                images: [
                    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'
                ],
                customizationOptions: {
                    allowPhoto: true,
                    allowText: true,
                    allowDate: false,
                    allowName: true,
                    frameColors: ['Blush Pink', 'Ivory Cream', 'Navy Blue', 'Charcoal Grey']
                },
                rating: 4.8,
                reviewCount: 22,
                isFeatured: false,
                tags: ['cushion', 'pillow', 'gift', 'decor']
            }
        ];
        const createdProducts = await Product_js_1.Product.insertMany(productsData);
        console.log(`✅ Created ${createdProducts.length} E-Commerce Photo Products.`);
        // Create corresponding inventories
        for (const prod of createdProducts) {
            await Inventory_js_1.Inventory.create({
                productId: prod._id,
                sku: `MEM-PRD-${Math.floor(10000 + Math.random() * 90000)}`,
                quantity: prod.stock,
                lowStockThreshold: 10
            });
        }
        // 6. Demo Bookings
        const booking1 = await Booking_js_1.Booking.create({
            bookingId: 'MEM-BKG-1011',
            customerId: customerUser._id,
            studioId: primaryStudio._id,
            packageId: createdPackages[0]._id,
            eventDate: '2025-10-15',
            timeSlot: '06:00 AM - 02:00 PM',
            venue: {
                address: 'Mayor Ramanathan Chettiar Hall, Santhome High Road',
                city: 'Chennai',
                landmark: 'Near Santhome Cathedral',
                pincode: '600028',
                venueType: 'temple_hall'
            },
            totalAmount: 64999,
            advanceAmount: 13000,
            remainingAmount: 51999,
            paymentStatus: 'advance_paid',
            bookingStatus: 'confirmed',
            notes: 'Traditional Tamil Brahmin wedding Muhurtham ceremonies.'
        });
        const booking2 = await Booking_js_1.Booking.create({
            bookingId: 'MEM-BKG-1024',
            customerId: customerUser._id,
            studioId: primaryStudio._id,
            packageId: createdPackages[1]._id,
            eventDate: '2025-09-28',
            timeSlot: '04:00 PM - 07:30 PM',
            venue: {
                address: 'Kovalam Beach Bay Walk & Shore Temple',
                city: 'Chennai',
                landmark: 'ECR Kovalam Junction',
                pincode: '603112',
                venueType: 'outdoor'
            },
            totalAmount: 14999,
            advanceAmount: 3750,
            remainingAmount: 11249,
            paymentStatus: 'advance_paid',
            bookingStatus: 'in_progress',
            notes: 'Sunset beach couple candid shoot.'
        });
        console.log('✅ Created Demo Bookings.');
        // 7. Demo Orders with Visual Stepper Timeline
        const order1 = await Order_js_1.Order.create({
            orderId: 'MEM-ORD-8821',
            customerId: customerUser._id,
            items: [
                {
                    productId: createdProducts[0]._id,
                    title: createdProducts[0].title,
                    category: createdProducts[0].category,
                    thumbnail: createdProducts[0].thumbnail,
                    quantity: 2,
                    price: 699,
                    customization: {
                        uploadedPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                        customText: 'Forever & Always',
                        customName: 'Aarav & Priya',
                        customDate: '15.10.2024',
                        frameColor: 'Natural Teak',
                        size: 'Standard (8x10 in)'
                    },
                    itemTotal: 1398
                },
                {
                    productId: createdProducts[1]._id,
                    title: createdProducts[1].title,
                    category: createdProducts[1].category,
                    thumbnail: createdProducts[1].thumbnail,
                    quantity: 1,
                    price: 349,
                    customization: {
                        uploadedPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                        customText: 'Best Morning Moments',
                        customName: 'Priya R.',
                        frameColor: 'Classic Magic Black'
                    },
                    itemTotal: 349
                }
            ],
            subtotal: 1747,
            discount: 175,
            couponCode: 'WELCOME10',
            tax: 283,
            shippingFee: 0,
            totalAmount: 1572,
            paymentStatus: 'paid',
            paymentMethod: 'razorpay',
            transactionId: 'TXN_RZP_99882211',
            shippingAddress: {
                fullName: 'Priya Ramanathan',
                phone: '+91 98401 23456',
                street: '14, 4th Main Road, Besant Nagar',
                city: 'Chennai',
                state: 'Tamil Nadu',
                pincode: '600090'
            },
            currentStatus: 'PRINTING',
            timeline: [
                { status: 'ORDER_PLACED', title: 'Order Placed', description: 'Order received and logged in system', timestamp: new Date(Date.now() - 4 * 86400000), completed: true, updatedBy: 'System' },
                { status: 'PAYMENT_CONFIRMED', title: 'Payment Confirmed', description: 'Payment verified via Razorpay UPI', timestamp: new Date(Date.now() - 4 * 86400000), completed: true, updatedBy: 'Razorpay Gateway' },
                { status: 'PHOTOS_UPLOADED', title: 'Photos Uploaded', description: 'High-res photos verified for 300 DPI clarity', timestamp: new Date(Date.now() - 3 * 86400000), completed: true, updatedBy: 'Customer' },
                { status: 'EDITING', title: 'Editing & Retouching', description: 'Color grading and text typography alignment done', timestamp: new Date(Date.now() - 2 * 86400000), completed: true, updatedBy: 'Karthik S.' },
                { status: 'PROOF_READY', title: 'Proof Ready for Review', description: 'Digital proof draft v1 sent to customer', timestamp: new Date(Date.now() - 2 * 86400000), completed: true, updatedBy: 'Studio Staff' },
                { status: 'CUSTOMER_APPROVED', title: 'Proof Approved', description: 'Priya approved the custom wood frame mockup', timestamp: new Date(Date.now() - 1 * 86400000), completed: true, updatedBy: 'Priya Ramanathan' },
                { status: 'PRINTING', title: 'Printing & Framing', description: 'Under active archival fine-art printing at lab', timestamp: new Date(), completed: true, updatedBy: 'Print Lab' },
                { status: 'QUALITY_CHECK', title: 'Quality Inspection (QC)', description: 'Pending frame edge & surface inspection', timestamp: new Date(Date.now() + 1 * 86400000), completed: false },
                { status: 'READY', title: 'Ready for Dispatch', description: 'Bubble wrapped with protective corners', timestamp: new Date(Date.now() + 2 * 86400000), completed: false },
                { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', description: 'Assigned to BlueDart express courier', timestamp: new Date(Date.now() + 3 * 86400000), completed: false },
                { status: 'DELIVERED', title: 'Delivered', description: 'Estimated delivery to door', timestamp: new Date(Date.now() + 4 * 86400000), completed: false }
            ],
            trackingNumber: 'BD-88392019',
            courierName: 'BlueDart Air Express',
            estimatedDelivery: '3 Days'
        });
        console.log('✅ Created Demo Orders & Stepper Timelines.');
        // 8. Photo Jobs for Kanban Management
        const job1 = await PhotoJob_js_1.PhotoJob.create({
            jobId: 'MEM-JOB-7701',
            title: 'Grand Temple Wedding - Priya & Aarav',
            bookingId: booking1._id,
            studioId: primaryStudio._id,
            customerId: customerUser._id,
            stage: 'PHOTOS_UPLOADED',
            priority: 'high',
            dueDate: '2025-10-15',
            photos: [
                { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', originalName: 'IMG_001_Rituals.jpg', status: 'selected', uploadedAt: new Date() },
                { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', originalName: 'IMG_002_Garland.jpg', status: 'selected', uploadedAt: new Date() },
                { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', originalName: 'IMG_003_Family_Candid.jpg', status: 'uploaded', uploadedAt: new Date() }
            ],
            assignedEditor: 'Ramesh (Lead Colorist)',
            notes: 'Focus on warm temple golden hues and silk saree texture vibrancy.'
        });
        const job2 = await PhotoJob_js_1.PhotoJob.create({
            jobId: 'MEM-JOB-7702',
            title: 'Custom Wood Frames - Order #MEM-ORD-8821',
            orderId: order1._id,
            studioId: primaryStudio._id,
            customerId: customerUser._id,
            stage: 'PRINTING',
            priority: 'medium',
            proofVersion: 1,
            latestProofUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
            customerApprovalStatus: 'approved',
            qcChecklist: [
                { item: 'Color grading & skin tone natural check', checked: true },
                { item: 'Resolution 300 DPI verified', checked: true },
                { item: 'No cropping / bleed margins cut off', checked: true },
                { item: 'Physical print / frame defect check', checked: false },
                { item: 'Secure packaging & invoice attached', checked: false }
            ]
        });
        const job3 = await PhotoJob_js_1.PhotoJob.create({
            jobId: 'MEM-JOB-7703',
            title: 'Baby Milestone Portrait Shoot',
            studioId: primaryStudio._id,
            customerId: customerUser._id,
            stage: 'PROOF_READY',
            priority: 'medium',
            proofVersion: 1,
            latestProofUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
            customerApprovalStatus: 'pending'
        });
        const job4 = await PhotoJob_js_1.PhotoJob.create({
            jobId: 'MEM-JOB-7704',
            title: 'Fine Art Velvet Canvas - Pre Wedding',
            studioId: primaryStudio._id,
            customerId: customerUser._id,
            stage: 'READY',
            priority: 'low'
        });
        console.log('✅ Created Demo Kanban Photo Jobs.');
        // 9. Proofs
        await Proof_js_1.Proof.create({
            proofId: 'MEM-PRF-9021',
            photoJobId: job2._id,
            studioId: primaryStudio._id,
            customerId: customerUser._id,
            version: 1,
            title: 'Teak Frame Custom Typography Mockup v1',
            previewUrls: [
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
            ],
            status: 'approved',
            customerFeedback: 'Looks absolutely stunning! The font style and date placement are perfect.',
            approvedAt: new Date()
        });
        await Proof_js_1.Proof.create({
            proofId: 'MEM-PRF-9022',
            photoJobId: job3._id,
            studioId: primaryStudio._id,
            customerId: customerUser._id,
            version: 1,
            title: 'Baby Milestone Draft Color Grades v1',
            previewUrls: [
                'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80'
            ],
            status: 'pending_review'
        });
        console.log('✅ Created Demo Proofs.');
        // 10. Coupons
        const couponsData = [
            {
                code: 'WELCOME10',
                description: '10% Flat Discount on your first order or studio booking',
                discountPercent: 10,
                minOrderAmount: 499,
                maxDiscountAmount: 2000,
                validTill: new Date(Date.now() + 180 * 86400000),
                isActive: true
            },
            {
                code: 'MEMORA500',
                description: 'Flat ₹500 OFF on orders above ₹2,500',
                flatDiscount: 500,
                minOrderAmount: 2500,
                maxDiscountAmount: 500,
                validTill: new Date(Date.now() + 180 * 86400000),
                isActive: true
            },
            {
                code: 'FESTIVE20',
                description: 'Grand 20% Festive Savings for Wedding & Family bookings',
                discountPercent: 20,
                minOrderAmount: 10000,
                maxDiscountAmount: 10000,
                validTill: new Date(Date.now() + 90 * 86400000),
                isActive: true
            }
        ];
        await Coupon_js_1.Coupon.insertMany(couponsData);
        console.log('✅ Created Demo Promo Coupons.');
        // 11. Reviews
        await Review_js_1.Review.create({
            targetType: 'studio',
            targetId: primaryStudio._id,
            userId: customerUser._id,
            rating: 5,
            title: 'Breathtaking Wedding Captures & Punctual Crew!',
            comment: 'Karthik and his entire Lumière team were extraordinarily courteous, patient with our elders during rituals, and delivered the teaser reel within 24 hours. The photo album quality is unmatched!',
            photos: [
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
            ],
            studioReply: {
                comment: 'Thank you so much Priya & Aarav! It was an absolute delight documenting your grand wedding.',
                repliedAt: new Date()
            },
            isApproved: true,
            helpfulCount: 14
        });
        await Review_js_1.Review.create({
            targetType: 'product',
            targetId: createdProducts[0]._id,
            userId: customerUser._id,
            rating: 5,
            title: 'Top Tier Wood Frame Finish',
            comment: 'The solid teak wood finish is genuine and heavy. The custom names engraved on the bottom give it a bespoke museum feel. Ordered 2 more for my parents!',
            photos: [
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
            ],
            isApproved: true,
            helpfulCount: 8
        });
        console.log('✅ Created Demo Reviews.');
        // 12. Notifications
        await Notification_js_1.Notification.create({
            userId: customerUser._id,
            title: 'Order Status: Printing 🖨️',
            message: 'Your custom Wood Photo Frames are currently being printed with archival inks at the lab.',
            type: 'order',
            link: `/orders/${order1._id}`
        });
        await Notification_js_1.Notification.create({
            userId: customerUser._id,
            title: 'Proof Ready for Review! 🎨',
            message: 'Lumière Studio uploaded draft proof for your Baby Milestone shoot. Check and approve!',
            type: 'proof',
            link: '/proofs'
        });
        console.log('✅ Created Demo Notifications.');
        console.log('🎉 MEMORA Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error during seed:', error);
    }
    finally {
        await (0, db_js_1.disconnectDB)();
    }
};
exports.seedDatabase = seedDatabase;
// If run directly via tsx
if (process.argv[1]?.includes('seed.ts')) {
    (0, exports.seedDatabase)().then(() => {
        process.exit(0);
    });
}
