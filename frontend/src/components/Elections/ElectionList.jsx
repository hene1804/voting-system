import React, { useState, useEffect } from 'react';
import electionService from './electionService';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedElection, setSelectedElection] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const data = await electionService.getAllElections();
      setElections(data);
      setError('');
    } catch (err) {
      setError('Failed to load elections. Please try again later.');
      console.error('Error fetching elections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (election) => {
    setSelectedElection(election);
  };

  const handleCloseDetails = () => {
    setSelectedElection(null);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if election is active
  const isActive = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    return now >= start && now <= end;
  };

  // Check if election is upcoming
  const isUpcoming = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    return now < start;
  };

  // Check if election is completed
  const isCompleted = (election) => {
    const now = new Date();
    const end = new Date(election.endDate);
    return now > end;
  };

  const getStatusBadge = (election) => {
    if (isActive(election)) {
      return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Active</span>;
    } else if (isUpcoming(election)) {
      return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Upcoming</span>;
    } else if (isCompleted(election)) {
      return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Completed</span>;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">University Elections</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading elections...</p>
        </div>
      ) : elections.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-2">No elections found</p>
          <p className="text-sm text-gray-400">Create a new election to get started</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {elections.map((election) => (
              <li key={election._id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        {getStatusBadge(election)}
                        <h3 className="ml-2 text-lg font-medium text-gray-900 truncate">
                          {election.title}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          {election.electionType.join(', ')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {election.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        {formatDate(election.startDate)} - {formatDate(election.endDate)}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleViewDetails(election)}
                        className="inline-flex items-center px-3 py-1.5 border border-indigo-500 text-indigo-500 text-sm font-medium rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {selectedElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedElection.title}</h2>
                <div className="mt-1">{getStatusBadge(selectedElection)}</div>
              </div>
              <button 
                onClick={handleCloseDetails}
                className="rounded-full p-1 hover:bg-gray-200 text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-900">{selectedElection.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Position Types</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedElection.electionType.map(type => (
                    <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedElection.startDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedElection.endDate)}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                {isActive(selectedElection) && (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Cast Vote
                  </button>
                )}
                
                {isCompleted(selectedElection) && (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    See Results
                  </button>
                )}
                
                <button 
                  onClick={handleCloseDetails}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionList;