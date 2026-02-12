#!/usr/bin/env node
/**
 * Fetch selected images from Pexels and save to assets/images
 * Usage: PEXELS_API_KEY=your_key node scripts/fetch-pexels.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.PEXELS_API_KEY;
if(!API_KEY){
  console.error('Missing PEXELS_API_KEY environment variable.');
  process.exit(1);
}

const queries = [
  {q: 'tea farm kenya', file: 'pexels-hero.jpg', size: '1600x900'},
  {q: 'irrigation farm', file: 'pexels-irrigation.jpg', size: '1200x800'},
  {q: 'healthcare clinic kenya', file: 'pexels-healthcare.jpg', size: '1200x800'},
  {q: 'road construction kenya', file: 'pexels-roads.jpg', size: '1200x800'},
  {q: 'youth training kenya', file: 'pexels-youth.jpg', size: '1200x800'}
];

const outDir = path.join(__dirname, '..', 'assets', 'images');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});

function fetchJSON(url, headers){
  return new Promise((resolve, reject)=>{
    const req = https.get(url, {headers}, res=>{
      let data=''; res.on('data',c=>data+=c); res.on('end',()=>resolve(JSON.parse(data)));
    });
    req.on('error',reject);
  });
}

function download(url, dest){
  return new Promise((resolve,reject)=>{
    const file = fs.createWriteStream(dest);
    https.get(url,res=>{
      res.pipe(file);
      file.on('finish',()=>file.close(resolve));
    }).on('error',err=>{ fs.unlink(dest,()=>{}); reject(err); });
  });
}

async function run(){
  console.log('Searching Pexels and downloading images...');
  for(const item of queries){
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(item.q)}&per_page=1`;
    try{
      const json = await fetchJSON(url, {Authorization: API_KEY});
      const photo = json.photos && json.photos[0];
      if(photo && photo.src){
        // prefer larger sizes if available
        const src = photo.src.large || photo.src.original || Object.values(photo.src)[0];
        const dest = path.join(outDir, item.file);
        console.log('Downloading', item.q, '→', item.file);
        await download(src, dest);
        console.log('Saved', dest);
      } else {
        console.warn('No photo found for', item.q);
      }
    }catch(e){
      console.error('Failed for', item.q, e.message || e);
    }
  }
  console.log('Done.');
}

run();
