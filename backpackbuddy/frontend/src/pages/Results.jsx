import React, { useState } from 'react';
import axios from 'axios';
import ItineraryCard from '@/components/ItineraryCard';
import MapView from '@/components/MapView';
import PackingList from '@/components/PackingList';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Download, Package } from 'lucide-react';

const Results = ({ itinerary, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [packingList, setPackingList] = useState(null);
  const [isPackingListLoading, setIsPackingListLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dailyPlans = itinerary?.itinerary || [];

  const allLocations = dailyPlans.flatMap(day =>
    day.activities
      .map(activity => activity.location)
      .filter(location => location && typeof location.lat === 'number' && typeof location.lon === 'number')
  );

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.post('http://localhost:8000/download-itinerary-pdf',
        { itinerary: itinerary },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BackpackBuddy_Itinerary.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to download PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGeneratePackingList = async () => {
    setIsPackingListLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/generate-packing-list', { itinerary });
      setPackingList(response.data);
      setIsModalOpen(true); // Open the modal with the new list
    } catch (error) {
      console.error("Failed to generate packing list", error);
    } finally {
      setIsPackingListLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold">Your Trip Itinerary</h1>
          <div className="flex gap-2">
            <Button onClick={handleGeneratePackingList} disabled={isPackingListLoading} variant="secondary">
              <Package className="mr-2 h-4 w-4" />
              {isPackingListLoading ? 'Generating...' : 'Packing List'}
            </Button>
            <Button onClick={handleDownloadPdf} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
            <Button onClick={onReset} variant="outline">
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <MapView locations={allLocations} />
        </div>

        {dailyPlans.length > 0 ? (
          <div className="space-y-6">
            {dailyPlans.map((dayPlan) => (
              <ItineraryCard key={dayPlan.day} dayPlan={dayPlan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">The generated itinerary seems to be empty or in an incorrect format.</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Packing List</DialogTitle>
          </DialogHeader>
          {packingList ? (
            <PackingList data={packingList} />
          ) : (
            <p>Loading packing list...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Results;
