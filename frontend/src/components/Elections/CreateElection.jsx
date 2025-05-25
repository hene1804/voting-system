import React, { useState } from 'react';
import electionService from './electionService';

const CreateElection = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    electionType: [],
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // List of university position election types
  const electionTypes = [
    'Student Body President',
    'Student Senate',
    'Department Representative',
    'Class President',
    'Residence Hall Council',
    'Student Union Board',
    'Club/Organization Officer',
    'Graduate Student Association',
    'Faculty Senate',
    'Department Chair',
    'Dean Selection Committee',
    'Board of Trustees Student Rep'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          electionType: [...prev.electionType, value]
        };
      } else {
        return {
          ...prev,
          electionType: prev.electionType.filter(type => type !== value)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form data
      if (!formData.title || !formData.description || formData.electionType.length === 0 || !formData.startDate || !formData.endDate) {
        throw new Error('All fields are required');
      }
      
      // Check if end date is after start date
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('End date must be after start date');
      }
      
      // Use the election service to create the election
      await electionService.createElection(formData);
      
      setSuccess('Election created successfully!');
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        electionType: [],
        startDate: '',
        endDate: ''
      });
      
    } catch (error) {
      setError(error.message);
      console.error('Error creating election:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Create University Election</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          <p className="font-medium">Success</p>
          <p>{success}</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Election Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Enter election title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Enter election description"
            rows="4"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position Type (Select at least one)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {electionTypes.map(type => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={type}
                  name="electionType"
                  value={type}
                  checked={formData.electionType.includes(type)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={type} className="ml-2 text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? 'Creating...' : 'Create Election'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateElection;