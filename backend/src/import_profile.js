/**
 * Profile Importer Script
 * Converts Vihanga's JSON profile into logical semantic text chunks,
 * generates Gemini text-embedding-004 vectors, and upserts them into Pinecone.
 * Run once: node src/import_profile.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone } = require('@pinecone-database/pinecone');
const { v4: uuidv4 } = require('uuid');

// ─── Profile Data ──────────────────────────────────────────────────────────────
const profile = {
  "fullName": "Vihanga Kulathilake",
  "title": "Software Engineering Undergraduate",
  "summary": "Motivated and detail-oriented BSc (Hons) Software Engineering undergraduate at the University of Kelaniya with strong interests in software development, artificial intelligence, machine learning, and scalable software systems.",
  "contact": {
    "email": "kulathi-se22037@stu.kln.ac.lk",
    "phone": "+94 71 851 9445",
    "address": "164, Thibbatugoda, Ganemulla, Sri Lanka",
    "portfolio": "https://vihangakulathilake.dev",
    "linkedin": "VihangaKulathilake",
    "github": "VihangaKulathilake"
  },
  "education": {
    "university": {
      "name": "University of Kelaniya",
      "degree": "BSc (Hons) in Software Engineering",
      "status": "Undergraduate",
      "startYear": 2024,
      "currentGPA": 3.8259,
      "specializations": ["Net Centric Web Application","Data Science and Engineering","Health Informatics"]
    },
    "school": {
      "name": "Ananda College",
      "location": "Colombo 10",
      "period": "2009-2022",
      "advancedLevel": { "stream": "Physical Science", "results": "ABB", "zScore": 1.6118 }
    }
  },
  "experience": [
    { "organization": "Sawiya Organization", "position": "Full-stack Developer", "startYear": 2025, "current": true }
  ],
  "projects": [
    { "name": "DevGuardian", "type": "Individual", "status": "Ongoing", "description": "AI-powered software quality and security intelligence platform for repository analysis, security checks, code quality evaluation, architecture insights, and AI-driven recommendations.", "technologies": ["Next.js","TypeScript","Tailwind CSS","Spring Boot","Java","PostgreSQL","Redis","RabbitMQ","JWT","Docker","FastAPI","Redux Toolkit"] },
    { "name": "StayMate", "type": "Individual", "description": "Intelligent boarding marketplace with machine learning recommendations and location-based search.", "technologies": ["React","Tailwind CSS","Node.js","Express.js","MongoDB","FastAPI","Machine Learning","AWS S3"] },
    { "name": "Bookfair Stall Reservation System", "description": "Full-stack web application for stall booking, payments, QR confirmations, and administrative management.", "technologies": ["React","Spring Boot","Material UI","Java","MySQL","PayPal SDK"] },
    { "name": "TEDx-UoK Platform", "type": "Group", "description": "Official event platform with responsive design, dynamic content management, and SEO optimization.", "technologies": ["React","TypeScript","Vite","Tailwind CSS","Supabase"] }
  ],
  "skills": {
    "programmingLanguages": ["Java","Python","JavaScript","PHP","C","HTML","CSS"],
    "frameworks": ["Spring Boot","React","Next.js","Node.js","Express.js","FastAPI","Flutter","MERN Stack"],
    "databases": ["MySQL","PostgreSQL","MongoDB","Redis","Supabase"],
    "cloudAndServices": ["AWS","Cloudinary"],
    "tools": ["GitHub","GitLab","Postman","Jira","Figma","Adobe Photoshop","Canva","Anaconda","Jupyter Notebook","Google Colab","Kaggle","Power BI"]
  },
  "competencies": ["Software Development","Full-stack Web Development","Machine Learning","Deep Learning","Database Management","Data Structures and Algorithms","Mobile Application Development","Problem Solving","Communication","Teamwork"],
  "leadership": [
    { "organization": "Software Engineering Students' Association", "role": "Executive Committee Member", "period": "2024-2025" },
    { "organization": "IEEE Student Branch University of Kelaniya", "role": "Member", "period": "2024-2025" },
    { "organization": "IEEE Student Branch University of Kelaniya", "role": "Head of Industry Relations and Industrial Engagement", "period": "2025-Present" },
    { "organization": "IEEE Young Professionals Sri Lanka", "role": "Project Coordinator - LETs Talk", "period": "2026-Present" },
    { "organization": "IEEE Day Celebration", "role": "University Ambassador", "period": "2025" },
    { "organization": "Rotaract Club University of Kelaniya", "role": "Member", "period": "2024-2025" },
    { "organization": "Project EvolveX", "role": "PR Coordinator", "period": "2025" }
  ],
  "achievements": [
    { "title": "Junior Hackathon 2025", "award": "1st Runners-Up" }
  ],
  "languages": ["Sinhala","English"],
  "careerGoals": ["Become a highly skilled software engineer","Build AI-powered software products","Contribute to software quality and security research","Develop scalable and innovative technology solutions"]
};

// ─── Build Logical Text Chunks ─────────────────────────────────────────────────
function buildChunks(p) {
  const chunks = [];

  // 1. Identity & Summary
  chunks.push({
    id: 'profile-identity',
    text: `Student Profile: ${p.fullName}
Title: ${p.title}
Summary: ${p.summary}
Languages spoken: ${p.languages.join(', ')}`
  });

  // 2. Contact Information
  const c = p.contact;
  chunks.push({
    id: 'profile-contact',
    text: `Contact Information for ${p.fullName}:
Email: ${c.email}
Phone: ${c.phone}
Address: ${c.address}
Portfolio: ${c.portfolio}
LinkedIn: linkedin.com/in/${c.linkedin}
GitHub: github.com/${c.github}`
  });

  // 3. University Education
  const uni = p.education.university;
  chunks.push({
    id: 'profile-education-university',
    text: `University Education:
University: ${uni.name}
Degree: ${uni.degree}
Status: ${uni.status} (started ${uni.startYear})
Current GPA: ${uni.currentGPA}
Specializations: ${uni.specializations.join(', ')}`
  });

  // 4. School Education
  const sc = p.education.school;
  chunks.push({
    id: 'profile-education-school',
    text: `School Education:
School: ${sc.name}, ${sc.location}
Period: ${sc.period}
Advanced Level Stream: ${sc.advancedLevel.stream}
A/L Results: ${sc.advancedLevel.results}
Z-Score: ${sc.advancedLevel.zScore}`
  });

  // 5. Work Experience
  const exp = p.experience.map(e =>
    `${e.position} at ${e.organization} (${e.startYear}${e.current ? ' – Present' : ''})`
  ).join('\n');
  chunks.push({
    id: 'profile-experience',
    text: `Work Experience for ${p.fullName}:\n${exp}`
  });

  // 6. Individual chunk per project
  p.projects.forEach((proj, i) => {
    chunks.push({
      id: `profile-project-${i}`,
      text: `Project: ${proj.name}
Type: ${proj.type || 'Individual'}
Status: ${proj.status || 'Completed'}
Description: ${proj.description}
Technologies used: ${proj.technologies.join(', ')}`
    });
  });

  // 7. Technical Skills
  const sk = p.skills;
  chunks.push({
    id: 'profile-skills',
    text: `Technical Skills of ${p.fullName}:
Programming Languages: ${sk.programmingLanguages.join(', ')}
Frameworks & Libraries: ${sk.frameworks.join(', ')}
Databases: ${sk.databases.join(', ')}
Cloud & Services: ${sk.cloudAndServices.join(', ')}
Tools: ${sk.tools.join(', ')}
Core Competencies: ${p.competencies.join(', ')}`
  });

  // 8. Leadership & Extracurricular
  const leadershipLines = p.leadership.map(l =>
    `${l.role} at ${l.organization} (${l.period})`
  ).join('\n');
  chunks.push({
    id: 'profile-leadership',
    text: `Leadership & Extracurricular Activities of ${p.fullName}:\n${leadershipLines}`
  });

  // 9. Achievements & Career Goals
  const achievementLines = p.achievements.map(a => `${a.title}: ${a.award}`).join('\n');
  chunks.push({
    id: 'profile-goals-achievements',
    text: `Achievements:
${achievementLines}

Career Goals:
${p.careerGoals.map(g => `- ${g}`).join('\n')}`
  });

  return chunks;
}

// ─── Embedding & Pinecone Upsert ──────────────────────────────────────────────
const https = require('https');

function generateEmbedding(text, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ content: { parts: [{ text: text.trim() }] } });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.embedding && json.embedding.values) resolve(json.embedding.values);
        else reject(new Error(`Embedding API error: ${JSON.stringify(json).slice(0, 200)}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function importProfile() {
  const apiKey = process.env.GEMINI_API_KEY;
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index(process.env.PINECONE_INDEX || 'ai-assist');

  const chunks = buildChunks(profile);
  console.log(`\nBuilt ${chunks.length} semantic chunks from profile. Starting upsert to Pinecone...\n`);

  const vectors = [];

  for (const chunk of chunks) {
    process.stdout.write(`  ↳ Embedding "${chunk.id}"...`);
    const values = await generateEmbedding(chunk.text, apiKey);

    vectors.push({
      id: chunk.id,
      values,
      metadata: {
        text: chunk.text,
        source: 'student-profile',
        studentName: profile.fullName,
      },
    });

    console.log(` ✓ (${values.length} dims)`);
  }

  console.log('\nUpserting all vectors into Pinecone...');
  await index.upsert(vectors);

  console.log(`\n✅  SUCCESS! ${vectors.length} profile chunks have been indexed in Pinecone index: "${process.env.PINECONE_INDEX || 'ai-assist'}"`);
  console.log('Dr. Amelia can now answer questions about your academic profile!\n');
}

importProfile().catch(err => {
  console.error('\n❌ Import failed:', err.message);
  process.exit(1);
});
