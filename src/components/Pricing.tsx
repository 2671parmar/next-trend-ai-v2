
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for your mortgage business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-2 border-gray-100">
              <CardHeader className="pb-2">
                <div className="mb-2 inline-flex rounded-full bg-nextrend-100 px-3 py-1 text-sm text-nextrend-600 font-medium">
                  Starter
                </div>
                <CardTitle className="text-2xl md:text-3xl flex items-start gap-1">
                  <span className="text-lg pt-1">$</span>29
                  <span className="text-base font-normal text-gray-500 mt-2">/month</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Perfect for individual loan officers
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 mt-4">
                  {[
                    "100 AI-generated content pieces/month",
                    "8 content formats per topic",
                    "Basic customization options",
                    "Standard content templates",
                    "Email support"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 h-5 w-5 text-nextrend-500 flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-600 text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full button-hover bg-nextrend-100 text-nextrend-700 hover:bg-nextrend-200" 
                  size="lg"
                >
                  Start with Starter
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow relative border-2 border-nextrend-500 overflow-hidden">
              <div className="absolute top-0 right-0 bg-nextrend-500 text-white px-3 py-1 text-xs font-medium rotate-0 origin-right rounded-bl-lg">
                MOST POPULAR
              </div>
              <CardHeader className="pb-2">
                <div className="mb-2 inline-flex rounded-full bg-nextrend-100 px-3 py-1 text-sm text-nextrend-600 font-medium">
                  Pro
                </div>
                <CardTitle className="text-2xl md:text-3xl flex items-start gap-1">
                  <span className="text-lg pt-1">$</span>69
                  <span className="text-base font-normal text-gray-500 mt-2">/month</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Ideal for growing mortgage teams
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 mt-4">
                  {[
                    "Unlimited AI-generated content",
                    "All 8 content formats per topic",
                    "Advanced voice & tone customization",
                    "Premium content templates",
                    "Priority support",
                    "White-labeled content exports",
                    "Compliance review tools",
                    "Team collaboration features"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 h-5 w-5 text-nextrend-500 flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-600 text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full button-hover bg-nextrend-500 text-white" 
                  size="lg"
                >
                  Get Pro Access
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
