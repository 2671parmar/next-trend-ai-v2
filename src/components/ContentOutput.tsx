
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ContentOutputProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

const ContentOutput: React.FC<ContentOutputProps> = ({
  title,
  content,
  icon,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${title} content has been copied.`,
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="shadow-sm animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 px-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line text-sm text-gray-700">
          {content || <span className="text-gray-400 italic">No content generated yet</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentOutput;
