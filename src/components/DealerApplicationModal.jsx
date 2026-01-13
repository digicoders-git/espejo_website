import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DealerApplicationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    experience: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Application submitted successfully! We will contact you soon.');
    onClose();
    setFormData({
      businessName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      businessType: '',
      experience: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Dealer Application</h2>
          <button onClick={onClose} className="text-2xl text-black">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Business Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            >
              <option value="">Select Business Type</option>
              <option value="retail">Retail Store</option>
              <option value="showroom">Showroom</option>
              <option value="distributor">Distributor</option>
              <option value="online">Online Store</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default DealerApplicationModal;