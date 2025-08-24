import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Trash2, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const token = localStorage.getItem('token');

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setName(data.name);
          setEmail(data.email);
        } else {
          toast.error(data.message || 'Failed to fetch profile');
        }
      } catch (error) {
        toast.error('Error loading profile.');
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate('/auth');
    }
  }, [token, navigate]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Your profile has been updated successfully.');
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('Error updating profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('Password mismatch. Please make sure your passwords match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/profile/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Your password has been updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        toast.error(data.message || 'Failed to update password.');
      }
    } catch (error) {
      toast.error('Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Your account has been successfully deleted.');
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to delete account.');
      }
    } catch (error) {
      toast.error('Error deleting account.');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('You have been successfully logged out.');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-new-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>

                  <div className="space-y-4 pt-4 border-t">
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Profile
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteProfile}>Delete Profile</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
