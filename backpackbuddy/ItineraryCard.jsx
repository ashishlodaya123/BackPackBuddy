import React from "react";
import { Utensils, Camera, Bed, TramFront, Footprints } from "lucide-react";

const ICONS = {
  Food: <Utensils className="h-5 w-5 text-accent" />,
  Activity: <Camera className="h-5 w-5 text-accent" />,
  Accommodation: <Bed className="h-5 w-5 text-accent" />,
  Travel: <TramFront className="h-5 w-5 text-accent" />,
  default: <Footprints className="h-5 w-5 text-accent" />,
};

const ItineraryCard = ({ item }) => {
  const { time, type, description, details } = item;
  const icon = ICONS[type] || ICONS["default"];

  return (
    <div className="relative pl-8">
      {/* Timeline visual elements */}
      <div className="absolute left-0 top-1 flex flex-col items-center">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
          {icon}
        </div>
        <div className="flex-grow w-px bg-border my-2"></div>
      </div>

      <div className="ml-4 pb-10">
        <div className="flex items-baseline">
          <p className="text-sm font-semibold text-accent w-20">{time}</p>
          <h4 className="text-lg font-semibold text-secondary">
            {description}
          </h4>
        </div>
        <p className="mt-1 ml-20 text-muted-foreground">{details}</p>
      </div>
    </div>
  );
};

export default ItineraryCard;
