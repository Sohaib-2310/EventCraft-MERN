import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description, confirmText = "Delete", cancelText = "Cancel" }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                
                <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog; 