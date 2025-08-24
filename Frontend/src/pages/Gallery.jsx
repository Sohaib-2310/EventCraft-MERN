import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Gallery = () => {
  const events = [
    {
      title: "Elegant Wedding Ceremony",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=300&fit=crop",
      category: "Wedding"
    },
    {
      title: "Corporate Conference",
      image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500&h=300&fit=crop",
      category: "Corporate"
    },
    {
      title: "Birthday Celebration",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=300&fit=crop",
      category: "Birthday"
    },
    {
      title: "Garden Party",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop",
      category: "Social"
    },
    {
      title: "Gala Dinner",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=300&fit=crop",
      category: "Corporate"
    },
    {
      title: "Anniversary Celebration",
      image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=500&h=300&fit=crop",
      category: "Anniversary"
    }
  ];

  return (
    <section id="gallery" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Success Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take a look at some of the memorable events we've crafted. Each celebration tells
            a unique story of joy, elegance, and unforgettable moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-54 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2 w-fit">
                      {event.category}
                    </div>
                    <h3 className="text-white font-bold text-lg">{event.title}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to create your own success story?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Planning
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Get Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
