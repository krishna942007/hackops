require('dotenv').config();
const https = require('https');

const key = process.env.OPENROUTER_API_KEY;

const req = https.request({
  hostname: 'openrouter.ai',
  path: '/api/v1/models',
  method: 'GET',
  headers: { 'Authorization': `Bearer ${key}` },
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const free = json.data.filter(m => m.id.includes(':free'));
    console.log('FREE MODELS AVAILABLE:');
    free.forEach(m => console.log('-', m.id));
  });
});
req.on('error', e => console.log('ERROR:', e.message));
req.end();