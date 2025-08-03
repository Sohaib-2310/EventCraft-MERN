import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import emailjs from 'emailjs-com';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';


const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send email via EmailJS
            // await emailjs.send(
            //     'service_dbk69bn',      // serviceID
            //     'template_n1oo4v6',     // templateID
            //     formData,
            //     'dNiRqW19iEm3Wxm7k'     // public key from EmailJS
            // );

            // Send data to backend API
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.success) throw new Error('Failed to store message');

            toast.success("Message Sent Successfully!");
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            content: "muhammadsohaib8008@gmail.com",
            link: "mailto:muhammadsohaib8008@gmail.com"
        },
        {
            icon: Phone,
            title: "Phone",
            content: "+92-311-4413304",
            link: "tel:+923114413304"
        },
        {
            icon: MapPin,
            title: "Address",
            content: "St# 07, Bhassar Pura, Kasur, Punjab, Pakistan",
            link: "https://maps.google.com/?q=Kasur,Punjab,Pakistan"
        },
        {
            icon: Clock,
            title: "Business Hours",
            content: "Mon - Sat\n09:00 AM - 06:00 PM",
            link: null
        }
    ];

    return (
        <section id="contact" className="py-20 px-6 bg-gradient-to-br from-slate-900 to-purple-900">
            <Toaster position="bottom-right" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Touch</span>
                    </h2>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        Ready to plan your dream event? Contact us today and let's bring your vision to life.
                        Our team is here to help you every step of the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-8">Let's Connect</h3>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                Whether you're planning an intimate gathering or a grand celebration,
                                we're here to make your event extraordinary. Reach out to us through
                                any of the following channels.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {contactInfo.map((info, index) => {
                                const IconComponent = info.icon;
                                return (
                                    <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                                        <CardContent className="p-1 px-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex-shrink-0">
                                                    <IconComponent size={24} className="text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-lg mb-2">{info.title}</h4>
                                                    {info.link ? (
                                                        <a
                                                            href={info.link}
                                                            className="text-blue-200 hover:text-white transition-colors break-words"
                                                            target={info.link.startsWith('http') ? '_blank' : undefined}
                                                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        >
                                                            {info.content.split('\n').map((line, idx) => (
                                                                <div key={idx}>{line}</div>
                                                            ))}
                                                        </a>
                                                    ) : (
                                                        <div className="text-blue-200">
                                                            {info.content.split('\n').map((line, idx) => (
                                                                <div key={idx}>{line}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-white">Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="text-white mb-1">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-white mb-1">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-white mb-1">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="subject" className="text-white mb-1">Subject</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message" className="text-white mb-1">Message *</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={5}
                                        className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                        placeholder="Tell us about your event or any questions you have..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                                >
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Contact;
