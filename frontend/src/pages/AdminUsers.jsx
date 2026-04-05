import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Users, Mail, CheckCircle, XCircle } from 'lucide-react';

const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/admin/users', config);
        setUsersList(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'admin') fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-1">
                <Users className="text-primary" size={28} /> Active Users Directory
              </h2>
              <p className="text-gray-500 font-medium text-sm">Monitor all registered users and their newsletter subscriptions.</p>
            </div>
            <div className="px-5 py-2.5 bg-primary/10 text-primary font-bold text-sm rounded-xl">
              {usersList.filter(u => u.isSubscribedToNewsletter).length} Active Subscribers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-5 px-6 font-bold text-gray-400 text-xs uppercase tracking-wider">User Identity</th>
                  <th className="pb-5 px-6 font-bold text-gray-400 text-xs uppercase tracking-wider">Contact Address</th>
                  <th className="pb-5 px-6 font-bold text-gray-400 text-xs uppercase tracking-wider">Access Level</th>
                  <th className="pb-5 px-6 font-bold text-gray-400 text-xs uppercase tracking-wider">Newsletter Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-600">
                          {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400 font-mono">ID: {u._id.substring(u._id.length - 6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Mail size={14} className="text-gray-400" /> {u.email}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      {u.isSubscribedToNewsletter ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-max">
                          <CheckCircle size={14} /> Subscribed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full w-max">
                          <XCircle size={14} /> Opted Out
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usersList.length === 0 && (
              <div className="text-center py-10 text-gray-400 font-medium">Fetching active user records...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
