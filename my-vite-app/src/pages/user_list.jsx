import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, AlertCircle, Search, Filter } from 'lucide-react';

const TelegramUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Filter users based on search term
  const URL=import.meta.env.VITE_REACT_BACKEND_URL || "http://127.0.0.1:8000/"
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.message_id.toString().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const fetchTelegramUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch(URL+'fetch-telegram-users/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching telegram users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTelegramUsers();
  }, []);

  const handleRefresh = () => {
    fetchTelegramUsers();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className='flex justify-center'>
      <a
        href="https://t.me/lol3466_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-3 my-4 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition duration-200"
      >
      Start the bot
      </a>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Telegram Users</h1>
                <p className="text-blue-100">Manage and view all registered Telegram usernames</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-white ${loading ? 'animate-spin' : ''}`} />
              <span className="text-white font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username or message ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Total: {users.length}</span>
              {searchTerm && <span>| Filtered: {filteredUsers.length}</span>}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                <span className="text-gray-600 font-medium">Loading telegram users...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="font-medium text-red-800">Error Loading Data</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="mt-4 w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredUsers.length === 0 && users.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Telegram Users Found</h3>
                <p className="text-gray-500">No telegram usernames have been registered yet.</p>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && filteredUsers.length === 0 && users.length > 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-500">No users match your search criteria.</p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.message_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 font-medium">
                          View Details
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats Footer */}
          {!loading && !error && users.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing {filteredUsers.length} of {users.length} telegram users
                </div>
                <div className="flex items-center space-x-4">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramUsersTable;