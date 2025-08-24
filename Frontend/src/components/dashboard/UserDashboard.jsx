import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, Mail, Phone, Users, Package, DollarSign, FileText, Clock, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const [packageBookings, setPackageBookings] = useState([]);
    const [customizedBookings, setCustomizedBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState({});
    const navigate = useNavigate();

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Fetch user's bookings from DB
    const fetchUserPackageBookings = async () => {
        try {
            const token = getToken();
            if (!token) {
                toast.error("Please login to view your bookings");
                navigate('/auth');
                return;
            }

            const response = await fetch("http://localhost:5000/api/package-bookings/user", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    toast.error("Session expired. Please login again.");
                    navigate('/auth');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('User package bookings fetched:', data);
            setPackageBookings(data);
        } catch (error) {
            console.error('Error fetching user package bookings:', error);
            toast.error("Failed to fetch package bookings");
        }
    };

    const fetchUserCustomizedBookings = async () => {
        try {
            const token = getToken();
            if (!token) {
                toast.error("Please login to view your bookings");
                navigate('/auth');
                return;
            }

            const response = await fetch("http://localhost:5000/api/customized-bookings/user", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    toast.error("Session expired. Please login again.");
                    navigate('/auth');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('User customized bookings fetched:', data);
            setCustomizedBookings(data);
        } catch (error) {
            console.error('Error fetching user customized bookings:', error);
            toast.error("Failed to fetch customized bookings");
        }
    };

    // Fetch categories to map IDs to names
    const fetchCategories = async () => {
        try {
            const token = getToken();
            if (!token) {
                return;
            }

            const response = await fetch("http://localhost:5000/api/service-categories", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // Create a mapping of category ID to category name
                const categoryMap = {};
                data.forEach(category => {
                    categoryMap[category._id] = category.name;
                });
                setCategories(categoryMap);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const loadUserBookings = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchUserPackageBookings(), fetchUserCustomizedBookings(), fetchCategories()]);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserBookings();
    }, [navigate]);

    // Open booking details dialog
    const handleViewDetails = (booking, type) => {
        console.log('Selected booking:', booking, 'Type:', type);
        setSelectedBooking({ ...booking, type });
        setIsDetailsDialogOpen(true);
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return <Badge className={colors[status]}>{status}</Badge>;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleNavigateHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                            <p className="text-gray-600 mt-2">View your event booking history</p>
                        </div>
                        <Button
                            onClick={handleNavigateHome}
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <Home className="h-4 w-4" />
                            <span>Back to Home</span>
                        </Button>
                    </div>

                    {/* Booking Tabs */}
                    <Tabs defaultValue="package" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="package">Package Bookings</TabsTrigger>
                            <TabsTrigger value="customized">Customized Bookings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="package" className="space-y-4">
                            <Card>
                                {isLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading your package bookings...</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Event Details</TableHead>
                                                <TableHead>Package</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date Submitted</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {packageBookings.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                        No package bookings found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                packageBookings.map((booking) => (
                                                    <TableRow key={booking._id}>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="font-medium">{booking.eventType}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatDate(booking.eventDate)}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {booking.guestCount} guests
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="font-medium">{booking.packageName}</div>
                                                                <div className="text-sm text-gray-500">{booking.packagePrice}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(booking.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-gray-500">
                                                                {formatDate(booking.submittedAt)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(booking, 'package')}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </Card>
                        </TabsContent>

                        <TabsContent value="customized" className="space-y-4">
                            <Card>
                                {isLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading your customized bookings...</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Event Details</TableHead>
                                                <TableHead>Budget</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date Submitted</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customizedBookings.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                        No customized bookings found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                customizedBookings.map((booking) => (
                                                    <TableRow key={booking._id}>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="font-medium">{booking.eventType}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatDate(booking.eventDate)}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {booking.guestCount} guests
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{booking.budget}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(booking.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-gray-500">
                                                                {formatDate(booking.submittedAt)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(booking, 'customized')}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Booking Details Dialog */}
                    <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                            </DialogHeader>
                            
                            {selectedBooking && (
                                <div className="space-y-6">
                                    {/* Customer Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Customer Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">{selectedBooking.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span>{selectedBooking.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span>{selectedBooking.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-gray-500" />
                                                <span>{selectedBooking.guestCount} guests</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Event Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">{selectedBooking.eventType}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span>{formatDate(selectedBooking.eventDate)}</span>
                                            </div>
                                            {selectedBooking.type === 'package' && (
                                                <>
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">{selectedBooking.packageName}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                                        <span>{selectedBooking.packagePrice}</span>
                                                    </div>
                                                </>
                                            )}
                                            {selectedBooking.type === 'customized' && (
                                                <>
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">Budget: {selectedBooking.budget}</span>
                                                    </div>
                                                    {selectedBooking.hasNegotiated && (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-blue-600 font-medium">✓ Budget Negotiated</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    {selectedBooking.specialRequests && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">Special Requests</h3>
                                            <div className="flex items-start space-x-2">
                                                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                                                <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Selected Services */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            {selectedBooking.type === 'package' ? 'Package Services' : 'Selected Services'}
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedBooking.type === 'package' ? (
                                                // Display package services
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Package className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">{selectedBooking.packageName}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <p><strong>Price:</strong> {selectedBooking.packagePrice}</p>
                                                        <p><strong>Package includes:</strong></p>
                                                        <ul className="list-disc list-inside mt-1 ml-4">
                                                            <li>Complete event planning and coordination</li>
                                                            <li>Professional event management</li>
                                                            <li>Venue setup and decoration</li>
                                                            <li>Catering services</li>
                                                            <li>Photography and videography</li>
                                                            <li>Entertainment arrangements</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Display customized services
                                                selectedBooking.selectedServices ? (
                                                    <div className="space-y-3">
                                                        {Object.entries(selectedBooking.selectedServices).map(([categoryId, services]) => (
                                                            <div key={categoryId} className="bg-gray-50 p-4 rounded-lg">
                                                                <h4 className="font-medium text-gray-700 mb-2">
                                                                    {categories[categoryId] || categoryId}
                                                                </h4>
                                                                <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                                                                    {Array.isArray(services) ? (
                                                                        services.map((service, index) => (
                                                                            <li key={index}>
                                                                                {typeof service === 'string' ? service : service.name}
                                                                                {typeof service === 'object' && service.price && (
                                                                                    <span className="text-gray-500 ml-2">
                                                                                        (PKR {service.price})
                                                                                    </span>
                                                                                )}
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li>{services}</li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <p className="text-gray-600">No specific services selected</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Admin Notes (if any) */}
                                    {selectedBooking.adminNotes && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">Admin Notes</h3>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-blue-800">{selectedBooking.adminNotes}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Close Button */}
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDetailsDialogOpen(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 