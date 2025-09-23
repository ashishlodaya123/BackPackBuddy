import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Clock, MapPin, DollarSign, Utensils, Landmark } from 'lucide-react';

const ItineraryCard = ({ dayPlan }) => {
  const { day, date, theme, activities } = dayPlan;

  const getIconForActivity = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('eat') || desc.includes('food') || desc.includes('lunch') || desc.includes('dinner') || desc.includes('breakfast')) {
      return <Utensils className="h-5 w-5 text-amber-500" />;
    }
    if (desc.includes('temple') || desc.includes('palace') || desc.includes('museum') || desc.includes('landmark')) {
      return <Landmark className="h-5 w-5 text-sky-500" />;
    }
    if (desc.includes('market') || desc.includes('shop')) {
      return <MapPin className="h-5 w-5 text-rose-500" />;
    }
    return <MapPin className="h-5 w-5 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Day {day}</CardTitle>
              <CardDescription>{date} - {theme}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 pt-1">
                {getIconForActivity(activity.description)}
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{activity.description}</p>
                <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {activity.time}
                  </span>
                  {activity.location?.name && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      {activity.location.name}
                    </span>
                  )}
                </div>
                {activity.budget_notes && (
                   <div className="flex items-center text-sm text-green-400 mt-1">
                     <DollarSign className="h-4 w-4 mr-1.5" />
                     <span>{activity.budget_notes}</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItineraryCard;
