const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'about', title: 'About Us' },
  { name: 'contact', title: 'Contact Us' },
  { name: 'careers', title: 'Careers' },
  { name: 'bulk-orders', title: 'Bulk Orders & Colleges' },
  { name: 'tutorials', title: 'STEM Tutorials' },
  { name: 'privacy', title: 'Privacy Policy' },
  { name: 'terms', title: 'Terms & Conditions' },
  { name: 'shipping', title: 'Shipping Policy' },
  { name: 'returns', title: 'Return & Refund Policy' },
  { name: 'warranty', title: 'Warranty Information' }
];

const basePath = './apps/frontend/app';

pages.forEach(page => {
  const dirPath = path.join(basePath, page.name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '${page.title} | DSIB Tech',
  description: '${page.title} for DSIB Tech',
};

export default function ${page.name.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">${page.title}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        We are currently updating our ${page.title} page with the latest information. 
        Please check back soon.
      </p>
      
      <div className="p-8 rounded-xl bg-card border shadow-sm max-w-xl w-full text-left mb-8">
        <h2 className="text-xl font-semibold mb-4 text-accent">Need immediate assistance?</h2>
        <p className="text-muted-foreground mb-4">
          Our support team is available to answer any questions you might have regarding our policies or services.
        </p>
        <ul className="space-y-2 text-sm">
          <li><strong className="text-foreground">Email:</strong> support@dsibtech.com</li>
          <li><strong className="text-foreground">Phone:</strong> +1 (800) 123-4567</li>
        </ul>
      </div>

      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log("Pages created.");
