import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HomeScreen from "./pages/HomeScreen";
import SearchScreen from "./pages/SearchScreen";
import ProfileScreen from "./pages/ProfileScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import RouteDetailsView from "./components/RouteDetailsView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/route-details" element={<RouteDetailsView vehicle={{
            id: '1',
            type: 'bus',
            name: 'Route 42 Express',
            route: 'Central Station → Mall Road → University → Airport',
            current_location: { lat: 28.6139, lng: 77.2090 },
            stands: ['Central Station', 'Mall Road', 'University', 'Airport'],
            price: 25,
            duration: '45 min',
            next_available: '3 min'
          }} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
