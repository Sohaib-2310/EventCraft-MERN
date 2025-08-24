import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DealModal from './DealModal';
import ConfirmDialog from './ConfirmDialog';
import toast from 'react-hot-toast';

const DealsUpdateSection = () => {
  const [deals, setDeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  // Fetch deals from API
  const fetchDeals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        // Update existing deal
        const response = await fetch(`http://localhost:5000/api/deals/${editingDeal._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dealData)
        });

        if (!response.ok) throw new Error('Failed to update deal');
        toast.success("Deal package has been successfully updated.");
      } else {
        // Create new deal
        const response = await fetch('http://localhost:5000/api/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dealData)
        });

        if (!response.ok) throw new Error('Failed to create deal');
        toast.success("New deal package has been added successfully.");
      }
      
      fetchDeals();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/deals/${dealToDelete._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete deal');
      
      toast.success("Deal package has been removed successfully.");
      fetchDeals();
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Deals & Packages Management</h2>
        <Button onClick={handleAddDeal}>Add New Package</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Price (PKR)</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal._id}>
                <TableCell>
                  <div className="font-medium">{deal.name}</div>
                  {deal.description && (
                    <div className="text-sm text-gray-500 mt-1">{deal.description}</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">PKR {deal.price.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {deal.services.slice(0, 3).map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {deal.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{deal.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={deal.isActive ? "default" : "secondary"}>
                    {deal.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDeal(deal)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(deal)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {deals.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No deals found. Add your first deal package to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        deal={editingDeal}
        onSave={handleSaveDeal}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDealToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Deal Package"
        description={`Are you sure you want to delete "${dealToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default DealsUpdateSection;