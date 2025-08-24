import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Star, Crown, Zap } from 'lucide-react';
import emailjs from 'emailjs-com';

const Deals = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    specialRequests: ''
  });

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/deals');
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      
      // Transform API data to match the UI structure
      const transformedPackages = data.map((pkg, index) => {
        const icons = [Zap, Star, Crown];
        const colors = [
          'from-green-500 to-emerald-500',
          'from-blue-500 to-cyan-500', 
          'from-purple-500 to-pink-500'
        ];
        
        return {
          id: pkg._id,
          name: pkg.name,
          price: pkg.price,
          icon: icons[index % icons.length],
          color: colors[index % colors.length],
          popular: index === 1, // Make second package popular
          features: pkg.services || [],
          description: pkg.description || ''
        };
      });
      
      setPackages(transformedPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBookPackage = (packageId) => {
    setSelectedPackage(packageId);
    setShowBookingForm(true);
  };

  const submitBooking = async () => {
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

    const payload = {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      eventType: bookingData.eventType,
      eventDate: bookingData.eventDate,
      guestCount: bookingData.guestCount,
      specialRequests: bookingData.specialRequests || 'No special requests provided.',
      packageName: selectedPkg?.name,
      packagePrice: `PKR ${selectedPkg?.price.toLocaleString()}`
    };

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a package');
        return;
      }

      // Backend
      await fetch('http://localhost:5000/api/package-bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      toast.success(`Your ${selectedPkg?.name} has been booked. We'll contact you within 24 hours.`);
      setShowBookingForm(false);
      setBookingData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        guestCount: '',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <section id="deals" className="py-20 px-6 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Choose Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Package</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Loading packages...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="deals" className="py-20 px-6 bg-gradient-to-br from-slate-900 to-purple-900">
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Choose Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Package</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Pre-designed packages for every budget and occasion. Get everything you need
            for an unforgettable event at unbeatable prices.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg">No packages available at the moment.</div>
            <div className="text-white/40 text-sm mt-2">Please check back later or contact us for custom packages.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const IconComponent = pkg.icon;
              return (
                <Card key={pkg.id} className={`relative overflow-hidden border-0 shadow-2xl transform hover:scale-105 transition-all duration-300 ${pkg.popular ? 'ring-4 ring-yellow-400' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-90`} />

                  <CardHeader className="relative z-10 text-center text-white pt-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <IconComponent size={36} className="text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold mb-2">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold mb-4">
                      PKR {pkg.price.toLocaleString()}
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 text-white px-8 pb-8">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.length > 0 ? (
                        pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <Check size={20} className="text-green-300 flex-shrink-0" />
                            <span className="text-white/90">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-white/60 italic">No features listed</li>
                      )}
                    </ul>

                    <Button
                      onClick={() => handleBookPackage(pkg.id)}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 py-3 text-lg font-semibold rounded-full transition-all duration-300"
                    >
                      Book This Package
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Book {packages.find(pkg => pkg.id === selectedPackage)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  required
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Input
                  id="eventType"
                  value={bookingData.eventType}
                  onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                  placeholder="e.g., Wedding, Corporate, Birthday"
                  required
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Preferred Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={bookingData.eventDate}
                  onChange={(e) => setBookingData({ ...bookingData, eventDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guestCount">Expected Guest Count *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={bookingData.guestCount}
                  onChange={(e) => setBookingData({ ...bookingData, guestCount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="requests">Special Requests</Label>
                <Textarea
                  id="requests"
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  placeholder="Any special requirements or customizations..."
                />
              </div>
              <Button
                onClick={submitBooking}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.eventType || !bookingData.eventDate || !bookingData.guestCount}
              >
                Confirm Package Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Deals;