import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

const CategoryModal = ({ isOpen, onClose, onSave }) => {
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCategoryName('');
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!categoryName.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        const categoryData = {
            name: categoryName.trim(),
            options: []
        };

        await onSave(categoryData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="categoryName">Category Name *</Label>
                        <Input
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Add Category
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryModal; 