import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const AvailabilityUpdateSection = () => {
  const [availability, setAvailability] = useState({
    availableDates: [],
    bookedDates: []
  });
  const [newAvailableDate, setNewAvailableDate] = useState('');
  const [newBookedDate, setNewBookedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch availability from API
  const fetchAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/availability');
      if (!response.ok) throw new Error('Failed to fetch availability');
      const data = await response.json();
      
      // Convert date strings to proper format for display
      const formatDates = (dates) => {
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      };
      
      setAvailability({
        availableDates: formatDates(data.availableDates),
        bookedDates: formatDates(data.bookedDates)
      });
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const addAvailableDate = async () => {
    if (!newAvailableDate) return toast.error("Please select a date first.");

    if (availability.availableDates.includes(newAvailableDate)) {
      return toast.error("This date is already in the available list.");
    }

    if (availability.bookedDates.includes(newAvailableDate)) {
      return toast.error("This date is already booked. Remove it from booked dates first.");
    }

    try {
      const response = await fetch('http://localhost:5000/api/availability/available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newAvailableDate })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add available date');
      }

      const data = await response.json();
      const formatDates = (dates) => {
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      };
      
      setAvailability({
        availableDates: formatDates(data.availableDates),
        bookedDates: formatDates(data.bookedDates)
      });
      setNewAvailableDate('');
      toast.success("Available date has been added successfully.");
    } catch (error) {
      console.error('Error adding available date:', error);
      toast.error(error.message);
    }
  };

  const removeAvailableDate = async (dateToRemove) => {
    try {
      const response = await fetch(`http://localhost:5000/api/availability/available/${dateToRemove}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove available date');

      const data = await response.json();
      const formatDates = (dates) => {
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      };
      
      setAvailability({
        availableDates: formatDates(data.availableDates),
        bookedDates: formatDates(data.bookedDates)
      });
      toast.success("Available date has been removed successfully.");
    } catch (error) {
      console.error('Error removing available date:', error);
      toast.error('Failed to remove available date');
    }
  };

  const addBookedDate = async () => {
    if (!newBookedDate) return toast.error("Please select a date first.");

    if (availability.bookedDates.includes(newBookedDate)) {
      return toast.error("This date is already in the booked list.");
    }

    if (availability.availableDates.includes(newBookedDate)) {
      return toast.error("This date is already available. Remove it from available dates first.");
    }

    try {
      const response = await fetch('http://localhost:5000/api/availability/booked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBookedDate })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add booked date');
      }

      const data = await response.json();
      const formatDates = (dates) => {
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      };
      
      setAvailability({
        availableDates: formatDates(data.availableDates),
        bookedDates: formatDates(data.bookedDates)
      });
      setNewBookedDate('');
      toast.success("Booked date has been added successfully.");
    } catch (error) {
      console.error('Error adding booked date:', error);
      toast.error(error.message);
    }
  };

  const removeBookedDate = async (dateToRemove) => {
    try {
      const response = await fetch(`http://localhost:5000/api/availability/booked/${dateToRemove}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove booked date');

      const data = await response.json();
      const formatDates = (dates) => {
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      };
      
      setAvailability({
        availableDates: formatDates(data.availableDates),
        bookedDates: formatDates(data.bookedDates)
      });
      toast.success("Booked date has been removed successfully.");
    } catch (error) {
      console.error('Error removing booked date:', error);
      toast.error('Failed to remove booked date');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Availability Management</h2>
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading availability data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Availability Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Available Dates Section */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {availability.availableDates.length}
              </Badge>
              Available Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {availability.availableDates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No available dates set
                </div>
              ) : (
                availability.availableDates.map((date, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                    <span className="font-medium">{date}</span>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeAvailableDate(date)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-2">
              <Input 
                type="date" 
                value={newAvailableDate}
                onChange={(e) => setNewAvailableDate(e.target.value)}
              />
              <Button size="sm" onClick={addAvailableDate} className="w-full">
                Add Available Date
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Booked Dates Section */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {availability.bookedDates.length}
              </Badge>
              Booked Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {availability.bookedDates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No booked dates set
                </div>
              ) : (
                availability.bookedDates.map((date, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
                    <span className="font-medium">{date}</span>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeBookedDate(date)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-2">
              <Input 
                type="date" 
                value={newBookedDate}
                onChange={(e) => setNewBookedDate(e.target.value)}
              />
              <Button size="sm" onClick={addBookedDate} className="w-full">
                Add Booked Date
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityUpdateSection;