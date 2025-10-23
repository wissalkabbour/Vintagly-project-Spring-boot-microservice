import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-white border-t border-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-[#016B61] transition-colors">
              Support
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-[#016B61] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-[#016B61] transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-sm text-gray-600">
            © 2025 Vintagly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}