import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

// Static placeholder testimonials for now. Once a reviews API route exists
// (backend has a Review model but no route yet), this can be swapped to fetch
// real data the same way HomePage fetches properties.
const testimonials = [
  {
    name: "Ananya Sharma",
    location: "Delhi",
    rating: 5,
    quote:
      "Found our new apartment within two weeks of searching. The filters made it easy to narrow down exactly what we wanted.",
  },
  {
    name: "Rohan Verma",
    location: "Mumbai",
    rating: 5,
    quote:
      "Listing our villa here was straightforward and we had serious inquiries within days. Great experience overall.",
  },
  {
    name: "Priya Nair",
    location: "Agra",
    rating: 4,
    quote:
      "Clean interface and the property details page had everything we needed to make a decision without a site visit.",
  },
];

const Testimonials = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center max-md:text-3xl">
        What Our Clients Say
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Real experiences from buyers, sellers, and renters
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <FaQuoteLeft className="text-red-700 text-2xl mb-3" />
            <p className="text-gray-700 flex-1">{t.quote}</p>
            <div className="flex items-center gap-1 mt-4 text-yellow-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar key={idx} className={idx < t.rating ? "opacity-100" : "opacity-20"} />
              ))}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-gray-900">{t.name}</p>
              <p className="text-sm text-gray-500">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
