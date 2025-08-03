import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServiceModal from './ServiceModal';
import ConfirmDialog from './ConfirmDialog';
import toast from 'react-hot-toast';

const ServicesUpdateSection = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // Fetch services from DB
    const fetchServices = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/services");
            const data = await response.json();
            setServices(data);
        } catch (error) {
            toast.error("Failed to fetch services");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Open modal for adding new service
    const handleAddService = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    // Open modal for editing service
    const handleEditService = (service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    // Handle save (create or update)
    const handleSaveService = async (serviceData) => {
        try {
            if (editingService) {
                // Update existing service
                await fetch(`${"http://localhost:5000/api/services"}/${editingService._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(serviceData)
                });
                toast.success("Service updated successfully");
            } else {
                // Create new service
                await fetch("http://localhost:5000/api/services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(serviceData)
                });
                toast.success("Service added successfully");
            }
            fetchServices();
        } catch (error) {
            toast.error(editingService ? "Failed to update service" : "Failed to add service");
        }
    };

    // Handle delete confirmation
    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setIsDeleteDialogOpen(true);
    };

    // Handle actual deletion
    const handleConfirmDelete = async () => {
        try {
            await fetch(`${"http://localhost:5000/api/services"}/${serviceToDelete._id}`, { 
                method: "DELETE" 
            });
            toast.success("Service removed successfully");
            fetchServices();
            setIsDeleteDialogOpen(false);
            setServiceToDelete(null);
        } catch (error) {
            toast.error("Failed to remove service");
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Services Management</h2>
                <Button onClick={handleAddService}>
                    Add New Service
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Features</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service._id}>
                                <TableCell>
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {service.icon?.charAt(0) || "S"}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{service.title}</TableCell>
                                <TableCell>
                                    <div className="max-w-xs truncate" title={service.description}>
                                        {service.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {service.features.slice(0, 3).map((feature, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                        {service.features.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{service.features.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditService(service)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteClick(service)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {services.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No services found. Add your first service to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Service Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                service={editingService}
                onSave={handleSaveService}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setServiceToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Service"
                description={`Are you sure you want to delete "${serviceToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default ServicesUpdateSection;
