import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import axios from 'axios';

const faqs = [
  { q: 'How do I apply a coupon code?', a: 'On the checkout page, enter your coupon code in the "Promo Code" field and click Apply. Valid codes like HEALTHY20 will give you an instant 20% discount.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled within 30 minutes of placing them. Please contact us immediately via email or phone for any modifications.' },
  { q: 'Are the meals suitable for vegetarians?', a: 'Yes! We offer a wide range of plant-based and vegetarian meals. Look for the "Healthy Snacks" and "Weight Loss" categories on our menu.' },
  { q: 'How fresh are the ingredients?', a: 'All meals are prepared fresh daily using ingredients sourced from certified organic suppliers. We never use preservatives.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', messageText: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/messages', form);
      setSubmitted(true);
      setForm({ name: '', email: '', mobile: '', subject: '', messageText: '' });
    } catch (error) {
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full min-h-screen">
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-100 text-primary text-sm font-bold tracking-wide mb-4">
          <MessageCircle size={14} /> We're Here to Help
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Contact &amp; Support</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">Have a question, issue, or feedback? We typically respond within 2 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        {/* Contact Info Cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-primary flex items-center justify-center flex-shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Email Us</p>
              <p className="text-sm text-gray-500">support@vitaeats.in</p>
              <p className="text-xs text-primary font-semibold mt-1">Response within 2 hours</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Call Us</p>
              <p className="text-sm text-gray-500">+91 9920378897</p>
              <p className="text-xs text-gray-400 mt-1">Mon–Sat, 9AM – 8PM</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Our Location</p>
              <p className="text-sm text-gray-500">Collector colony, Chembur<br/>Mumbai - 400072</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sm:p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <Send className="text-primary" size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h2>
              <p className="text-gray-500 mb-6">We've received your message and will get back to you within 2 hours.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                      placeholder="Priya Sharma"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email" required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                      placeholder="priya@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Mobile Number</label>
                    <input
                      type="tel" required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                      placeholder="+91 XXXXXXXXXX"
                      value={form.mobile}
                      onChange={e => setForm({ ...form, mobile: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Subject</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                      placeholder="Order issue, coupon query, feedback..."
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    required rows={5}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium resize-none"
                    placeholder="Describe your issue or feedback in detail..."
                    value={form.messageText}
                    onChange={e => setForm({ ...form, messageText: e.target.value })}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={loading}>
                    <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-7 py-5 font-bold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                {faq.q}
                <span className={`text-primary font-extrabold text-xl transition-transform duration-200 ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === idx && (
                <div className="px-7 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
