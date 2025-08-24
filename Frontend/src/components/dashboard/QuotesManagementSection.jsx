import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, User, Calendar, MessageSquare, Trash2, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const QuotesManagementSection = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState(null);

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Fetch all contact form submissions
    const fetchQuotes = async () => {
        try {
            setIsLoading(true);
            const token = getToken();
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const response = await fetch("http://localhost:5000/api/contact", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    toast.error("Access denied. Admin privileges required.");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setQuotes(data);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            toast.error("Failed to fetch contact form submissions");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a quote
    const handleDeleteQuote = async (quoteId) => {
        try {
            setIsDeleting(true);
            const token = getToken();
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/contact/${quoteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                toast.success("Contact form submission deleted successfully");
                setQuotes(quotes.filter(quote => quote._id !== quoteId));
                setIsDetailsDialogOpen(false);
                setIsDeleteDialogOpen(false);
                setQuoteToDelete(null);
            } else {
                toast.error(data.message || "Failed to delete submission");
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            toast.error("Failed to delete contact form submission");
        } finally {
            setIsDeleting(false);
        }
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (quote) => {
        setQuoteToDelete(quote);
        setIsDeleteDialogOpen(true);
    };

    // Open quote details dialog
    const handleViewDetails = (quote) => {
        setSelectedQuote(quote);
        setIsDetailsDialogOpen(true);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get time ago
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const submittedDate = new Date(dateString);
        const diffInHours = Math.floor((now - submittedDate) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks}w ago`;
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Form Submissions</h1>
                    <p className="text-gray-600 mt-2">Manage customer inquiries and quote requests</p>
                </div>
                <Button
                    onClick={fetchQuotes}
                    variant="outline"
                    className="flex items-center space-x-2"
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{quotes.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {quotes.filter(quote => {
                                const weekAgo = new Date();
                                weekAgo.setDate(weekAgo.getDate() - 7);
                                return new Date(quote.submittedAt) > weekAgo;
                            }).length}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {quotes.filter(quote => {
                                const today = new Date();
                                const quoteDate = new Date(quote.submittedAt);
                                return quoteDate.toDateString() === today.toDateString();
                            }).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quotes Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading submissions...</span>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No contact form submissions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    quotes.map((quote) => (
                                        <TableRow key={quote._id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{quote.name}</div>
                                                    <div className="text-sm text-gray-500">{quote.email}</div>
                                                    {quote.phone && (
                                                        <div className="text-sm text-gray-500">{quote.phone}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <div className="font-medium truncate">
                                                        {quote.subject || 'No subject'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {quote.message.substring(0, 50)}...
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm">{formatDate(quote.submittedAt)}</div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {getTimeAgo(quote.submittedAt)}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">New</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(quote)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(quote)}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Quote Details Dialog */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Contact Form Submission Details</DialogTitle>
                    </DialogHeader>
                    
                    {selectedQuote && (
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Customer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">{selectedQuote.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{selectedQuote.email}</span>
                                    </div>
                                    {selectedQuote.phone && (
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span>{selectedQuote.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span>{formatDate(selectedQuote.submittedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Subject */}
                            {selectedQuote.subject && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Subject</h3>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        {selectedQuote.subject}
                                    </p>
                                </div>
                            )}

                            {/* Message */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Message</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedQuote.message}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteClick(selectedQuote)}
                                    disabled={isDeleting}
                                    className="flex items-center space-x-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                </Button>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(`mailto:${selectedQuote.email}`, '_blank')}
                                    >
                                        Reply via Email
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDetailsDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
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
                            <span>Delete Quote</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    {quoteToDelete && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to permanently delete this contact form submission?
                                </p>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="font-medium text-red-800">
                                        Customer: {quoteToDelete.name}
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Subject: {quoteToDelete.subject || 'No subject'}
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Email: {quoteToDelete.email}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    This action cannot be undone.
                                </p>
                            </div>
                            
                            <div className="flex space-x-2 pt-4">
                                <Button
                                    onClick={() => handleDeleteQuote(quoteToDelete._id)}
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    className="flex-1"
                                    disabled={isDeleting}
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

export default QuotesManagementSection;