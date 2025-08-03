import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, Mail, Phone, Users, Package, Coins, FileText, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingsManagementSection = () => {
    const [packageBookings, setPackageBookings] = useState([]);
    const [customizedBookings, setCustomizedBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [categories, setCategories] = useState({});

    // Fetch bookings from DB
    const fetchPackageBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to access admin dashboard");
                return;
            }

            const response = await fetch("http://localhost:5000/api/package-bookings", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                if (response.status === 403) {
                    toast.error("Access denied. Admin only.");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Package bookings fetched:', data);
            setPackageBookings(data);
        } catch (error) {
            console.error('Error fetching package bookings:', error);
            toast.error("Failed to fetch package bookings");
        }
    };

    const fetchCustomizedBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to access admin dashboard");
                return;
            }

            const response = await fetch("http://localhost:5000/api/customized-bookings", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                if (response.status === 403) {
                    toast.error("Access denied. Admin only.");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Customized bookings fetched:', data);
            setCustomizedBookings(data);
        } catch (error) {
            console.error('Error fetching customized bookings:', error);
            toast.error("Failed to fetch customized bookings");
        }
    };

    // Fetch categories to map IDs to names
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
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
        const loadBookings = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchPackageBookings(), fetchCustomizedBookings(), fetchCategories()]);
            } finally {
                setIsLoading(false);
            }
        };
        loadBookings();
    }, []);

    // Handle status update
    const handleStatusUpdate = async (bookingId, newStatus, bookingType) => {
        try {
            const endpoint = bookingType === 'package' 
                ? `http://localhost:5000/api/package-bookings/${bookingId}`
                : `http://localhost:5000/api/customized-bookings/${bookingId}`;

            console.log('Updating booking:', { bookingId, newStatus, bookingType, endpoint });

            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    status: newStatus, 
                    adminNotes: adminNotes 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Update result:', result);

            toast.success(`Booking ${newStatus} successfully`);
            
            // Refresh data
            if (bookingType === 'package') {
                fetchPackageBookings();
            } else {
                fetchCustomizedBookings();
            }
            
            setIsDetailsDialogOpen(false);
            setSelectedBooking(null);
            setAdminNotes('');
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error(`Failed to ${newStatus} booking`);
        }
    };

    // Open booking details dialog
    const handleViewDetails = (booking, type) => {
        console.log('Selected booking:', booking, 'Type:', type);
        setSelectedBooking({ ...booking, type });
        setAdminNotes(booking.adminNotes || '');
        setIsDetailsDialogOpen(true);
    };

    // Handle delete booking
    const handleDeleteBooking = async (bookingId, bookingType) => {
        try {
            const endpoint = bookingType === 'package' 
                ? `http://localhost:5000/api/package-bookings/${bookingId}`
                : `http://localhost:5000/api/customized-bookings/${bookingId}`;

            console.log('Deleting booking:', { bookingId, bookingType, endpoint });

            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Delete result:', result);

            toast.success('Booking deleted successfully');
            
            // Refresh data
            if (bookingType === 'package') {
                fetchPackageBookings();
            } else {
                fetchCustomizedBookings();
            }
            
            setIsDeleteDialogOpen(false);
            setBookingToDelete(null);
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking');
        }
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (booking, type) => {
        setBookingToDelete({ ...booking, type });
        setIsDeleteDialogOpen(true);
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Bookings Management</h2>
            </div>

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
                                <p className="mt-2 text-gray-600">Loading package bookings...</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
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
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                No package bookings found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        packageBookings.map((booking) => (
                                            <TableRow key={booking._id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{booking.name}</div>
                                                        <div className="text-sm text-gray-500">{booking.email}</div>
                                                        <div className="text-sm text-gray-500">{booking.phone}</div>
                                                    </div>
                                                </TableCell>
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
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(booking, 'package')}
                                                        >
                                                            View Details
                                                        </Button>
                                                        {booking.status === 'rejected' && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(booking, 'package')}
                                                                className="flex items-center space-x-1"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                                <span>Delete</span>
                                                            </Button>
                                                        )}
                                                    </div>
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
                                <p className="mt-2 text-gray-600">Loading customized bookings...</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
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
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                No customized bookings found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        customizedBookings.map((booking) => (
                                    <TableRow key={booking._id}>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">{booking.name}</div>
                                                <div className="text-sm text-gray-500">{booking.email}</div>
                                                <div className="text-sm text-gray-500">{booking.phone}</div>
                                            </div>
                                        </TableCell>
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
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(booking, 'customized')}
                                                >
                                                    View Details
                                                </Button>
                                                {booking.status === 'rejected' && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(booking, 'customized')}
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        <span>Delete</span>
                                                    </Button>
                                                )}
                                            </div>
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
                                                <Coins className="h-4 w-4 text-gray-500" />
                                                <span>{selectedBooking.packagePrice}</span>
                                            </div>
                                        </>
                                    )}
                                    {selectedBooking.type === 'customized' && (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                <Coins className="h-4 w-4 text-gray-500" />
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

                            {/* Admin Notes */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Admin Notes</h3>
                                <Textarea
                                    placeholder="Add notes about this booking..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 pt-4">
                                {selectedBooking.status === 'pending' && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedBooking._id, 'approved', selectedBooking.type)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedBooking._id, 'rejected', selectedBooking.type)}
                                            variant="destructive"
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                                {selectedBooking.status === 'approved' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedBooking._id, 'approved', selectedBooking.type)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Update Notes
                                    </Button>
                                )}
                                {selectedBooking.status === 'rejected' && (
                                    <Button
                                        onClick={() => handleDeleteClick(selectedBooking, selectedBooking.type)}
                                        variant="destructive"
                                        className="flex items-center space-x-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete Booking</span>
                                    </Button>
                                )}
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            <span>Delete Booking</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    {bookingToDelete && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to permanently delete this booking?
                                </p>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="font-medium text-red-800">
                                        Customer: {bookingToDelete.name}
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Event: {bookingToDelete.eventType} on {formatDate(bookingToDelete.eventDate)}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    This action cannot be undone.
                                </p>
                            </div>
                            
                            <div className="flex space-x-2 pt-4">
                                <Button
                                    onClick={() => handleDeleteBooking(bookingToDelete._id, bookingToDelete.type)}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    Delete Permanently
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingsManagementSection; 