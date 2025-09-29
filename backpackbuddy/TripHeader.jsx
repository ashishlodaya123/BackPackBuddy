import React from "react";
import { Calendar, MapPin } from "lucide-react";

const TripHeader = ({ destination, dates }) => {
  return (
    <div className="p-6 bg-primary rounded-lg mb-8">
      <h1 className="text-3xl font-bold text-secondary">{destination}</h1>
      <div className="flex items-center text-muted-foreground mt-2">
        <Calendar className="h-4 w-4 mr-2" />
        <span>{dates}</span>
      </div>
    </div>
  );
};

export default TripHeader;
