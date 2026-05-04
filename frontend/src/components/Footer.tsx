import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const FOOTER_LINKS: { title: string; links: { name: string; to: string; external?: boolean }[] }[] = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', to: '/products' },
      { name: 'Categories', to: '/categories' },
      { name: 'Bulk Orders', to: '/wholesale' },
      { name: 'Compare', to: '/compare' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'My Profile', to: '/profile' },
      { name: 'My Orders', to: '/orders' },
      { name: 'Wishlist', to: '/wishlist' },
      { name: 'Track Order', to: '/order-lookup' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'WhatsApp Support', to: 'https://wa.me/9867008801', external: true },
      { name: 'Email Us', to: 'mailto:hello@akshar-ecommerce.in', external: true },
      { name: 'Sign In', to: '/login' },
      { name: 'Create Account', to: '/register' },
    ],
  },
];

const TRUST_BADGES = [
  { icon: Truck, label: 'Free shipping over ₹500' },
  { icon: ShieldCheck, label: '100% authentic & homemade' },
  { icon: RefreshCw, label: '7-day easy returns' },
  { icon: Sparkles, label: 'Made fresh in small batches' },
];

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 bg-primary-900 text-slate-200">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container-page py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-600/20 text-secondary-300">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-slate-100">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page py-14 grid gap-10 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4 space-y-5">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-primary-900 font-display font-bold text-xl">
              A
            </span>
            <span className="font-display text-xl font-bold text-white">Akshar E-Commerce</span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
            Authentic homemade Indian flavours — papads, pickles, masalas, mukhwas, namkeen and mithai —
            crafted in small batches and delivered fresh to your door.
          </p>
          <div className="space-y-2 text-sm">
            <a href="https://wa.me/9867008801" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-secondary-400 transition-colors">
              <Phone className="h-4 w-4 text-secondary-400" />
              +91 98670 08801
            </a>
            <a href="mailto:hello@akshar-ecommerce.in" className="flex items-center gap-3 hover:text-secondary-400 transition-colors">
              <Mail className="h-4 w-4 text-secondary-400" />
              hello@akshar-ecommerce.in
            </a>
            <div className="flex items-start gap-3 text-slate-300">
              <MapPin className="h-4 w-4 mt-0.5 text-secondary-400 shrink-0" />
              <span>Mumbai, Maharashtra · India</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-secondary-600 transition-colors"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-secondary-600 transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-300 mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.name}>
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ) : (
                    <li key={link.name}>
                      <Link to={link.to} className="text-sm text-slate-300 hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-300 mb-4">Stay in the loop</h3>
          <p className="text-sm text-slate-300 mb-4">
            Subscribe for new flavours, festive specials and recipes — straight from our kitchen.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
            <button type="submit" className="btn-secondary btn-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Akshar E-Commerce. All rights reserved.</p>
          <p>
            Crafted with <span className="text-secondary-400">♥</span> for India's homemade kitchens.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
