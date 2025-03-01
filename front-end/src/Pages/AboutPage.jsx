import { useState } from "react";
import React from "react";
import { FaShieldAlt, FaStar, FaLightbulb, FaEye, FaUsers, FaArrowAltCircleDown } from "react-icons/fa";

const AboutPage = () => {
  const [showTeam, setShowTeam] = useState(false);

  const teamMembers = [
    { name: "Divyanshi", role: "Developer", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eliza&flip=true&eyebrows=default&eyes=default&mouth=smile", desc: "Visionary leader with 20+ years in real estate." },
    { name: "Shivam", role: "Developer", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=K&flip=true&accessories=sunglasses&accessoriesColor[]&accessoriesProbability=100&clothingGraphic[]&eyebrows=default&eyes=default&facialHair[]&hairColor=2c1b18&hatColor[]&mouth=smile&skinColor=ffdbb4", desc: "Expert in digital marketing and client engagement." },
    { name: "Arshad", role: "Developer", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=K&flip=true&accessories=sunglasses&accessoriesColor[]&accessoriesProbability=100&clothesColor=25557c&clothing=blazerAndSweater&clothingGraphic[]&eyebrows=default&eyes=default&facialHair[]&hairColor=2c1b18&hatColor[]&mouth=smile&skinColor=ffdbb4", desc: "Connecting buyers and sellers for seamless transactions." },
    { name: "Yash", role: "Developer", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mason&flip=true&accessories=sunglasses&accessoriesColor[]&accessoriesProbability=100&clothesColor=5199e4&clothing=shirtCrewNeck&clothingGraphic[]&eyebrows=default&eyes=default&facialHair[]&hairColor=2c1b18&hatColor[]&mouth=smile&skinColor=ffdbb4", desc: "Helping clients make smart investment decisions." },
    { name: "Krishna", role: "Developer", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=K&flip=true&accessories=sunglasses&accessoriesColor[]&accessoriesProbability=100&clothesColor=3c4f5c&clothing=blazerAndSweater&clothingGraphic[]&eyebrows=default&eyes=default&facialHair[]&hairColor=2c2b18&hatColor[]&mouth=smile&skinColor=ffdbb4", desc: "Ensuring properties are maintained to the highest standards." }
  ];

  const values = [
    { title: "Integrity", desc: "Upholding the highest professional and ethical standards.", icon: <FaShieldAlt /> },
    { title: "Excellence", desc: "Delivering top-tier service in every interaction.", icon: <FaStar /> },
    { title: "Innovation", desc: "Utilizing the latest technology for better results.", icon: <FaLightbulb /> },
    { title: "Transparency", desc: "Keeping our clients informed every step of the way.", icon: <FaEye /> },
    { title: "Community", desc: "Actively contributing to the neighborhoods we serve.", icon: <FaUsers /> },
  ];
  return (
    <div className="bg-gray-100 text-gray-800 py-16 px-6 lg:px-20">
      {/* Header Section */}
      {/* Header Section with an Even Longer Wavy Red Background */}
      <div className="relative text-center mb-12">
        <div className="absolute inset-0">
          <svg className="w-full h-64 md:h-80 lg:h-96" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#b91c1c" fillOpacity="1"
              d="M0,280L60,260C120,240,240,200,360,210C480,220,600,260,720,270C840,280,960,250,1080,230C1200,210,1320,190,1380,180L1440,170L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z">
            </path>
          </svg>
        </div>

        <div className="relative py-32">
          <h1 className="text-5xl font-bold text-white">About Us</h1>
          <p className="mt-4 text-lg text-gray-200">
            Connecting people with properties in meaningful ways.
          </p>
        </div>
      </div>


      {/* Our Story Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg mb-12">
        <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
        <p className="mt-4 text-gray-700">
          At <b>Brick & Beams</b>, we believe that every real estate journey should be as unique as the people involved. Our story began with a vision: to create meaningful connections between individuals and properties. Today, we are a trusted name in real estate, helping clients find not just a property, but a place they can truly call home.
        </p>
      </div>

      {/* Our Mission Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg mb-12">
        <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
        <p className="mt-4 text-gray-700">
          Our goal is to provide <b>exceptional real estate services</b> that go beyond expectations, ensuring every client finds their perfect space while maximizing their investment.
        </p>
      </div>

      {/* Our Values Section with Slide Transition Effect */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="relative overflow-hidden bg-white p-6 rounded-lg shadow-lg group">
              {/* Sliding Red Background Effect */}
              <div className="absolute inset-0 bg-red-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>

              {/* Icon inside Circle with 360° Rotation Effect */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-red-700 text-red-700 
                          group-hover:text-white group-hover:border-white transition-all duration-700 
                          transform group-hover:rotate-[360deg]">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-white transition-colors duration-500">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-700 group-hover:text-white transition-colors duration-500">
                  {value.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Our Team Section */}
      <div className="bg-gray-100 text-gray-800 py-16 px-6 lg:px-20">
        {/* Our Team Section */}
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg cursor-pointer" onClick={() => setShowTeam(!showTeam)}>
          <h2 className="text-2xl font-semibold text-gray-900">Our Team</h2>
          <p className="mt-4 text-gray-700">
            Our diverse team of real estate, finance, and property management experts has decades of combined experience.
            Click below to learn more about them!
          </p>
          <FaArrowAltCircleDown className="w-7 h-7 mt-2 hover:scale-105 hover:shadow-2xl text-red-700" />
        </div>

        {showTeam && (
          <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img src={member.img} alt={member.name} className="w-32 h-32 mx-auto rounded-full mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-red-700 font-medium">{member.role}</p>
                <p className="mt-2 text-gray-700">{member.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;