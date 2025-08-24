import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Users, ArrowRight } from 'lucide-react';

const Hero = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 py-20">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />

            {/* Geometric shapes */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
                <div className="mb-8 pt-16">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
                        Create Extraordinary
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400">
                            Events
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
                        Transform your vision into reality with our intelligent event planning platform.
                        Customize every detail, get instant quotes, and create unforgettable experiences effortlessly.
                    </p>
                </div>

                {/* Statistics */}
                <div className="flex flex-wrap justify-center gap-8 mb-12">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
                        <Star className="text-yellow-400" size={28} />
                        <div className="text-left">
                            <div className="text-white font-bold text-xl">500+</div>
                            <div className="text-blue-200 text-sm">Successful Events</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
                        <Users className="text-green-400" size={28} />
                        <div className="text-left">
                            <div className="text-white font-bold text-xl">1000+</div>
                            <div className="text-blue-200 text-sm">Happy Clients</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
                        <Calendar className="text-blue-400" size={28} />
                        <div className="text-left">
                            <div className="text-white font-bold text-xl">24/7</div>
                            <div className="text-blue-200 text-sm">Support Available</div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                        onClick={() => scrollToSection('services')}
                        size="lg"
                        className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-xl font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                        Start Planning Your Event
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>

                    <Button
                        onClick={() => scrollToSection('deals')}
                        variant="outline"
                        size="lg"
                        className="border-2 border-white/60 text-white bg-white/20 px-10 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                    >
                        View Packages
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
