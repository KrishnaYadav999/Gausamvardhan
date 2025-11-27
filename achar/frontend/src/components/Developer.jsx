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
      "A highly skilled Full Stack MERN Developer capable of building complete, scalable, and production-ready applications. Expert in frontend development, backend architecture, REST APIs, authentication systems, database structuring, and performance optimization. Known for solving complex bugs quickly and delivering clean, maintainable code with strong technical quality.",
    skills: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "GSAP",
      "API Integration",
      "Backend Logic",
      "Performance Optimization",
      "Animations",
      "Boostrap5",
      "Git",
      "GitHUB",
    ],
  },
  {
    name: "Aniket Singh",
    role: "Full Stack MERN Developer",
    phone: "+91 8830730929",
    email: "ani23june@gmail.com",
    linkedin: "https://www.linkedin.com/in/aniket-singh-b209792b8",
    portfolio: "https://portfolio-4-8gnu.onrender.com",
    description:
      "A highly skilled Full Stack MERN Developer capable of building complete, scalable, and production-ready applications. Expert in frontend development, backend architecture, REST APIs, authentication systems, database structuring, and performance optimization. Known for solving complex bugs quickly and delivering clean, maintainable code with strong technical quality.",
    skills: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "GSAP",
      "API Integration",
      "Backend Logic",
      "Performance Optimization",
      "Git",
      "GitHUB",
      "Cloud Deployment",
    ],
  },
  {
    name: "Vivek Prajapati",
    role: "Cloud Engineer & Cybersecurity Specialist",
    description:
      "Expert in cloud infrastructure, cybersecurity, secure authentication systems, and scalable backend architecture. Ensures applications remain secure, stable, and optimized for high performance. Skilled in API security, server hardening, and cloud-based deployments.",
    skills: [
      "Cloud Architecture",
      "Cybersecurity",
      "Node.js",
      "MongoDB",
      "JWT Auth",
      "Git",
      "Server Optimization",
      "API Security",
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
        We are a team of three developers working with one mission —{" "}
        <span className="font-semibold text-blue-700">
          to help businesses in India grow and succeed in the digital world.
        </span>
        <br />
        Our work quality is consistently world-class, and clients trust us
        because we deliver strong, reliable, and high-performance solutions
        every time.
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

            {/* Contact Info */}
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
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                  >
                    <FaLinkedin /> LinkedIn Profile
                  </a>
                )}

                {dev.portfolio && (
                  <a
                    href={dev.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
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
          Website, App, Dashboard, Ecommerce, Branding – hum sab kuch world-class
          quality mein banate hain. Clients hamesha humare kaam se{" "}
          <strong>over-satisfied</strong> hote hain.
        </p>

        <div className="flex justify-center mt-6">
          <FaRocket className="text-red-500 text-5xl" />
        </div>
      </div>
    </div>
  );
};

export default Developer;
