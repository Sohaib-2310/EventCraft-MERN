import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const DealModal = ({ isOpen, onClose, deal = null, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (deal && isOpen) {
      setName(deal.name || '');
      setPrice(deal.price?.toString() || '');
      setDescription(deal.description || '');
      setServices(deal.services || []);
      setIsActive(deal.isActive !== false);
    } else if (!deal && isOpen) {
      // Reset form for new deal
      setName('');
      setPrice('');
      setDescription('');
      setServices([]);
      setIsActive(true);
    }
  }, [deal, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Package name is required');
      return;
    }
    if (!price || isNaN(Number(price))) {
      toast.error('Valid price is required');
      return;
    }
    if (services.length === 0) {
      toast.error('At least one service is required');
      return;
    }

    const dealData = {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      services: services.filter(s => s.trim()),
      isActive
    };

    try {
      await onSave(dealData);
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newService.trim()) {
      e.preventDefault();
      addService();
    }
  };

  const getIconPreview = () => {
    const icons = [Zap, Star, Crown];
    const IconComponent = icons[Math.floor(Math.random() * icons.length)];
    return <IconComponent size={24} className="text-gray-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {deal ? 'Edit Package' : 'Add New Package'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Basic Package, Premium Package"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (PKR) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299900"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the package..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Services Section */}
          <div>
            <Label>Included Services *</Label>
            <div className="mt-2 space-y-3">
              {/* Add new service */}
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a service (e.g., Venue for up to 50 guests)"
                  className="flex-1"
                />
                <Button type="button" onClick={addService} disabled={!newService.trim()}>
                  Add
                </Button>
              </div>

              {/* Services list */}
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <Input
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      className="flex-1 border-0 bg-transparent p-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {services.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No services added yet. Add your first service above.
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isActive">Active Package</Label>
          </div>

          {/* Preview */}
          {name && price && services.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium text-gray-700">Preview</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  {getIconPreview()}
                  <span className="font-semibold">{name}</span>
                  <Badge variant="outline">PKR {Number(price).toLocaleString()}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {services.slice(0, 3).map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span>{service}</span>
                    </div>
                  ))}
                  {services.length > 3 && (
                    <div className="text-gray-500 text-xs">
                      +{services.length - 3} more services
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {deal ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealModal; 