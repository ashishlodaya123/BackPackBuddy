import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import Results from './Results'; // Import the Results component

const Home = () => {
  const [formData, setFormData] = useState({
    destination: '',
    travel_dates: '',
    budget_mode: 'Chill',
    preferences: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const response = await axios.post('http://localhost:8000/generate-itinerary', formData);
      setItinerary(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setFormData({
      destination: '',
      travel_dates: '',
      budget_mode: 'Chill',
      preferences: '',
    });
  };

  if (itinerary) {
    return <Results itinerary={itinerary} onReset={handleReset} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">BackpackBuddy 🎒</CardTitle>
          <CardDescription className="text-center">
            Your AI companion for epic, budget-friendly adventures.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="destination">Where are you going?</Label>
              <Input type="text" id="destination" placeholder="e.g., Bangkok, Thailand" value={formData.destination} onChange={handleChange} required />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="travel_dates">When are you traveling?</Label>
              <Input type="text" id="travel_dates" placeholder="e.g., November 10-15, 2024" value={formData.travel_dates} onChange={handleChange} required />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="budget_mode">What's your budget style?</Label>
              <select id="budget_mode" value={formData.budget_mode} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Strict">Strict</option>
                <option value="Chill">Chill</option>
                <option value="YOLO">YOLO</option>
              </select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="preferences">What are your interests?</Label>
              <Textarea id="preferences" placeholder="e.g., Street food, temples, hiking, local markets..." value={formData.preferences} onChange={handleChange} required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </Button>
          </CardFooter>
        </form>
        {error && <div className="p-4 text-red-500 text-center">{error}</div>}
      </Card>
    </div>
  );
};

export default Home;
