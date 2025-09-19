import { supabase } from '@/lib/supabase';

export interface Vehicle {
  id: string;
  type: 'bus' | 'auto' | 'cab';
  name: string;
  route: string;
  current_location: { lat: number; lng: number };
  stands: string[];
  price: number;
  duration: string;
  next_available: string;
}

export interface SearchParams {
  from: string;
  to: string;
  type?: 'bus' | 'auto' | 'cab';
}

class ApiService {
  // Get all vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching vehicles:', error);
      return this.getMockVehicles(); // Fallback to mock data
    }

    return data || this.getMockVehicles();
  }

  // Search vehicles by route
  async searchVehicles(params: SearchParams): Promise<Vehicle[]> {
    let query = supabase
      .from('vehicles')
      .select('*');

    if (params.type) {
      query = query.eq('type', params.type);
    }

    // Simple text search in route field
    if (params.from || params.to) {
      const searchTerm = `${params.from} ${params.to}`.trim();
      query = query.ilike('route', `%${searchTerm}%`);
    }

    const { data, error } = await query.order('price', { ascending: true });

    if (error) {
      console.error('Error searching vehicles:', error);
      return this.getMockVehicles();
    }

    return data || [];
  }

  // Get nearby vehicles (mock implementation)
  async getNearbyVehicles(lat: number, lng: number, radius: number = 5): Promise<Vehicle[]> {
    // In a real implementation, you'd use PostGIS or similar for geospatial queries
    // For now, return mock data based on proximity to Bangalore city center
    const vehicles = await this.getVehicles();
    
    return vehicles.filter(vehicle => {
      const distance = this.calculateDistance(
        lat, lng,
        vehicle.current_location.lat,
        vehicle.current_location.lng
      );
      return distance <= radius;
    });
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Mock data for development
  private getMockVehicles(): Vehicle[] {
    return [
      // Buses
      {
        id: '1',
        type: 'bus',
        name: 'Route 42 Express',
        route: 'Central Station → Mall Road → University → Airport',
        current_location: { lat: 28.6139, lng: 77.2090 },
        stands: ['Central Station', 'Mall Road', 'University', 'Airport'],
        price: 25,
        duration: '45 min',
        next_available: '3 min'
      },
      {
        id: '2',
        type: 'bus',
        name: 'Metro Line 1',
        route: 'Railway Station → City Center → Mall Complex → IT Park',
        current_location: { lat: 28.6200, lng: 77.2100 },
        stands: ['Railway Station', 'City Center', 'Mall Complex', 'IT Park'],
        price: 20,
        duration: '35 min',
        next_available: '7 min'
      },
      {
        id: '3',
        type: 'bus',
        name: 'Express 15',
        route: 'Bus Terminal → Hospital → Market → School',
        current_location: { lat: 28.6050, lng: 77.2200 },
        stands: ['Bus Terminal', 'Hospital', 'Market', 'School'],
        price: 18,
        duration: '30 min',
        next_available: '12 min'
      },
      {
        id: '4',
        type: 'bus',
        name: 'City Connect',
        route: 'Airport → Hotel Zone → Business District → Stadium',
        current_location: { lat: 28.6300, lng: 77.1900 },
        stands: ['Airport', 'Hotel Zone', 'Business District', 'Stadium'],
        price: 35,
        duration: '55 min',
        next_available: '4 min'
      },
      {
        id: '5',
        type: 'bus',
        name: 'Green Line',
        route: 'Park Avenue → Shopping Mall → University → Tech Hub',
        current_location: { lat: 28.6180, lng: 77.2250 },
        stands: ['Park Avenue', 'Shopping Mall', 'University', 'Tech Hub'],
        price: 22,
        duration: '40 min',
        next_available: '8 min'
      },
      
      // Auto Rickshaws
      {
        id: '6',
        type: 'auto',
        name: 'Auto A1',
        route: 'Market Square → Tech Park → Railway Station',
        current_location: { lat: 28.6129, lng: 77.2295 },
        stands: ['Market Square', 'Tech Park', 'Railway Station'],
        price: 35,
        duration: '20 min',
        next_available: '1 min'
      },
      {
        id: '7',
        type: 'auto',
        name: 'Quick Auto',
        route: 'Mall Road → Office Complex → Metro Station',
        current_location: { lat: 28.6150, lng: 77.2150 },
        stands: ['Mall Road', 'Office Complex', 'Metro Station'],
        price: 28,
        duration: '15 min',
        next_available: '2 min'
      },
      {
        id: '8',
        type: 'auto',
        name: 'Speed Auto',
        route: 'Hotel Zone → Market → Hospital',
        current_location: { lat: 28.6080, lng: 77.2180 },
        stands: ['Hotel Zone', 'Market', 'Hospital'],
        price: 32,
        duration: '18 min',
        next_available: '6 min'
      },
      {
        id: '9',
        type: 'auto',
        name: 'City Auto',
        route: 'Bus Stand → College → Shopping Center',
        current_location: { lat: 28.6220, lng: 77.2080 },
        stands: ['Bus Stand', 'College', 'Shopping Center'],
        price: 40,
        duration: '25 min',
        next_available: '9 min'
      },
      {
        id: '10',
        type: 'auto',
        name: 'Express Auto',
        route: 'Airport → City Center → Railway Hub',
        current_location: { lat: 28.6250, lng: 77.1950 },
        stands: ['Airport', 'City Center', 'Railway Hub'],
        price: 45,
        duration: '30 min',
        next_available: '4 min'
      },
      {
        id: '11',
        type: 'auto',
        name: 'Metro Auto',
        route: 'IT Park → Business Center → Mall',
        current_location: { lat: 28.6170, lng: 77.2300 },
        stands: ['IT Park', 'Business Center', 'Mall'],
        price: 38,
        duration: '22 min',
        next_available: '11 min'
      },
      
      // Cabs
      {
        id: '12',
        type: 'cab',
        name: 'Quick Cab',
        route: 'City Center → Business District → Hotel Zone',
        current_location: { lat: 28.6219, lng: 77.2085 },
        stands: ['City Center', 'Business District', 'Hotel Zone'],
        price: 55,
        duration: '30 min',
        next_available: '5 min'
      },
      {
        id: '13',
        type: 'cab',
        name: 'Premium Ride',
        route: 'Airport → Hotel District → Convention Center',
        current_location: { lat: 28.6280, lng: 77.1920 },
        stands: ['Airport', 'Hotel District', 'Convention Center'],
        price: 60,
        duration: '35 min',
        next_available: '7 min'
      },
      {
        id: '14',
        type: 'cab',
        name: 'Comfort Cab',
        route: 'Railway Station → Shopping Mall → Tech Park',
        current_location: { lat: 28.6160, lng: 77.2120 },
        stands: ['Railway Station', 'Shopping Mall', 'Tech Park'],
        price: 48,
        duration: '28 min',
        next_available: '3 min'
      },
      {
        id: '3',
        type: 'cab',
        name: 'Shared Taxi',
        route: 'Railway Station → Highway → University Gate',
        current_location: { lat: 12.9698, lng: 77.5938 },
        stands: ['Railway Taxi Stand', 'Airport Road', 'City Center'],
        price: 35,
        duration: '20 mins',
        next_available: '8 mins'
      },
      {
        id: '4',
        type: 'bus',
        name: 'Express Bus 101',
        route: 'IT Park → Commercial Street → Brigade Road',
        current_location: { lat: 12.9780, lng: 77.5960 },
        stands: ['IT Park Terminal', 'Commercial Complex', 'Brigade Bus Stop'],
        price: 20,
        duration: '30 mins',
        next_available: '12 mins'
      },
      {
        id: '5',
        type: 'auto',
        name: 'Quick Auto',
        route: 'MG Road → Brigade Road → Commercial Street',
        current_location: { lat: 12.9750, lng: 77.6040 },
        stands: ['MG Road Metro', 'Brigade Road Corner', 'Commercial Street Auto Stand'],
        price: 55,
        duration: '18 mins',
        next_available: '3 mins'
      }
    ];
  }

  // Subscribe to real-time vehicle updates
  subscribeToVehicleUpdates(callback: (vehicle: Vehicle) => void) {
    return supabase
      .channel('vehicle-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vehicles' 
        }, 
        (payload) => {
          if (payload.new) {
            callback(payload.new as Vehicle);
          }
        }
      )
      .subscribe();
  }
}

export const apiService = new ApiService();