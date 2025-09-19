import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Clock, Bus, Car, ArrowLeft, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '@/services/api';

interface Notification {
  id: string;
  type: 'nearby' | 'delay' | 'route_change' | 'price_drop';
  title: string;
  message: string;
  timestamp: Date;
  vehicle?: Vehicle;
  isRead: boolean;
}

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'nearby',
      title: 'Bus Route 42 nearby',
      message: 'City Bus Route 42 is 2 minutes away from your location',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      vehicle: {
        id: '1',
        type: 'bus',
        name: 'City Bus Route 42',
        route: 'Central Station → Market Square → Hospital Junction',
        current_location: { lat: 12.9716, lng: 77.5946 },
        stands: ['Central Bus Stand', 'Market Square'],
        price: 15,
        duration: '25 mins',
        next_available: '2 mins'
      },
      isRead: false
    },
    {
      id: '2',
      type: 'nearby',
      title: 'Auto Rickshaw available',
      message: 'Quick Auto is available 150m from your location',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      vehicle: {
        id: '2',
        type: 'auto',
        name: 'Quick Auto',
        route: 'Market Square → Main Road → University Campus',
        current_location: { lat: 12.9742, lng: 77.5952 },
        stands: ['Market Auto Stand', 'Railway Station'],
        price: 45,
        duration: '15 mins',
        next_available: '1 min'
      },
      isRead: false
    },
    {
      id: '3',
      type: 'delay',
      title: 'Route delay notification',
      message: 'Express Bus 101 is running 5 minutes late',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true
    },
    {
      id: '4',
      type: 'price_drop',
      title: 'Price drop alert',
      message: 'Shared Taxi price reduced to ₹30 for your route',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'nearby':
        return MapPin;
      case 'delay':
        return Clock;
      case 'route_change':
        return Navigation;
      case 'price_drop':
        return Bell;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'nearby':
        return 'text-green-600';
      case 'delay':
        return 'text-yellow-600';
      case 'route_change':
        return 'text-blue-600';
      case 'price_drop':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate to relevant page if vehicle is involved
    if (notification.vehicle) {
      navigate('/search', {
        state: {
          selectedVehicle: notification.vehicle,
          showRoute: true
        }
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You'll see updates about nearby vehicles and route changes here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              
              return (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-muted ${getNotificationColor(notification.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        
                        {notification.vehicle && (
                          <div className="flex items-center space-x-2 mt-2">
                            {notification.vehicle.type === 'bus' ? (
                              <Bus className="h-3 w-3 text-blue-600" />
                            ) : (
                              <Car className="h-3 w-3 text-yellow-600" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              ₹{notification.vehicle.price} • {notification.vehicle.duration}
                            </span>
                          </div>
                        )}
                        
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;