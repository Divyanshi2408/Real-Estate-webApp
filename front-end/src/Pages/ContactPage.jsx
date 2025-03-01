import React, { useState } from "react";


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactMethod: "email",
    interest: "buying",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Your message has been sent!");
  };

  return (
    <div className="bg-gray-100 text-gray-800 py-16 px-6 lg:px-20">
      {/* Header Section with Wavy Red Background */}
      <div className="relative text-center mb-12">
        <div className="absolute inset-0">
          <svg className="w-full h-64 md:h-80 lg:h-96" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#b91c1c" fillOpacity="1"
              d="M0,280L60,260C120,240,240,200,360,210C480,220,600,260,720,270C840,280,960,250,1080,230C1200,210,1320,190,1380,180L1440,170L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z">
            </path>
          </svg>
        </div>
        <div className="relative py-32">
          <h1 className="text-5xl font-bold text-white">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-200">
            Ready to start your real estate journey? Our team is here to help you every step of the way.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg mb-12">
        <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
        <p className="mt-4 text-gray-700">Feel free to reach out to us anytime.</p>
        <ul className="mt-4 text-gray-700 space-y-2">
          <li><strong>Phone:</strong> +1 234 567 890</li>
          <li><strong>Email:</strong> info@brickandbeams.com</li>
          <li><strong>Address:</strong> 123 Real Estate St, City, Country</li>
        </ul>
      </div>

      {/* Office Hours */}
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg mb-12">
        <h2 className="text-2xl font-semibold text-gray-900">Office Hours</h2>
        <ul className="mt-4 text-gray-700">
          <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</li>
          <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM</li>
          <li><strong>Sunday:</strong> By appointment only</li>
        </ul>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="border p-3 rounded-lg w-full" placeholder="Your Name" required />

            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="border p-3 rounded-lg w-full" placeholder="Your Email" required />
          </div>

          <input type="text" name="phone" value={formData.phone} onChange={handleChange}
            className="border p-3 rounded-lg w-full" placeholder="Your Phone" required />

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-gray-700 font-semibold">Preferred Contact Method</label>
            <select name="contactMethod" value={formData.contactMethod} onChange={handleChange}
              className="border p-3 rounded-lg w-full mt-2">
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Interest Selection */}
          <div>
            <label className="block text-gray-700 font-semibold">Interest</label>
            <select name="interest" value={formData.interest} onChange={handleChange}
              className="border p-3 rounded-lg w-full mt-2">
              <option value="buying">Buying</option>
              <option value="selling">Selling</option>
              <option value="renting">Renting</option>
            </select>
          </div>

          <textarea name="message" value={formData.message} onChange={handleChange}
            className="border p-3 rounded-lg w-full" placeholder="Your Message" rows="4" required></textarea>

          <button type="submit"
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition duration-300">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
