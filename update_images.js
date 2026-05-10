const fs = require('fs'); 
const path = './apps/frontend/src/lib/mockData.ts'; 
let content = fs.readFileSync(path, 'utf8'); 
const images = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=600&auto=format&fit=crop'
]; 
let i = 0; 
content = content.replace(/imageUrl:\s*\"\"/g, () => `imageUrl: "${images[i++ % images.length]}"`); 
fs.writeFileSync(path, content);
console.log("Replaced");
