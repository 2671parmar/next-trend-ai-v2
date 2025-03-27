
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, MessageSquare, Mail, Linkedin, Facebook, Film } from 'lucide-react';

interface ContentFormProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  selected?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ 
  icon, 
  title, 
  description, 
  onClick,
  selected = false
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ y: 0 }}
      className={`card-hover rounded-xl p-5 cursor-pointer transition-all ${
        selected 
          ? 'bg-nextrend-50 border-2 border-nextrend-500 shadow-md' 
          : 'bg-white border border-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
          selected ? 'bg-nextrend-500 text-white' : 'bg-gray-50 text-gray-600'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const contentFormOptions = [
  {
    id: 'video-script',
    icon: <Video className="w-5 h-5" />,
    title: 'Video Script',
    description: 'Professional scripts for your video content',
  },
  {
    id: 'reel-script',
    icon: <Film className="w-5 h-5" />,
    title: 'Reel/Short Script',
    description: 'Attention-grabbing scripts for social media',
  },
  {
    id: 'blog-post',
    icon: <FileText className="w-5 h-5" />,
    title: 'Blog Post',
    description: 'Full article with H1s & H2s',
  },
  {
    id: 'linkedin',
    icon: <Linkedin className="w-5 h-5" />,
    title: 'LinkedIn Post',
    description: 'Professional post with hashtags',
  },
  {
    id: 'social',
    icon: <Facebook className="w-5 h-5" />,
    title: 'Social Post',
    description: 'Engaging Facebook/Instagram content',
  },
  {
    id: 'email',
    icon: <Mail className="w-5 h-5" />,
    title: 'Email',
    description: 'Summarized content for email campaigns',
  },
  {
    id: 'combo',
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Killer Combo',
    description: 'All formats with website link',
  },
];

export default ContentForm;
