import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 border-b pb-2">About Us</h1>

        <p className="text-lg mb-4">
          Welcome to our platform! We are a passionate team dedicated to building innovative and reliable solutions to real-world problems. Our mission is to create user-friendly, scalable, and modern applications that empower individuals and businesses.
        </p>

        <p className="text-lg mb-4">
          With a commitment to excellence and a focus on customer satisfaction, we continuously strive to improve our services. Whether it's through technology, design, or user experience, we believe in making a positive impact.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Vision</h2>
        <p className="text-lg mb-4">
          To be a trusted leader in the tech industry, known for innovation, integrity, and service quality.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Meet the Team</h2>
        <dl className="list-disc pl-5 space-y-2 text-lg">
          <li>Rishika Raj – CEO & Founder</li>
          <li>Diksha Singh – Lead Developer</li>
          <li>Sushmitha – UX Designer</li>
        </dl>
      </div>
    </div>
  );
};

export default AboutUs;
