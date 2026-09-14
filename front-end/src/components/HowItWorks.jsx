import React from "react";
import { FaSearchLocation, FaCalendarCheck, FaHandshake } from "react-icons/fa";

const steps = [
  {
    icon: <FaSearchLocation />,
    title: "Search Listings",
    desc: "Filter by city, type, size, and budget to find properties that match what you need.",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Schedule a Visit",
    desc: "Message the owner directly and arrange a time to see the property in person.",
  },
  {
    icon: <FaHandshake />,
    title: "Close the Deal",
    desc: "Agree on terms and finalize the purchase or rental with confidence.",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 py-16 mb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center max-md:text-3xl">
          How It Works
        </h2>
        <p className="text-gray-500 text-center mb-12">
          Three simple steps from browsing to moving in
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-700 text-white text-3xl shadow-lg mb-5">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
