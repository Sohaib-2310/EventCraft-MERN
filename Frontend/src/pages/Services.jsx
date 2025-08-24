import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EventCustomizer from './EventCustomizer.jsx';
import * as LucideIcons from 'lucide-react';

const Services = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [services, setServices] = useState([]);
  const customizerRef = useRef(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // Scroll to customizer
  useEffect(() => {
    if (showCustomizer && customizerRef.current) {
      const offset = -65;
      const top = customizerRef.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [showCustomizer]);

  return (
    <>
      {!showCustomizer ? (
        <section id="services" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Services
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From intimate gatherings to grand celebrations, we provide comprehensive event management
                services tailored to your unique vision and requirements.
              </p>
            </div>

            {/* Dynamic Services from DB */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {services.length > 0 ? (
                services.map((service, index) => {
                  const IconComponent = LucideIcons[service.icon] || LucideIcons.Building; 
                  return (
                    <Card
                      key={index}
                      className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="text-white" size={28} />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {service.features.map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center text-gray-600 col-span-full">No services available</p>
              )}
            </div>

            <div className="text-center">
              <Button
                onClick={() => setShowCustomizer(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Customizing Your Event
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <div ref={customizerRef}>
          <EventCustomizer onBack={() => setShowCustomizer(false)} />
        </div>
      )}
    </>
  );
};

export default Services;
