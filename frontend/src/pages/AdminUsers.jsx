import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Users, Mail, CheckCircle, XCircle, MessageSquare, Phone } from 'lucide-react';

const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: usersData } = await axios.get('/api/admin/users', config);
        setUsersList(usersData);
        
        const { data: messagesData } = await axios.get('/api/messages', config);
        setMessages(messagesData);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'admin') fetchData();
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

          {/* Support Tickets Section */}
          <div className="mt-20 border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-1">
                  <MessageSquare className="text-primary" size={28} /> Support Tickets & Messages
                </h2>
                <p className="text-gray-500 font-medium text-sm">Review incoming contact form submissions from users.</p>
              </div>
              <div className="px-5 py-2.5 bg-orange-50 text-orange-600 font-bold text-sm rounded-xl">
                {messages.length} Tickets
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{msg.name}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Ticket
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" /> {msg.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Phone size={14} className="text-primary" /> {msg.mobile} 
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-inner">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-2 uppercase tracking-wide">SUB: {msg.subject}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{msg.messageText}</p>
                  </div>
                  
                  <div className="mt-5 flex justify-end">
                    <a 
                      href={`tel:${msg.mobile}`} 
                      className="bg-primary hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm"
                    >
                      <Phone size={16} /> Contact User
                    </a>
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
                  No messages received yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
