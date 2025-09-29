import React, { useState } from "react";
import { motion } from "framer-motion";
import { Map, List, Download, Edit } from "lucide-react";
import TripHeader from "../components/TripHeader";
import ItineraryCard from "../components/ItineraryCard";

// Mock data - in a real app, this would come from props or a state management library
const mockItinerary = {
  destination: "Hanoi, Vietnam",
  dates: "November 10-15, 2024",
  itinerary: [
    {
      day: 1,
      theme: "Arrival and Old Quarter Exploration",
      items: [
        {
          time: "2:00 PM",
          type: "Accommodation",
          description: "Check into Old Quarter Hostel",
          details: "Settle in and drop off your bags.",
        },
        {
          time: "4:00 PM",
          type: "Activity",
          description: "Walk around Hoan Kiem Lake",
          details: "Visit Ngoc Son Temple on the lake.",
        },
        {
          time: "7:00 PM",
          type: "Food",
          description: "Dinner at Bún Chả Hương Liên",
          details: "Famous for the 'Obama Bun Cha'.",
        },
      ],
    },
    {
      day: 2,
      theme: "Culture and History",
      items: [
        {
          time: "9:00 AM",
          type: "Activity",
          description: "Visit Ho Chi Minh Mausoleum",
          details: "Pay respects to the nation's founder.",
        },
        {
          time: "11:00 AM",
          type: "Activity",
          description: "Explore the Temple of Literature",
          details: "Vietnam's first university.",
        },
        {
          time: "1:00 PM",
          type: "Food",
          description: "Lunch - Phở Gia Truyền",
          details: "Authentic and delicious beef pho.",
        },
        {
          time: "3:00 PM",
          type: "Travel",
          description: "Cyclo ride through the Old Quarter",
          details: "A relaxing way to see the sights.",
        },
      ],
    },
  ],
};

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ children, className }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-sm border border-border ${className}`}
  >
    {children}
  </div>
);

const Results = () => {
  const [activeTab, setActiveTab] = useState("itinerary");
  const { destination, dates, itinerary } = mockItinerary;

  const renderContent = () => {
    switch (activeTab) {
      case "itinerary":
        return (
          <div>
            {itinerary.map((dayPlan) => (
              <div key={dayPlan.day} className="mb-8">
                <h3 className="text-xl font-bold text-secondary mb-4">
                  Day {dayPlan.day}: {dayPlan.theme}
                </h3>
                <div className="relative">
                  {/* Vertical line for the timeline */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10"></div>
                  {dayPlan.items.map((item, index) => (
                    <ItineraryCard key={index} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "map":
        return (
          <Card>
            Map View Coming Soon! An interactive map showing all your pins will
            be here.
          </Card>
        );
      case "prep-kit":
        return (
          <Card>
            Prep-Kit Coming Soon! Your packing list, safety tips, and cultural
            info will be here.
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto py-8 px-4">
        <TripHeader destination={destination} dates={dates} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex border-b border-border mb-6">
              <button
                onClick={() => setActiveTab("itinerary")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "itinerary"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground"
                }`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "map"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setActiveTab("prep-kit")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "prep-kit"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground"
                }`}
              >
                Prep-Kit
              </button>
            </div>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="font-bold text-lg text-secondary mb-4">
                Trip Tools
              </h3>
              <div className="space-y-3">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Download className="h-4 w-4" /> Download Offline Pack
                </Button>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Edit className="h-4 w-4" /> Edit Preferences
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
