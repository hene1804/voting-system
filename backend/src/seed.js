const mongoose = require('mongoose');
const Election = require('./models/electionModel'); // adjust path as needed

// Connect to MongoDB
mongoose.connect('mongodb+srv://brianmwenda255:41q8HYCSVjzeiDOG@cluster0.4tg7pi2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Get today's date and build ongoing range
const now = new Date();
const fiveDaysAgo = new Date(now);
fiveDaysAgo.setDate(now.getDate() - 5);

const fiveDaysLater = new Date(now);
fiveDaysLater.setDate(now.getDate() + 5);

// Sample ongoing elections
const elections = [
  {
    title: 'Ongoing Student Council Election',
    description: 'Live election for student council 2025.',
    electionType: 'Student',
    startDate: fiveDaysAgo,
    endDate: fiveDaysLater,
    createdBy: new mongoose.Types.ObjectId()
  },
  {
    title: 'Ongoing City Mayor Election',
    description: 'Live voting for city mayor.',
    electionType: 'Municipal',
    startDate: fiveDaysAgo,
    endDate: fiveDaysLater,
    createdBy: new mongoose.Types.ObjectId()
  },
  {
    title: 'Ongoing Tech Committee Vote',
    description: 'Choose your tech conference committee.',
    electionType: 'Organizational',
    startDate: fiveDaysAgo,
    endDate: fiveDaysLater,
    createdBy: new mongoose.Types.ObjectId()
  },
  {
    title: 'Ongoing Seed Election',
    description: 'This is the ongoing seed election for testing.',
    electionType: 'seed',
    startDate: fiveDaysAgo,
    endDate: fiveDaysLater,
    createdBy: new mongoose.Types.ObjectId()
  }
];

// Insert elections
Election.insertMany(elections)
  .then(res => {
    console.log(`${res.length} elections added successfully.`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error inserting elections:', err);
    mongoose.connection.close();
  });
