import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const ServiceOptionModal = ({ isOpen, onClose, service = null, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [margin, setMargin] = useState(0);
    const [perPerson, setPerPerson] = useState(false);
    const [fixedPricing, setFixedPricing] = useState(true);

    useEffect(() => {
        if (service) {
            setName(service.name);
            setPrice(service.price);
            setMargin(service.margin);
            setPerPerson(service.perPerson || false);
            setFixedPricing(service.margin === 0);
        } else {
            setName('');
            setPrice(10000);
            setMargin(0);
            setPerPerson(false);
            setFixedPricing(true);
        }
    }, [service, isOpen]);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Please enter a service name');
            return;
        }

        if (price < 0) {
            toast.error('Price cannot be negative');
            return;
        }

        const serviceData = {
            name: name.trim(),
            price: Number(price),
            margin: fixedPricing ? 0 : Number(margin),
            perPerson: perPerson
        };

        await onSave(serviceData);
        onClose();
    };

    const handleFixedPricingChange = (checked) => {
        setFixedPricing(checked);
        if (checked) {
            setMargin(0);
        } else {
            setMargin(1000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {service ? 'Edit Service Option' : 'Add New Service Option'}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Service Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter service name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Price (PKR) *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div>
                            <Label htmlFor="margin">Margin (PKR)</Label>
                            <Input
                                id="margin"
                                type="number"
                                value={margin}
                                onChange={(e) => setMargin(Number(e.target.value))}
                                placeholder="0"
                                min="0"
                                disabled={fixedPricing}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={perPerson}
                                onCheckedChange={setPerPerson}
                            />
                            <Label>Per Person Pricing</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={fixedPricing}
                                onCheckedChange={handleFixedPricingChange}
                            />
                            <Label>Fixed Pricing (No Margin)</Label>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <Label className="text-sm font-medium mb-2">Preview</Label>
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">
                                PKR {price.toLocaleString()}{perPerson ? '/person' : ''}
                            </Badge>
                            <Badge variant="secondary">
                                Margin: PKR {margin.toLocaleString()}
                            </Badge>
                            {fixedPricing && <Badge>Fixed Price</Badge>}
                            {perPerson && <Badge variant="outline">Per Person</Badge>}
                        </div>
                    </div>

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

export default ServiceOptionModal; 