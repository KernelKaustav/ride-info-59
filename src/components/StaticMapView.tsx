import React from 'react';
import { Bus, Car, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import staticMapBg from '@/assets/static-transport-map.jpg';

interface StaticMapViewProps {
  vehicles?: Vehicle[];
  className?: string;
}

const StaticMapView: React.FC<StaticMapViewProps> = ({
  vehicles = [],
  className = "w-full h-[500px]"
}) => {
  const navigate = useNavigate();

  const getVehicleIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'bus':
        return Bus;
      case 'auto':
        return Car;
      case 'cab':
        return Car;
      default:
        return MapPin;
    }
  };

  const getVehicleColor = (type: Vehicle['type']) => {
    switch (type) {
      case 'bus':
        return 'text-blue-600 bg-blue-100';
      case 'auto':
        return 'text-yellow-600 bg-yellow-100';
      case 'cab':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRandomAvailability = () => {
    const options = ['2/4', '3/4', '1/3', '4/6', '2/3', '5/6'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    // Navigate to search page with vehicle details
    navigate('/search', { 
      state: { 
        selectedVehicle: vehicle,
        showRoute: true 
      } 
    });
  };

  // Predefined positions for vehicle icons on the map
  const vehiclePositions = [
    { top: '20%', left: '15%' },
    { top: '35%', left: '60%' },
    { top: '60%', left: '25%' },
    { top: '45%', left: '80%' },
    { top: '75%', left: '50%' }
  ];

  return (
    <div className={`${className} relative overflow-hidden rounded-lg border shadow-lg`}>
      {/* Background Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${staticMapBg})` }}
      />
      
      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-background/10" />
      
      {/* Vehicle Icons */}
      {vehicles.slice(0, 5).map((vehicle, index) => {
        const position = vehiclePositions[index] || vehiclePositions[0];
        const IconComponent = getVehicleIcon(vehicle.type);
        const availability = getRandomAvailability();
        
        return (
          <div
            key={vehicle.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ top: position.top, left: position.left }}
            onClick={() => handleVehicleClick(vehicle)}
          >
            {/* Vehicle Icon */}
            <div className={`p-3 rounded-full border-2 border-white shadow-lg ${getVehicleColor(vehicle.type)} group-hover:scale-110 transition-transform`}>
              <IconComponent className="h-6 w-6" />
            </div>
            
            {/* Availability Badge */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="text-xs font-medium bg-white/90 text-foreground">
                {availability}
              </Badge>
            </div>
            
            {/* Hover Card */}
            <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <CardContent className="p-3">
                <h4 className="font-semibold text-sm">{vehicle.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{vehicle.route}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600">₹{vehicle.price}</span>
                  <span className="text-muted-foreground">{vehicle.duration}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Next: {vehicle.next_available}</p>
              </CardContent>
            </Card>
          </div>
        );
      })}
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Vehicle Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-600"></div>
            <span>Buses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-600"></div>
            <span>Auto Rickshaws</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-600"></div>
            <span>Cabs</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click on any vehicle to see route details
        </p>
      </div>
    </div>
  );
};

export default StaticMapView;