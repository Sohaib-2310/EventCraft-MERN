import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const ServiceModal = ({ isOpen, onClose, service = null, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState([]);
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (service) {
            setTitle(service.title);
            setDescription(service.description);
            setFeatures([...service.features]);
            setIcon(service.icon);
        } else {
            setTitle('');
            setDescription('');
            setFeatures([]);
            setIcon('');
        }
    }, [service, isOpen]);

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        const serviceData = {
            title: title.trim(),
            description: description.trim(),
            features: features.filter(f => f.trim()),
            icon: icon.trim()
        };

        await onSave(serviceData);
        onClose();
    };

    const addFeature = () => {
        setFeatures([...features, '']);
    };

    const updateFeature = (index, value) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {service ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Service Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter service title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter service description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="icon">Icon Name</Label>
                        <Input
                            id="icon"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="e.g., Building, Music, Camera"
                        />
                    </div>

                    <div>
                        <Label>Features</Label>
                        <div className="space-y-2 mt-2">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(idx, e.target.value)}
                                        placeholder={`Feature ${idx + 1}`}
                                        className="flex-1"
                                    />
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeFeature(idx)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addFeature}>
                                Add Feature
                            </Button>
                        </div>
                    </div>

                    {features.length > 0 && (
                        <div>
                            <Label>Preview</Label>
                            <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-gray-50">
                                {features.filter(f => f.trim()).map((feature, idx) => (
                                    <Badge key={idx} variant="secondary">{feature}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {service ? 'Update Service' : 'Add Service'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ServiceModal; 