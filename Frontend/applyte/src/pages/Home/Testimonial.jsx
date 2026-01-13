import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    image: "👩‍💻",
    content: "APPLYTE helped me land my dream job at Google. The AI cover letters were so personalized that recruiters thought I spent hours on each one!",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "Microsoft",
    image: "👨‍💼",
    content: "From 0 interviews to 5 offers in 3 weeks. The resume optimization and job matching features are absolutely game-changing.",
    rating: 5
  },
  {
    name: "Emily Johnson",
    role: "Data Scientist",
    company: "Amazon",
    image: "👩‍🔬",
    content: "The AI interview coach prepared me so well that I aced all my technical rounds. Worth every penny!",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Frontend Developer",
    company: "Netflix",
    image: "👨‍🎨",
    content: "I was struggling with ATS systems for months. APPLYTE optimized my resume and I started getting callbacks immediately.",
    rating: 5
  },
  {
    name: "Jessica Williams",
    role: "UX Designer",
    company: "Meta",
    image: "👩‍🎨",
    content: "The cover letter generator saved me 10+ hours per week. Landed 3 offers with perfectly tailored applications.",
    rating: 5
  },
  {
    name: "Alex Thompson",
    role: "DevOps Engineer",
    company: "Spotify",
    image: "👨‍💻",
    content: "Went from unemployed to my highest-paying job ever. The job matching algorithm found opportunities I never would have discovered.",
    rating: 5
  }
];

const Testimonial = () => {
  return (
    <div className="relative py-24 bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(60,60,60,0.2),transparent_70%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Trusted by
            <span className="block bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
              Job Seekers
            </span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Join thousands of successful candidates who landed their dream jobs using APPLYTE.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-all duration-500 overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-12 h-12 text-gray-400" />
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{testimonial.image}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-gray-700/5 via-gray-600/3 to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-400 text-sm">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-gray-400 text-sm">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">2.1x</div>
            <div className="text-gray-400 text-sm">More Interviews</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">4.8/5</div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-3 bg-white text-black font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] text-sm">
            Join Success Stories
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Start your journey today with our 14-day free trial
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;