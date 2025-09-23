import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckSquare } from 'lucide-react';

const PackingList = ({ data }) => {
  if (!data || !data.packing_list) {
    return <p className="text-muted-foreground">Could not load packing list.</p>;
  }

  const { packing_list, weather_summary } = data;
  const categories = Object.keys(packing_list);

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      {weather_summary && (
        <Card className="bg-blue-900/20 border-blue-500">
          <CardHeader>
            <CardTitle className="text-base">Weather Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{weather_summary}</p>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <ul className="space-y-2">
            {packing_list[category].map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PackingList;
