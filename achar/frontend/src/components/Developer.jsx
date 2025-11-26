import React from "react";
import {
  FaCode,
  FaStar,
  FaUsers,
  FaRocket,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

const developers = [
  {
    name: "Krishna Yadav",
    role: "Full Stack MERN Developer",
    phone: "+91 9028772788",
    email: "krishnaerrorr@gmail.com",
    linkedin: "https://www.linkedin.com/in/krishna-yadav-177708284",
    portfolio: "https://portfolio-382b.vercel.app/",
    description:
      "Krishna Yadav ek highly skilled Full Stack Developer hain jo coding ko creative art ki tarah treat karte hain. Modern UI design se lekar high-performance backend tak – Krishna har project ko top-level perfection ke saath complete karte hain. Unki debugging skills itni powerful hain ki complex issues ko bhi minutes me solve kar dete hain. Client satisfaction unka first priority hota hai, aur delivery speed itni fast hoti hai ki client har baar 200% impressed ho jata hai.",
    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "UI/UX",
      "Animations",
      "API Integration",
    ],
  },

  {
    name: "Aniket Singh",
    role: "Frontend & UI Specialist",
    description:
      "Aniket Singh UI ke magician hain! Modern design, smooth animations, fast performance – sab kuch ekdum world-class level par deliver karte hai. Pixel-perfect layout banana ho ya powerful responsive UI, Aniket ka kaam premium agency jaisa hota hai. Har client unke design se heavily impress hota hai.",
    skills: [
      "React",
      "Tailwind CSS",
      "GSAP",
      "Responsive UI",
      "Frontend Logic",
    ],
  },

  {
    name: "Vivek Prajapati",
    role: "Backend & Logic Expert",
    description:
      "Vivek Prajapati backend ke master hain. API designing, database structure, authentication system – sab kuch rocket speed aur bilkul secure tarike se banate hain. Unke code ka structure itna powerful hota hai ki future updates super easy ho jate hain. Performance optimization unka favourite game hai.",
    skills: [
      "Node.js",
      "MongoDB",
      "JWT Auth",
      "APIs",
      "Server Optimization",
    ],
  },
];

const Developer = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-16 px-6 md:px-20">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-4">
        Meet Our Developers
      </h1>

      <p className="text-center text-gray-700 text-lg mb-14 max-w-3xl mx-auto">
        Hum teen developers ek hi mission par kaam karte hain –  
        <span className="font-semibold text-blue-700">
          India ke businesses ko digital duniya ka superstar banana.
        </span>
        <br />
        Humaare kaam ka standard itna high-quality hota hai ki client ek baar
        project de aur hamesha ke liye hum par trust kar le ❤️.
      </p>

      {/* Developer Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {developers.map((dev, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200 hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            {/* Developer Name */}
            <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              {dev.name}
            </h2>

            {/* Role */}
            <p className="text-gray-600 font-medium mb-4">{dev.role}</p>

            {/* Description */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {dev.description}
            </p>

            {/* Contact Info (only if available) */}
            {dev.phone || dev.email || dev.linkedin || dev.portfolio ? (
              <div className="mb-5 space-y-2">
                {dev.phone && (
                  <p className="flex items-center gap-2 text-blue-700 font-medium">
                    <FaPhone /> {dev.phone}
                  </p>
                )}

                {dev.email && (
                  <p className="flex items-center gap-2 text-blue-700 font-medium break-all">
                    <FaEnvelope /> {dev.email}
                  </p>
                )}

                {dev.linkedin && (
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                  >
                    <FaLinkedin /> LinkedIn Profile
                  </a>
                )}

                {dev.portfolio && (
                  <a
                    href={dev.portfolio}
                    target="_blank"
                    className="flex items-center gap-2 text-green-600 font-semibold hover:underline"
                  >
                    <FaGlobe /> Portfolio Website
                  </a>
                )}
              </div>
            ) : null}

            {/* Skills */}
            <div className="mt-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <FaCode /> Skills:
              </h3>
              <div className="flex flex-wrap gap-2">
                {dev.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Message */}
      <div className="text-center mt-16 max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <FaUsers className="text-blue-700 text-5xl" />
        </div>

        <p className="text-xl font-semibold text-gray-800">
          Hum ek strong team hain jiska goal hai:
        </p>

        <h2 className="text-3xl font-extrabold text-blue-800 mt-2">
          "Aapke business ko online duniya me No.1 banana!"
        </h2>

        <p className="text-gray-700 mt-4 text-lg">
          Website, App, Dashboard, Ecommerce, Branding –  
          hum sab kuch world-class quality mein banate hain.  
          Clients hamesha humare kaam se **over-satisfied** hote hain.
        </p>

        <div className="flex justify-center mt-6">
          <FaRocket className="text-red-500 text-5xl" />
        </div>
      </div>
    </div>
  );
};

export default Developer;
