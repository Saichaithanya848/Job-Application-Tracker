require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

const seedData = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job_tracker';
  console.log(`🌱 Connecting to MongoDB: ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error(`❌ Could not connect to MongoDB at ${mongoUri}`);
    console.error(`   Details: ${err.message}`);
    console.error('\n💡 Mentor Tip:');
    console.error('   1. If running locally, make sure MongoDB is started (e.g. net start MongoDB or mongod)');
    console.error('   2. Or create a free MongoDB Atlas cluster and set MONGODB_URI in backend/.env:');
    console.error('      MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/job_tracker\n');
    process.exit(1);
  }

  try {
    console.log('🧹 Clearing existing demo user and jobs...');
    const demoEmail = 'alex.dev@example.com';
    const existingUser = await User.findOne({ email: demoEmail });

    if (existingUser) {
      await Job.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('   Removed previous demo user records.');
    }

    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Developer',
      email: demoEmail,
      password: 'password123',
    });

    console.log(`   Created user: ${demoUser.email} (Password: password123)`);

    console.log('💼 Seeding realistic job applications...');
    const today = new Date();
    const daysAgo = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    const sampleJobs = [
      {
        user: demoUser._id,
        company: 'Stripe',
        jobTitle: 'Software Engineer Intern - Infrastructure',
        jobType: 'Internship',
        location: 'Remote',
        status: 'Offer',
        applicationDate: daysAgo(28),
        jobDescription: 'Building resilient payment APIs, latency optimization, and developer tooling in Go and Ruby.',
        jobUrl: 'https://stripe.com/jobs',
        notes: 'Received official offer letter! Compensation: $55/hr + housing stipend. Need to respond by Friday.',
      },
      {
        user: demoUser._id,
        company: 'Google',
        jobTitle: 'Associate Software Engineer (STEP / Early Career)',
        jobType: 'Full-time',
        location: 'Mountain View, CA (Hybrid)',
        status: 'Interview',
        applicationDate: daysAgo(18),
        jobDescription: 'Work across Search, Cloud, and Android systems. Requires strong data structures and algorithms.',
        jobUrl: 'https://careers.google.com/jobs',
        notes: 'Passed technical screen (Graphs & Dynamic Programming). Next round: 2 back-to-back virtual onsite interviews.',
      },
      {
        user: demoUser._id,
        company: 'Spotify',
        jobTitle: 'Junior Web Developer',
        jobType: 'Full-time',
        location: 'New York, NY (Hybrid)',
        status: 'Interview',
        applicationDate: daysAgo(12),
        jobDescription: 'Developing React-based client experiences for millions of music and podcast creators.',
        jobUrl: 'https://www.lifeatspotify.com/jobs',
        notes: 'Recruiter phone screen went great. System design & React state management round scheduled for next Tuesday.',
      },
      {
        user: demoUser._id,
        company: 'Datadog',
        jobTitle: 'Backend Software Engineer',
        jobType: 'Full-time',
        location: 'Boston, MA (Hybrid)',
        status: 'Assessment',
        applicationDate: daysAgo(7),
        jobDescription: 'High-throughput time-series metrics ingestion and alerting engines in Go and Python.',
        jobUrl: 'https://www.datadoghq.com/careers',
        notes: 'Received 90-minute HackerRank coding challenge. Focus on concurrency and sliding-window algorithms.',
      },
      {
        user: demoUser._id,
        company: 'Airbnb',
        jobTitle: 'Frontend Engineer Intern',
        jobType: 'Internship',
        location: 'San Francisco, CA (Remote)',
        status: 'Applied',
        applicationDate: daysAgo(4),
        jobDescription: 'Create delightful booking and guest checkout flows with React and TypeScript.',
        jobUrl: 'https://careers.airbnb.com',
        notes: 'Applied through college career portal referral. Follow up with college recruiter in 1 week.',
      },
      {
        user: demoUser._id,
        company: 'Amazon',
        jobTitle: 'SDE I - AWS CloudWatch',
        jobType: 'Full-time',
        location: 'Seattle, WA',
        status: 'Applied',
        applicationDate: daysAgo(2),
        jobDescription: 'Building cloud monitoring, alarms, and distributed metric tracking systems at scale.',
        jobUrl: 'https://amazon.jobs',
        notes: 'Completed OA1 (Online Assessment: Debugging and Coding). Awaiting response for OA2.',
      },
      {
        user: demoUser._id,
        company: 'Netflix',
        jobTitle: 'Software Engineering Contractor',
        jobType: 'Contract',
        location: 'Los Gatos, CA (Remote)',
        status: 'Rejected',
        applicationDate: daysAgo(35),
        jobDescription: 'Internal tooling for video asset encoding pipeline and telemetry.',
        jobUrl: 'https://jobs.netflix.com',
        notes: 'Received polite rejection email after phone screen. Feedback: looking for someone with 3+ years in video encoding.',
      },
      {
        user: demoUser._id,
        company: 'Notion',
        jobTitle: 'Full-Stack Developer Intern',
        jobType: 'Internship',
        location: 'San Francisco, CA',
        status: 'Assessment',
        applicationDate: daysAgo(9),
        jobDescription: 'Crafting collaborative document editing primitives and SQLite/IndexedDB syncing.',
        jobUrl: 'https://www.notion.so/careers',
        notes: 'Take-home assignment sent. Must implement a rich text collaborative checklist component in 48 hours.',
      },
    ];

    await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully seeded ${sampleJobs.length} job applications!`);

    console.log('\n=============================================');
    console.log('🎉 Seed Completed Successfully!');
    console.log('You can now log in using these demo credentials:');
    console.log(`Email:    ${demoEmail}`);
    console.log('Password: password123');
    console.log('=============================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedData();
