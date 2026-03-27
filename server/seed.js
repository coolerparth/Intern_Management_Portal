const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUsers = async () => {
  await mongoose.connect('mongodb://localhost:27017/Intern_DB');
  console.log('Connected to DB');

  const hashed = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'Admin User', email: 'admin@test.com', password: hashed, role: 'admin' },
    { name: 'Team Lead 1', email: 'teamlead@test.com', password: hashed, role: 'teamlead' },
  ];

  for (let u of users) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      await User.create(u);
      console.log(`Created ${u.email}`);
    } else {
      console.log(`${u.email} already exists`);
    }
  }

  const tl = await User.findOne({ email: 'teamlead@test.com' });
  
  const intern = { name: 'Intern 1', email: 'intern@test.com', password: hashed, role: 'intern', teamLeadId: tl._id };
  const existingIntern = await User.findOne({ email: 'intern@test.com' });
  if (!existingIntern) {
    await User.create(intern);
    console.log(`Created ${intern.email}`);
  } else {
    console.log(`${intern.email} already exists`);
  }

  process.exit();
};

seedUsers();
