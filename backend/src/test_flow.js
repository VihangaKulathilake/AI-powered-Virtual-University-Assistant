const http = require('http');
require('dotenv').config({ path: 'd:/AI-powered-Virtual-University-Assistant/backend/.env' });

const BASE = 'localhost';
const PORT = 5000;

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      ...headers
    };
    const options = { hostname: BASE, port: PORT, path, method, headers: reqHeaders };
    const req = http.request(options, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testFlow() {
  const timestamp = Date.now();
  const testEmail = `student_${timestamp}@kln.ac.lk`;
  
  console.log(`1. Registering test student: ${testEmail}`);
  const regRes = await request('POST', '/api/auth/register', {}, {
    name: 'Vihanga Kulathilake',
    email: testEmail,
    password: 'password123'
  });
  console.log('Registration status:', regRes.status, JSON.stringify(regRes.body));
  if (regRes.status !== 201) throw new Error('Registration failed');

  console.log('2. Logging in...');
  const loginRes = await request('POST', '/api/auth/login', {}, {
    email: testEmail,
    password: 'password123'
  });
  console.log('Login status:', loginRes.status);
  if (loginRes.status !== 200) throw new Error('Login failed');
  
  const token = loginRes.body.data.token;
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  console.log('3. Creating a new chat session...');
  const chatRes = await request('POST', '/api/chats', authHeaders, { title: 'Test GPA Chat' });
  console.log('Chat session created:', chatRes.status, JSON.stringify(chatRes.body));
  if (chatRes.status !== 201) throw new Error('Chat creation failed');

  const chatId = chatRes.body.data._id || chatRes.body.data.id;
  console.log('Chat session ID:', chatId);

  console.log('4. Sending message: "What is my GPA according to my profile?"');
  const msgRes = await request('POST', `/api/chats/${chatId}/messages`, authHeaders, {
    content: 'What is my GPA according to my profile?'
  });
  console.log('Send message response status:', msgRes.status, JSON.stringify(msgRes.body));
  if (msgRes.status !== 201) throw new Error('Send message failed');

  console.log('5. Waiting 5 seconds for Gemini & Pinecone retrieval process...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('6. Retrieving message history to check AI response...');
  const histRes = await request('GET', `/api/chats/${chatId}/messages`, authHeaders);
  console.log('History status:', histRes.status);
  console.log('Conversation History:');
  if (histRes.body && histRes.body.data) {
    histRes.body.data.forEach(msg => {
      console.log(`[${msg.role}]: ${msg.content}`);
    });
  } else {
    console.log(JSON.stringify(histRes.body));
  }
}

testFlow().catch(e => console.error('Flow Test FAILED:', e));
