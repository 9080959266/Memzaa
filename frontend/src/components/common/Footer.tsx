import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, ShieldCheck, Truck, Sparkles, MapPin, Phone, Mail, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm mt-20">
      {/* Features Value Prop Bar */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Verified Studios</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">100% vetted professional photographers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Digital Proof Approvals</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Review and approve before final printing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Pan-India Express Delivery</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Safely bubble-wrapped fine-art gifts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Best Price & Quality</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">300 DPI archival grade printing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-extrabold text-white tracking-tight">
                MEM<span className="text-amber-500">ORA</span>
              </span>
            </Link>
            <p className="text-xs text-amber-400/90 font-medium tracking-wide uppercase mt-2">
              "Capture Moments. Create Memories."
            </p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-sm">
              India’s unified photography marketplace connecting customers with premier studios for weddings, rituals, portraits, and customizable keepsake photo products.
            </p>

            <div className="flex items-center gap-4 mt-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Chennai • Bengaluru • Mumbai • Delhi</span>
              </div>
            </div>
          </div>

          {/* Photoshoot Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Photoshoot Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/studios?category=wedding" className="hover:text-amber-400 transition">Wedding Photography</Link></li>
              <li><Link to="/studios?category=pre-wedding" className="hover:text-amber-400 transition">Pre-Wedding & Couple</Link></li>
              <li><Link to="/studios?category=puberty-ceremony" className="hover:text-amber-400 transition">Puberty Ceremony (Manjal Neerattu)</Link></li>
              <li><Link to="/studios?category=baby" className="hover:text-amber-400 transition">Newborn & Baby Shots</Link></li>
              <li><Link to="/studios?category=maternity" className="hover:text-amber-400 transition">Maternity Shoots</Link></li>
              <li><Link to="/studios?category=portrait" className="hover:text-amber-400 transition">Fashion & Corporate Portrait</Link></li>
            </ul>
          </div>

          {/* Photo Store */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Photo Store & Gifts</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Frames" className="hover:text-amber-400 transition">Solid Teak Wood Frames</Link></li>
              <li><Link to="/products?category=Mugs" className="hover:text-amber-400 transition">Magic Photo Mugs</Link></li>
              <li><Link to="/products?category=Canvas%20Prints" className="hover:text-amber-400 transition">Fine Art Canvas Wraps</Link></li>
              <li><Link to="/products?category=Albums" className="hover:text-amber-400 transition">Flush Mount Photo Albums</Link></li>
              <li><Link to="/products?category=Calendars" className="hover:text-amber-400 transition">Customized 2025 Calendars</Link></li>
              <li><Link to="/products?category=Cushions" className="hover:text-amber-400 transition">Personalized Velvet Cushions</Link></li>
            </ul>
          </div>

          {/* Partner & Support */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">For Studios & Help</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/register?role=shop_owner" className="hover:text-amber-400 transition text-amber-400 font-semibold">Join as Studio Partner</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-amber-400 transition">Studio Seller Dashboard</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-amber-400 transition">Platform Admin Portal</Link></li>
              <li><Link to="/orders" className="hover:text-amber-400 transition">Track Your Order Status</Link></li>
              <li><Link to="/proofs" className="hover:text-amber-400 transition">Approve Digital Proofs</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MEMORA Experiences Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Currency: <strong className="text-slate-200">INR (₹)</strong></span>
            <span>Razorpay / UPI Secure Payment Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
