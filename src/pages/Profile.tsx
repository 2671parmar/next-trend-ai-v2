import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { extractTextFromPDF, generateBrandVoiceSummary, saveBrandVoice, getBrandVoice } from '@/lib/brandVoice';

export default function Profile() {
  const { profile, updateProfile, loading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [brandVoice, setBrandVoice] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingBrandVoice, setIsLoadingBrandVoice] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      loadBrandVoice();
    }
  }, [profile?.id]);

  const loadBrandVoice = async () => {
    if (!profile?.id) return;
    
    setIsLoadingBrandVoice(true);
    try {
      const data = await getBrandVoice(profile.id);
      if (data) {
        setBrandVoice(data.content);
      }
    } catch (error) {
      console.error('Error loading brand voice:', error);
      toast.error('Failed to load brand voice');
    } finally {
      setIsLoadingBrandVoice(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await updateProfile({
        full_name: formData.name,
      });
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (error) throw error;
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Generate brand voice summary
      const summary = await generateBrandVoiceSummary(extractedText);
      
      // Save to database
      await saveBrandVoice(profile.id, summary);
      
      // Update local state
      setBrandVoice(summary);
      
      toast.success('Brand voice updated successfully');
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nextrend-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account preferences and brand voice</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>
              <Button 
                type="submit" 
                className=""
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>

            {/* Change Password */}
            <div className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className=""
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </div>
          </div>

          {/* Brand Voice */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Brand Voice</h2>
            <p className="text-gray-600">
              Upload personal content (emails, blog posts, video transcripts) to define your brand voice. 
              This helps us generate content that matches your style.
            </p>
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Click to upload a file</p>
                <p className="text-sm text-gray-500 mt-1">PDF, Word, or TXT (max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
              </div>
            </div>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Processing...' : 'Upload File'}
            </Button>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
              {isLoadingBrandVoice ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nextrend-500"></div>
                </div>
              ) : brandVoice ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{brandVoice}</p>
                </div>
              ) : (
                <p className="text-gray-600">No files uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 