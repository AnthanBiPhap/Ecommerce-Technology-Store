import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreLocationProps {
  name: string;
  address: string;
  hours: string;
  latitude: number;
  longitude: number;
}

export default function StoreLocation({
  name,
  address,
  hours,
  latitude,
  longitude,
}: StoreLocationProps) {
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Thêm API Key vào đây

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
      <p className="text-gray-600 text-lg">📍 {address}</p>
      <p className="text-gray-500">🕔 {hours}</p>

      <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm relative">
        <img
          alt="Google Map"
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red|${latitude},${longitude}&key=${googleMapsApiKey}`}
          width={600}
          height={300}
          style={{ border: 0 }}
          loading="lazy"
          className="w-full h-auto"
        />
      </div>

      <Button onClick={openGoogleMaps} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg cursor-pointer">
        <MapPin className="inline-block mr-2" /> Chỉ đường
      </Button>
    </div>
  );
}

