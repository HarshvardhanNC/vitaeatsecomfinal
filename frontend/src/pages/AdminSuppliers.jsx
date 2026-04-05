import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Truck, Plus, Trash2, Tag, Phone, Link2, DollarSign, Calendar, Package, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  
  const [showForm, setShowForm] = useState(false);
  const [showPoForm, setShowPoForm] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', ingredient: '', contact: '' });
  const [poForm, setPoForm] = useState({ supplier: '', ingredient: '', quantity: '', urgency: 'Normal', notes: '' });
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  
  const [saveMessage, setSaveMessage] = useState('');
  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [suppliersRes, posRes] = await Promise.all([
        axios.get('/api/suppliers', config),
        axios.get('/api/purchase-orders', config)
      ]);
      setSuppliers(suppliersRes.data);
      setPurchaseOrders(posRes.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/suppliers', formData, config);
      await fetchData();
      setSaveMessage('Supplier securely added to logistics.');
      setFormData({ name: '', ingredient: '', contact: '' });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding supplier');
    }
  };

  const handlePoSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/purchase-orders', poForm, config);
      await fetchData();
      setSaveMessage('Purchase Order successfully dispatched.');
      setPoForm({ supplier: '', ingredient: '', quantity: '', urgency: 'Normal', notes: '' });
      setShowPoForm(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error creating Purchase Order');
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm('Remove this supplier from upstream logistics?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/suppliers/${id}`, config);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error deleting supplier');
    }
  };

  const updatePoStatus = async (id, currentStatus) => {
    let nextStatus = 'Received';
    if (currentStatus === 'Received') return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/purchase-orders/${id}/status`, { status: nextStatus }, config);
      fetchData();
    } catch (error) {
       console.error(error);
       alert('Error updating PO status');
    }
  }



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">SCM: Vendor Management</h1>
          <p className="text-gray-500 text-lg">Manage upstream suppliers, track dependencies, and execute Purchase Orders.</p>
        </div>
        <Button 
          variant={showForm ? "outline" : "primary"} 
          onClick={() => {
            setSaveMessage('');
            setShowPoForm(false);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2"
        >
          {showForm ? 'Cancel Registration' : <><Plus size={20} /> Authorize Vendor</>}
        </Button>
      </div>

      {saveMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-primary">
          {saveMessage}
        </div>
      )}

      {/* SCM Analytics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Suppliers</p>
               <p className="text-3xl font-extrabold text-gray-900">{suppliers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <Truck size={24} />
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Requests</p>
               <p className="text-3xl font-extrabold text-gray-900">
                 {purchaseOrders.filter(po => po.status === 'Requested').length}
               </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
               <Package size={24} />
            </div>
         </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100 mb-12 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full opacity-60 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
               <Truck className="text-primary" size={28} /> Define Supply Node
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Vendor Firm Name</label>
                  <div className="relative flex items-center group">
                    <Tag size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="FreshFarms Organic" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Supplied Ingredient</label>
                  <div className="relative flex items-center group">
                    <Tag size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.ingredient} onChange={e => setFormData({...formData, ingredient: e.target.value})} placeholder="E.g., Quinoa" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Contact Gateway</label>
                  <div className="relative flex items-center group">
                    <Phone size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="+91 9XXXX XXXXX" required />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <Button type="submit" variant="primary">Authorize Vendor</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPoForm && (
        <div className="bg-white rounded-[2.5rem] border-2 border-primary/20 shadow-xl shadow-primary/10 p-8 sm:p-10 mb-12 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full opacity-60 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
               <Package className="text-primary" size={28} /> Request Raw Material
            </h2>
            <p className="text-gray-500 mb-8">Drafting purchase request for <span className="font-bold text-primary">{selectedSupplierName}</span> ({poForm.ingredient})</p>
            
            <form onSubmit={handlePoSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Quantity Required</label>
                  <div className="relative flex items-center group">
                    <Package size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="number" min="1" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={poForm.quantity} onChange={e => setPoForm({...poForm, quantity: e.target.value})} placeholder="In KG/Units" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Urgency Level</label>
                  <div className="relative flex items-center group">
                    <Package size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <select className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={poForm.urgency} onChange={e => setPoForm({...poForm, urgency: e.target.value})}>
                       <option value="Normal">Normal Routing</option>
                       <option value="High">Priority (High)</option>
                       <option value="Critical">Critical (Immediate)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Delivery Instructions</label>
                  <div className="relative flex items-center group">
                    <Tag size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={poForm.notes} onChange={e => setPoForm({...poForm, notes: e.target.value})} placeholder="E.g., Drop at back gate" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <Button type="button" variant="outline" onClick={() => setShowPoForm(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Register Table */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Authorized Vendors</h3>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Protocol & Name</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Raw Material Stream</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-8 py-5 text-right text-xs font-extrabold text-gray-500 uppercase tracking-wider">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map(supplier => {
                return (
                <tr key={supplier._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="font-bold text-gray-900 text-lg mb-0.5">{supplier.name}</div>
                    <div className="text-xs text-gray-400 font-mono">SUP-{supplier._id.substring(supplier._id.length - 6).toUpperCase()}</div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold tracking-wide">
                      {supplier.ingredient}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-gray-600 font-medium">
                    {supplier.contact}
                  </td>
                  <td className="px-8 py-4 text-right flex items-center justify-end gap-3">
                    <Button 
                       variant="primary" 
                       size="sm" 
                       className="rounded-xl px-4 py-1.5 text-xs flex items-center gap-1.5"
                       onClick={() => {
                          setShowForm(false);
                          setSaveMessage('');
                          setSelectedSupplierName(supplier.name);
                          setPoForm({ supplier: supplier._id, ingredient: supplier.ingredient, quantity: '', urgency: 'Normal', notes: '' });
                          setShowPoForm(true);
                          window.scrollTo(0, 0); // Scroll to top to see form
                       }}
                    >
                       <Package size={14} /> Request Stock
                    </Button>
                    <button onClick={() => deleteSupplier(supplier._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )})}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-medium">
                    No upstream logistics nodes established in DB.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Logistics Control Tower (Purchase Orders)</h3>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Date & PO No.</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Supplier & Request</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Qty & Urgency</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Delivery Instructions</th>
                <th className="px-8 py-5 text-center text-xs font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-right w-32 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Update Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchaseOrders.map(po => {
                const datePlaced = new Date(po.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                
                return (
                <tr key={po._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="text-sm font-bold text-gray-900">{datePlaced}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">PO-{po._id.substring(po._id.length - 6).toUpperCase()}</div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="font-bold text-gray-900 mb-0.5">{po.supplier?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1"><Package size={12}/> {po.ingredient}</div>
                  </td>
                  <td className="px-8 py-4">
                     <div className="font-extrabold text-gray-900 text-lg">{po.quantity} Units</div>
                     <span className={`text-xs font-bold tracking-wide ${po.urgency === 'Critical' ? 'text-red-500' : po.urgency === 'High' ? 'text-orange-500' : 'text-gray-400'}`}>
                       {po.urgency} Urgency
                     </span>
                  </td>
                  <td className="px-8 py-4 text-gray-600 font-medium text-sm">
                    {po.notes || <span className="italic text-gray-400">No notes provided</span>}
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide
                       ${po.status === 'Requested' ? 'bg-orange-100 text-orange-700' : 
                         'bg-green-100 text-green-700'}`}>
                      {po.status === 'Received' && <CheckCircle size={14} />}
                      {po.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    {po.status === 'Requested' ? (
                       <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl px-3 py-1 text-xs whitespace-nowrap"
                          onClick={() => updatePoStatus(po._id, po.status)}
                       >
                          Mark Received <CheckCircle size={14} className="ml-1 inline" />
                       </Button>
                    ) : (
                       <span className="text-xs text-green-600 font-bold flex justify-end"><CheckCircle size={16} /></span>
                    )}
                  </td>
                </tr>
              )})}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center text-gray-400 font-medium">
                    No active purchase orders tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSuppliers;
