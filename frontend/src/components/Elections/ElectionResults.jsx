import React, { useState, useEffect } from 'react';
import electionService from './electionService';

const ElectionResults = ({ electionId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (electionId) {
      fetchResults(electionId);
    }
  }, [electionId]);

  const fetchResults = async (id) => {
    try {
      setLoading(true);
      const data = await electionService.getElectionResults(id);
      setResults(data);
      setError('');
    } catch (err) {
      setError('Failed to load election results. Please try again later.');
      console.error('Error fetching election results:', err);
    } finally {
      setLoading(false);
    }
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

  // Function to determine the winner(s)
  const getWinners = () => {
    if (!results || !results.results || results.results.length === 0) return [];
    
    const sortedResults = [...results.results].sort((a, b) => b.voteCount - a.voteCount);
    const highestVotes = sortedResults[0].voteCount;
    
    // Get all candidates with the highest vote count (in case of a tie)
    return sortedResults.filter(result => result.voteCount === highestVotes);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const winners = getWinners();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{results.election.title} - Results</h2>
        <p className="text-sm text-gray-500 mt-1">
          Election Period: {formatDate(results.election.startDate)} - {formatDate(results.election.endDate)}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-2">
          Total Votes Cast: <span className="font-bold">{results.totalVotes}</span>
        </p>
      </div>

      {winners.length > 0 && (
        <div className="px-6 py-4 bg-indigo-50">
          <h3 className="text-md font-medium text-indigo-800">
            {winners.length === 1 ? 'Winner' : 'Winners (Tie)'}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {winners.map(winner => (
              <div key={winner.candidate.id} className="bg-white shadow-sm rounded-lg p-3 border border-indigo-200">
                <p className="font-bold text-indigo-700">{winner.candidate.name}</p>
                <p className="text-sm text-gray-600">{winner.candidate.position}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {winner.voteCount} vote{winner.voteCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {winner.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4">
        <h3 className="text-md font-medium text-gray-700 mb-3">All Candidates</h3>
        
        <div className="space-y-4">
          {results.results.map((result, index) => (
            <div 
              key={result.candidate.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                winners.some(w => w.candidate.id === result.candidate.id) ? 'bg-indigo-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-500 mr-3">
                  {index + 1}.
                </span>
                <div>
                  <p className="font-medium text-gray-900">{result.candidate.name}</p>
                  <p className="text-sm text-gray-500">{result.candidate.position}</p>
                  {result.candidate.party && (
                    <p className="text-xs text-gray-400">{result.candidate.party}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{result.voteCount}</p>
                <p className="text-sm text-gray-500">
                  {result.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Results last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ElectionResults;