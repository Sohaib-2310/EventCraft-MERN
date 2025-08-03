import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">
              Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Craft</span>
            </h3>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Creating extraordinary events that leave lasting memories. From intimate gatherings 
              to grand celebrations, we bring your vision to life with precision and creativity.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Let's plan your happy moments</span>
              <Heart size={16} className="text-red-500 fill-current" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {['services', 'deals', 'gallery', 'contact'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollTo(section)}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-2 text-slate-300">
              <p>St# 07, Bhassar Pura</p>
              <p>Kasur, Punjab, Pakistan</p>
              <p className="mt-3">
                <a href="tel:+923114413304" className="hover:text-white transition-colors">
                  +92-311-4413304
                </a>
              </p>
              <p>
                <a href="mailto:muhammadsohaib8008@gmail.com" className="hover:text-white transition-colors">
                  muhammadsohaib8008@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-400">
            © 2025 EventCraft. All rights reserved. | Crafting memories, one event at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
