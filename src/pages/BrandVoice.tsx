import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function BrandVoice() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // TODO: Implement file upload logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated upload
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-2">Brand Voice</h1>
        <p className="text-gray-600 mb-8">
          Upload personal content (emails, blog posts, video transcripts) to define your brand voice. 
          This helps us generate content that matches your style.
        </p>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Content</CardTitle>
              <CardDescription>
                Upload files that represent your brand's voice and style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-blue-50 rounded-full p-3 mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">Click to upload a file</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, Word, or TXT (max 10MB)</p>
                </div>
              </div>
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
              <Button 
                className="w-full"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isLoading}
              >
                {isLoading ? 'Uploading...' : 'Upload File'}
              </Button>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
                <p className="text-gray-600">No files uploaded yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 