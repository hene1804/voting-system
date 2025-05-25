const Election = require('../models/electionModel');
const Candidate = require('../models/candidateModel');
const Vote = require('../models/voteModel');

// Create a new election
exports.createElection = async (req, res) => {
  try {
    const { title, description, electionType, startDate, endDate } = req.body;
    
    // Validate request body
    if (!title || !description || !electionType || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }
    
    // Create new election
    const election = new Election({
      title,
      description,
      electionType,
      startDate: start,
      endDate: end,
      createdBy: req.user.id // Assuming user info is added by auth middleware
    });
    
    const savedElection = await election.save();
    
    res.status(201).json({
      success: true,
      data: savedElection
    });
    
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get all elections
exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email'); // Optionally populate creator details
    
    res.status(200).json({
      success: true,
      count: elections.length,
      data: elections
    });
    
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get election by ID
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('createdBy', 'name email');
      
    if (!election) {
      return res.status(404).json({
        success: false,
        error: 'Election not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: election
    });
    
  } catch (error) {
    console.error('Error fetching election:', error);
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid election ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update election
exports.updateElection = async (req, res) => {
  try {
    const { title, description, electionType, startDate, endDate } = req.body;
    
    // Find election
    let election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({
        success: false,
        error: 'Election not found'
      });
    }
    
    // Check if user is authorized to update (assuming user is added by auth middleware)
    if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this election'
      });
    }
    
    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return res.status(400).json({
          success: false,
          error: 'End date must be after start date'
        });
      }
    }
    
    // Update election
    election = await Election.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: election
    });
    
  } catch (error) {
    console.error('Error updating election:', error);
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid election ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete election
exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({
        success: false,
        error: 'Election not found'
      });
    }
    
    // Check if user is authorized to delete (assuming user is added by auth middleware)
    if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this election'
      });
    }
    
    // Find related candidates and votes to delete them as well
    const candidates = await Candidate.find({ election: req.params.id });
    const candidateIds = candidates.map(candidate => candidate._id);
    
    // Delete votes associated with these candidates
    await Vote.deleteMany({ candidate: { $in: candidateIds } });
    
    // Delete candidates
    await Candidate.deleteMany({ election: req.params.id });
    
    // Delete the election
    await election.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
    
  } catch (error) {
    console.error('Error deleting election:', error);
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid election ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get election results
exports.getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // Check if election exists
    const election = await Election.findById(electionId);
    
    if (!election) {
      return res.status(404).json({
        success: false,
        error: 'Election not found'
      });
    }
    
    // Get candidates for this election
    const candidates = await Candidate.find({ election: electionId });
    
    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No candidates found for this election',
        data: []
      });
    }
    
    // Create array to store results
    const results = [];
    
    // Get vote count for each candidate
    for (const candidate of candidates) {
      const voteCount = await Vote.countDocuments({ candidate: candidate._id });
      
      results.push({
        candidate: {
          id: candidate._id,
          name: candidate.name,
          party: candidate.party,
          position: candidate.position
        },
        voteCount
      });
    }
    
    // Sort by vote count (descending)
    results.sort((a, b) => b.voteCount - a.voteCount);
    
    // Calculate total votes
    const totalVotes = results.reduce((sum, item) => sum + item.voteCount, 0);
    
    // Add percentage to each result
    results.forEach(result => {
      result.percentage = totalVotes > 0 
        ? ((result.voteCount / totalVotes) * 100).toFixed(2) 
        : 0;
    });
    
    res.status(200).json({
      success: true,
      data: {
        election: {
          id: election._id,
          title: election.title,
          type: election.electionType,
          startDate: election.startDate,
          endDate: election.endDate
        },
        totalVotes,
        results
      }
    });
    
  } catch (error) {
    console.error('Error fetching election results:', error);
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid election ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};