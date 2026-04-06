import React from 'react';
import { ShieldCheck, FileText, Lock, Award } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy & Legal</h1>
        <p className="text-lg text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
        
        {/* Certification Section */}
        <div className="mb-12 p-8 bg-green-50 rounded-3xl border border-green-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Award className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-900">Licenses & Certifications</h2>
              <p className="text-green-800 text-sm">VitaEats operates under the highest commercial and health standards.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* FSSAI */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-50">
              <h3 className="flex items-center gap-2 font-bold text-green-900 mb-2">
                <ShieldCheck size={18} className="text-green-600" /> FSSAI License (No: 10020042001556)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Registered under the Food Safety and Standards Authority of India. This guarantees that our central kitchen undergoes regular hygiene inspections, quality audits, and strictly adheres to national safety protocols for food preparation and packaging.
              </p>
            </div>

            {/* Gomasta */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-50">
              <h3 className="flex items-center gap-2 font-bold text-green-900 mb-2">
                <ShieldCheck size={18} className="text-green-600" /> Gomasta License (Reg No: MH-20230819045)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Legally registered as a recognized commercial establishment under local municipal regulations. This ensures we follow proper labor laws, commercial hygiene mandates, and transparent, legally binding business practices.
              </p>
            </div>

            {/* ISO */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-50">
              <h3 className="flex items-center gap-2 font-bold text-green-900 mb-2">
                <ShieldCheck size={18} className="text-green-600" /> ISO 22000:2018 (Cert No: IN-IAF-88942)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Globally recognized standard for Food Safety Management Systems. This means absolute traceability for all our ingredients—from the farm to the bowl—preventing contamination and ensuring nutritional consistency.
              </p>
            </div>

            {/* Organic */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-50">
              <h3 className="flex items-center gap-2 font-bold text-green-900 mb-2">
                <ShieldCheck size={18} className="text-green-600" /> NPOP Organic Certified (No: NPOP/NAB/0014)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our raw materials—including vegetables, grains, and meats—are sourced directly from verified organic farms, ensuring zero use of synthetic pesticides, artificial fertilizers, or harmful preservatives.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-green max-w-none text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
            <FileText className="text-primary" /> 1. Data Collection & Privacy
          </h2>
          <p>
            VitaEats values your privacy. We collect basic information (name, email, health profile, and delivery address) solely for the purpose of executing standard e-commerce operations. 
            We <strong>never sell</strong> your personal information or health data to third-party data brokers.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
            <Lock className="text-primary" /> 2. Secure Online Payments
          </h2>
          <p>
            All online transactions are securely processed through Razorpay, a PCI-DSS compliant payment gateway. 
            <strong> VitaEats does not store your credit card, debit card, or UPI details</strong> on our servers. 
            We exclusively rely on secure, encrypted tokens from the payment processor.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-primary" /> 3. Refund & Cancellation Policy
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Single Orders:</strong> Orders can be cancelled for a full refund if the cancellation request is made before the kitchen begins preparation (usually within 15 minutes of placing the order).</li>
            <li><strong>Subscriptions & Meal Plans:</strong> Meal plans can be paused or cancelled at any time from your User Profile. Once a weekly delivery cycle has begun, refunds are prorated for the remaining un-prepared meals.</li>
            <li><strong>Refund Timeline:</strong> Approved refunds will be credited back to your original payment method within 3-5 business days.</li>
             <li><strong>Wallet & Referral Balance:</strong> Promotional wallet credits cannot be withdrawn to a bank account; they can solely be used for purchasing items on VitaEats.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Food Safety Disclaimer</h2>
          <p>
            While we take extreme care to prevent cross-contamination, our kitchens handle nuts, dairy, and gluten. 
            Customers with severe allergies are advised to check the ingredient list and dietary tags on every Meal Card prior to ordering.
          </p>
        </div>
      </div>
    </div>
  );
}
