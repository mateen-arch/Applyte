import React from "react";
import { Rocket, Twitter, Linkedin, Github, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black text-white border-t border-neutral-800">
      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-neutral-800 rounded-lg border border-neutral-700">
                <Rocket className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                APPLYTE
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              AI-powered job search platform that helps you land your dream job faster with personalized resumes, 
              cover letters, and job matching.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:border-neutral-600 transition-colors">
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:border-neutral-600 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:border-neutral-600 transition-colors">
                <Github className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:border-neutral-600 transition-colors">
                <Mail className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Partners</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-neutral-800 pt-12 mb-12">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-4 text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-6">
              Get the latest job search tips and product updates delivered to your inbox.
            </p>
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
              />
              <button className="flex items-center gap-2 bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2024 APPLYTE. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;