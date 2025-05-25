const mongoose = require('mongoose');
const Election = require('./models/electionModel'); // adjust path as needed
const Candidate = require('./models/candidateModel'); // adjust path as needed

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

async function seedDatabase() {
  try {
    // Clear existing data (optional)
    await Election.deleteMany({});
    await Candidate.deleteMany({});
    console.log('Cleared existing data');

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

    // Insert elections and get the actual IDs
    const insertedElections = await Election.insertMany(elections);
    console.log(`${insertedElections.length} elections added successfully.`);

    // Now create candidates using the actual election IDs
    const candidatesData = [
      // Student Council Election candidates
      {
        name: "Emily Rodriguez",
        party: "Progressive Student Alliance",
        election: insertedElections[0]._id, // Use actual election ID
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Marcus Johnson",
        party: "Student Unity Party",
        election: insertedElections[0]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Sarah Chen",
        party: "Campus Innovation Coalition",
        election: insertedElections[0]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // City Mayor Election candidates
      {
        name: "David Thompson",
        party: "Democratic Party",
        election: insertedElections[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lisa Williams",
        party: "Republican Party",
        election: insertedElections[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Michael Green",
        party: "Independent",
        election: insertedElections[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Patricia Davis",
        party: "Green Party",
        election: insertedElections[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Tech Committee Vote candidates
      {
        name: "Alex Kumar",
        party: "Innovation Committee",
        election: insertedElections[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Jessica Park",
        party: "Technology Advancement Group",
        election: insertedElections[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Robert Martinez",
        party: "Digital Future Coalition",
        election: insertedElections[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Amanda Foster",
        party: "Tech Ethics Alliance",
        election: insertedElections[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Seed Election candidates (for testing)
      {
        name: "Test Candidate Alpha",
        party: "Test Party A",
        election: insertedElections[3]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Test Candidate Beta",
        party: "Test Party B",
        election: insertedElections[3]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Demo User Charlie",
        party: "Independent Test",
        election: insertedElections[3]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert candidates
    const insertedCandidates = await Candidate.insertMany(candidatesData);
    console.log(`Successfully inserted ${insertedCandidates.length} candidates`);

    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close connection after everything is done
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();