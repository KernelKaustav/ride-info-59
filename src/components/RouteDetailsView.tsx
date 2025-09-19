import React from 'react';
import { ArrowLeft, MapPin, Clock, Navigation, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Vehicle } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import routeMapBg from '@/assets/route-details-map.jpg';

interface RouteDetailsViewProps {
  vehicle: Vehicle;
  pickup?: string;
  destination?: string;
}

interface Stop {
  name: string;
  hasVehicles: boolean;
  isPickup?: boolean;
  isDestination?: boolean;
  congestion: 'low' | 'moderate' | 'high';
  eta?: string;
}

const RouteDetailsView: React.FC<RouteDetailsViewProps> = ({ 
  vehicle, 
  pickup = 'Central Station', 
  destination = 'Airport' 
}) => {
  const navigate = useNavigate();

  // Generate route stops with traffic and vehicle data
  const generateRouteStops = (): Stop[] => {
    const allStops = vehicle.stands;
    const congestionLevels = ['low', 'moderate', 'high'] as const;
    
    return allStops.map((stop, index) => ({
      name: stop,
      hasVehicles: Math.random() > 0.3, // 70% chance of having vehicles
      isPickup: stop === pickup,
      isDestination: stop === destination,
      congestion: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
      eta: `${5 + index * 8} min`
    }));
  };

  const routeStops = generateRouteStops();

  const getStopMarkerColor = (stop: Stop) => {
    if (stop.isPickup || stop.isDestination) return 'bg-red-500';
    if (!stop.hasVehicles) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getCongestionColor = (congestion: string) => {
    switch (congestion) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCongestionIcon = (congestion: string) => {
    switch (congestion) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'moderate': return <Clock className="h-3 w-3" />;
      case 'low': return <Navigation className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{vehicle.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{vehicle.type} Route Details</p>
            </div>
          </div>
        </div>
      </header>

      {/* Route Map */}
      <section className="relative">
        <div 
          className="w-full h-80 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${routeMapBg})` }}
        >
          {/* Map Overlay */}
          <div className="absolute inset-0 bg-background/10" />
          
          {/* Route Indicators */}
          <div className="absolute top-4 left-4 space-y-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-semibold mb-2">Route Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Pickup/Destination</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Stops with vehicles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Stops without vehicles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Legend */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-semibold mb-2">Traffic Status</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-green-500 rounded"></div>
                  <span>Low congestion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-yellow-500 rounded"></div>
                  <span>Moderate congestion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-red-500 rounded"></div>
                  <span>High congestion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Route Information */}
      <section className="py-6">
        <div className="container mx-auto px-4 space-y-6">
          
          {/* Vehicle Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Route Summary</span>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Next available in {vehicle.next_available}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹{vehicle.price}</div>
                  <div className="text-sm text-muted-foreground">Total Fare</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{vehicle.duration}</div>
                  <div className="text-sm text-muted-foreground">Journey Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{routeStops.length}</div>
                  <div className="text-sm text-muted-foreground">Total Stops</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Stops */}
          <Card>
            <CardHeader>
              <CardTitle>Route Stops & Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routeStops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {/* Stop Marker */}
                    <div className={`w-4 h-4 rounded-full ${getStopMarkerColor(stop)} flex-shrink-0`} />
                    
                    {/* Stop Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{stop.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {stop.isPickup && (
                              <Badge variant="outline" className="text-xs text-red-600">
                                Pickup Point
                              </Badge>
                            )}
                            {stop.isDestination && (
                              <Badge variant="outline" className="text-xs text-red-600">
                                Destination
                              </Badge>
                            )}
                            {!stop.hasVehicles && !stop.isPickup && !stop.isDestination && (
                              <Badge variant="secondary" className="text-xs">
                                No vehicles
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-sm text-muted-foreground">ETA: {stop.eta}</div>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getCongestionColor(stop.congestion)}`}
                          >
                            {getCongestionIcon(stop.congestion)}
                            <span className="ml-1 capitalize">{stop.congestion}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connector Line */}
                    {index < routeStops.length - 1 && (
                      <div className="absolute left-6 mt-8 w-0.5 h-6 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => navigate('/search')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Book This Route
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RouteDetailsView;