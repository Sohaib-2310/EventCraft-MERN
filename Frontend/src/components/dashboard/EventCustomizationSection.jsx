import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServiceOptionModal from './ServiceOptionModal';
import CategoryModal from './CategoryModal';
import ConfirmDialog from './ConfirmDialog';
import toast from 'react-hot-toast';

const EventCustomizationSection = () => {
    const [serviceCategories, setServiceCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'service' or 'category'
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedCategoryTitle, setEditedCategoryTitle] = useState('');
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/service-categories');
            const data = await response.json();
            setServiceCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Failed to load service categories.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Toggle category expansion
    const toggleCategoryExpansion = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    // Open modal for adding new service
    const handleAddService = (category) => {
        setCurrentCategory(category);
        setEditingService(null);
        setIsModalOpen(true);
    };

    // Open modal for editing service
    const handleEditService = (service, category) => {
        setCurrentCategory(category);
        setEditingService(service);
        setIsModalOpen(true);
    };

    // Handle save service (create or update)
    const handleSaveService = async (serviceData) => {
        try {
            if (editingService) {
                // Update existing service
                const response = await fetch(`http://localhost:5000/api/service-categories/${currentCategory._id}/options/${editingService._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData),
                });
                if (!response.ok) throw new Error("Failed to update service");
                toast.success("Service updated successfully.");
            } else {
                // Create new service
                const response = await fetch(`http://localhost:5000/api/service-categories/${currentCategory._id}/options`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData),
                });
                if (!response.ok) throw new Error("Failed to add service");
                toast.success("Service added successfully.");
            }
            fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Handle delete confirmation
    const handleDeleteClick = (item, type, category = null) => {
        setItemToDelete(item);
        setDeleteType(type);
        setIsDeleteDialogOpen(true);
    };

    // Handle actual deletion
    const handleConfirmDelete = async () => {
        try {
            if (deleteType === 'service') {
                const response = await fetch(`http://localhost:5000/api/service-categories/${itemToDelete.categoryId}/options/${itemToDelete._id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error("Failed to remove service");
                toast.success("Service removed successfully.");
            } else if (deleteType === 'category') {
                const response = await fetch(`http://localhost:5000/api/service-categories/${itemToDelete._id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error("Failed to remove category");
                toast.success("Category removed successfully.");
            }
            fetchCategories();
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
            setDeleteType('');
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Edit category title
    const handleEditCategory = (category) => {
        setEditingCategory(category._id);
        setEditedCategoryTitle(category.name);
    };

    const handleUpdateCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/service-categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editedCategoryTitle }),
            });
            if (!response.ok) throw new Error("Failed to update category");
            toast.success("Category updated successfully.");
            setEditingCategory(null);
            setEditedCategoryTitle('');
            fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancelCategoryEdit = () => {
        setEditingCategory(null);
        setEditedCategoryTitle('');
    };

    // Open category modal
    const handleAddCategory = () => {
        setIsCategoryModalOpen(true);
    };

    // Handle save category
    const handleSaveCategory = async (categoryData) => {
        try {
            const response = await fetch('http://localhost:5000/api/service-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData),
            });
            if (!response.ok) throw new Error("Failed to add category");
            toast.success("New category added successfully.");
            fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Close modals
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setCurrentCategory(null);
    };

    const handleCloseCategoryModal = () => {
        setIsCategoryModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Event Customization Services</h2>
                <Button onClick={handleAddCategory} variant="outline">
                    Add New Category
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Category/Service Name</TableHead>
                            <TableHead>Price (PKR)</TableHead>
                            <TableHead>Margin (PKR)</TableHead>
                            <TableHead>Pricing Type</TableHead>
                            <TableHead>Options</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serviceCategories.map((category) => {
                            const isEditingCategoryTitle = editingCategory === category._id;
                            const isExpanded = expandedCategories.has(category._id);
                            const hasServices = category.options.length > 0;

                            return (
                                <React.Fragment key={category._id}>
                                    {/* Category Row */}
                                    <TableRow className="bg-gray-50 hover:bg-gray-100">
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleCategoryExpansion(category._id)}
                                                disabled={!hasServices}
                                                className={`p-0 h-6 w-6 ${hasServices ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                            >
                                                {hasServices ? (
                                                    <svg
                                                        className={`h-4 w-4 transition-transform duration-200 ${
                                                            isExpanded ? 'rotate-90' : ''
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="h-4 w-4 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {isEditingCategoryTitle ? (
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        value={editedCategoryTitle}
                                                        onChange={(e) => setEditedCategoryTitle(e.target.value)}
                                                        className="text-sm"
                                                    />
                                                    <Button size="sm" onClick={() => handleUpdateCategory(category._id)}>Save</Button>
                                                    <Button size="sm" variant="outline" onClick={handleCancelCategoryEdit}>Cancel</Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span>{category.name}</span>
                                                    <Badge variant="outline">{category.options.length} services</Badge>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                {!isEditingCategoryTitle && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEditCategory(category)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAddService(category)}
                                                >
                                                    Add Service
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteClick(category, 'category')}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Service Rows (when expanded) */}
                                    {isExpanded && category.options.map((service) => (
                                        <TableRow key={service._id} className="bg-white">
                                            <TableCell></TableCell>
                                            <TableCell className="pl-8 font-medium">{service.name}</TableCell>
                                            <TableCell>
                                                PKR {service.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                PKR {service.margin.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {service.perPerson && <Badge variant="outline">Per Person</Badge>}
                                                    {service.margin === 0 && <Badge>Fixed Price</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    <Badge variant="outline">
                                                        PKR {service.price.toLocaleString()}{service.perPerson ? '/person' : ''}
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        Margin: PKR {service.margin.toLocaleString()}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditService(service, category)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteClick(
                                                            { ...service, categoryId: category._id }, 
                                                            'service'
                                                        )}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Empty state for category */}
                                    {isExpanded && category.options.length === 0 && (
                                        <TableRow className="bg-white">
                                            <TableCell></TableCell>
                                            <TableCell colSpan={5} className="pl-8 text-center py-8 text-muted-foreground">
                                                No services in this category. Add your first service to get started.
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {serviceCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No service categories found. Add your first category to start managing event customization services.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Service Option Modal */}
            <ServiceOptionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                service={editingService}
                onSave={handleSaveService}
            />

            {/* Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={handleCloseCategoryModal}
                onSave={handleSaveCategory}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setItemToDelete(null);
                    setDeleteType('');
                }}
                onConfirm={handleConfirmDelete}
                title={`Delete ${deleteType === 'service' ? 'Service' : 'Category'}`}
                description={`Are you sure you want to delete "${itemToDelete?.name || itemToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default EventCustomizationSection;
