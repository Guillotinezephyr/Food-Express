import { useEffect, useRef, useState } from 'react';
import './OrderTracking.css';

export default function FoodDeliveryMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRefs = useRef({});
  const [eta, setEta] = useState(15);
  const [mapLoaded, setMapLoaded] = useState(false);

  const Google_Maps_key = import.meta.env.VITE_API_APP_GOOGLE_MAPS_API_KEY;

  // Load Google Maps API script dynamically
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${Google_Maps_key}&libraries=places`;
    googleMapsScript.async = true;

    googleMapsScript.addEventListener('load', () => {
      setMapLoaded(true);
    });

    document.body.appendChild(googleMapsScript);

    return () => {
      // Remove script if component unmounts before script loads
      if (googleMapsScript.parentNode) {
        googleMapsScript.parentNode.removeChild(googleMapsScript);
      }
    };
  }, []);

  // Initialize map and simulation
  useEffect(() => {
    // Simulate countdown timer for ETA
    const timer = setInterval(() => {
      setEta(prev => (prev > 0 ? prev - 1 : 0));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const startCoords = { lat: 19.380064738653356, lng: 72.82881869235196 };
    const destCoords = { lat: 19.383838567705105, lng: 72.82896464808155 };

    // Initialize the map
    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: (startCoords.lat + destCoords.lat) / 2,
        lng: (startCoords.lng + destCoords.lng) / 2
      },
      zoom: 17,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_TOP
      }
    });

    mapInstanceRef.current = map;

    // Custom markers
    const restaurantMarker = new window.google.maps.Marker({
      position: startCoords,
      map: map,
      title: 'Restaurant',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });

    markerRefs.current.restaurant = restaurantMarker;
    
    const restaurantInfoWindow = new window.google.maps.InfoWindow({
      content: '<div><strong>Restaurant</strong><br>Your order is picked up!</div>'
    });
    
    restaurantInfoWindow.open(map, restaurantMarker);
    
    const deliveryLocationMarker = new window.google.maps.Marker({
      position: destCoords,
      map: map,
      title: 'Your Location',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });

    markerRefs.current.deliveryLocation = deliveryLocationMarker;

    // Add delivery agent marker (initially at restaurant position)
    const deliveryAgentMarker = new window.google.maps.Marker({
      position: startCoords,
      map: map,
      title: 'Delivery Agent',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new window.google.maps.Size(30, 30)
      },
      zIndex: 100
    });

    markerRefs.current.deliveryAgent = deliveryAgentMarker;

    // Create route - letting Google Maps decide the optimal path
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // We'll use our own markers
      polylineOptions: {
        strokeColor: '#4F46E5',
        strokeWeight: 4,
        strokeOpacity: 0.7
      }
    });

    directionsService.route({
      origin: startCoords,
      destination: destCoords,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        
        // Get the route path for animation
        const route = response.routes[0].overview_path;
        
        // Animate delivery agent along the route
        let step = 0;
        const totalSteps = 100;
        const animationInterval = setInterval(() => {
          if (step >= totalSteps) {
            clearInterval(animationInterval);
            return;
          }
          
          const progress = step / totalSteps;
          const routeIndex = Math.floor(progress * (route.length - 1));
          const partial = (progress * (route.length - 1)) % 1;
          
          const current = route[routeIndex];
          const next = route[Math.min(routeIndex + 1, route.length - 1)];
          
          const lat = current.lat() + (next.lat() - current.lat()) * partial;
          const lng = current.lng() + (next.lng() - current.lng()) * partial;
          
          deliveryAgentMarker.setPosition({ lat, lng });
          step++;
        }, 500);

        // Update ETA from directions result if available
        if (response.routes[0].legs[0].duration) {
          const durationMinutes = Math.ceil(response.routes[0].legs[0].duration.value / 60);
          setEta(durationMinutes);
        }
      } else {
        console.error("Directions request failed due to " + status);
      }
    });

    return () => {
      // Clean up map and markers
      if (mapInstanceRef.current) {
        // Google Maps doesn't have a specific cleanup method like Leaflet
        // Just clear references and listeners
        mapInstanceRef.current = null;
        markerRefs.current = {};
      }
    };
  }, [mapLoaded]);

  return (
    <div className="delivery-container">
    

      <div className="map-container">
        {/* Map container */}
        <div ref={mapRef} className="map-element"></div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-marker blue-marker"></div>
            <span className="legend-text">Restaurant</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker blue-marker"></div>
            <span className="legend-text">Delivery Location</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker red-marker"></div>
            <span className="legend-text">Delivery Agent</span>
          </div>
        </div>

        {/* Status Card */}
        <div className="status-card">
          <div className="status-title">
            <svg xmlns="http://www.w3.org/2000/svg" className="status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Order Status
          </div>
          
          <div className="status-content">
            <div className="status-label">
              <svg xmlns="http://www.w3.org/2000/svg" className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Order on the way</span>
            </div>
            
            <div className="eta-container">
              <div className="eta-label">Estimated delivery in:</div>
              <div className="eta-value">{eta} min</div>
            </div>
            
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${Math.min(100, (15-eta)/15*100 + 5)}%` }}></div>
            </div>
            
            <div className="delivery-person">
              <svg xmlns="http://www.w3.org/2000/svg" className="person-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Delivery by: <span className="driver-name">John D.</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}