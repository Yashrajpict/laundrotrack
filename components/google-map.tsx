"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Laundry } from "@/lib/types";

declare global {
  interface Window {
    google?: any;
  }
}

type Props = {
  laundries: Laundry[];
  selectedLaundryId: string;
  onSelectLaundry: (id: string) => void;
};

export function GoogleMap({ laundries, selectedLaundryId, onSelectLaundry }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapsEnabled, setMapsEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "granted" | "denied" | "unsupported">("idle");
  const [nearbyPlaces, setNearbyPlaces] = useState<
    { id: string; name: string; address: string; rating?: number; lat: number; lng: number }[]
  >([]);
  const selectedLaundry = laundries.find((laundry) => laundry.id === selectedLaundryId) ?? laundries[0];

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState("unsupported");
      return;
    }

    setLocationState("idle");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationState("granted");
      },
      () => {
        setLocationState("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');
    const init = () => {
      if (!window.google || !mapRef.current) {
        return;
      }

      setMapsEnabled(true);
      const center = userLocation ?? { lat: selectedLaundry.latitude, lng: selectedLaundry.longitude };
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: userLocation ? 14 : 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
      const bounds = new window.google.maps.LatLngBounds();

      const createSeededMarkers = () => {
        laundries.forEach((laundry) => {
          bounds.extend({ lat: laundry.latitude, lng: laundry.longitude });
          const markerNumber = laundries.findIndex((entry) => entry.id === laundry.id) + 1;
          const marker = new window.google.maps.Marker({
            map,
            position: { lat: laundry.latitude, lng: laundry.longitude },
            title: laundry.name,
            label: {
              text: String(markerNumber),
              color: "#ffffff",
              fontWeight: "700"
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="font-family:Georgia,serif;padding:6px 4px;"><strong>${laundry.name}</strong><br/>${laundry.address}</div>`
          });

          marker.addListener("click", () => {
            onSelectLaundry(laundry.id);
            infoWindow.open({ anchor: marker, map });
          });
        });
      };

      if (userLocation) {
        bounds.extend(userLocation);
        new window.google.maps.Marker({
          map,
          position: userLocation,
          title: "Your location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#0f766e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });
      }

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 80);
      }

      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: center,
          radius: 3000,
          keyword: "laundry",
          type: "laundry"
        },
        (results: any[] = [], status: string) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
            setNearbyPlaces([]);
            createSeededMarkers();
            if (!bounds.isEmpty()) {
              map.fitBounds(bounds, 80);
            }
            return;
          }

          const mappedPlaces = results
            .filter((place) => place.geometry?.location)
            .slice(0, 12)
            .map((place) => ({
              id: place.place_id,
              name: place.name,
              address: place.vicinity ?? "Address unavailable",
              rating: place.rating,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }));

          setNearbyPlaces(mappedPlaces);

          if (mappedPlaces.length === 0) {
            createSeededMarkers();
          } else {
            mappedPlaces.forEach((place, index) => {
              bounds.extend({ lat: place.lat, lng: place.lng });
              const marker = new window.google.maps.Marker({
                map,
                position: { lat: place.lat, lng: place.lng },
                title: place.name,
                label: {
                  text: String(index + 1),
                  color: "#ffffff",
                  fontWeight: "700"
                }
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style="font-family:Georgia,serif;padding:6px 4px;"><strong>${place.name}</strong><br/>${place.address}</div>`
              });

              marker.addListener("click", () => {
                infoWindow.open({ anchor: marker, map });
              });
            });
          }

          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, 80);
          }
        }
      );
    };

    if (existing) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = init;
    document.body.appendChild(script);
  }, [
    laundries,
    onSelectLaundry,
    selectedLaundry.address,
    selectedLaundry.latitude,
    selectedLaundry.longitude,
    userLocation
  ]);

  return (
    <div className="card map-shell">
      <h3>Nearby Laundries on Google Maps</h3>
      <p className="muted">
        Tap a pin to view the laundry name and address. Owners can update their live map position from the
        owner dashboard.
      </p>
      <p className="mini-note">
        {locationState === "idle" && "Requesting your location to find the nearest laundries."}
        {locationState === "granted" && "Location access granted. Nearby laundries are centered around your position."}
        {locationState === "denied" && "Location access was denied, so the map is using the selected laundry area instead."}
        {locationState === "unsupported" && "This browser does not support geolocation, so the map is using demo coordinates."}
      </p>
      <button className="secondary" onClick={requestLocation} type="button">
        Use My Location
      </button>
      <div className="map-canvas" ref={mapRef} />
      {!mapsEnabled ? (
        <div className="map-fallback">
          <p className="mini-note">
            Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the interactive map. The laundries
            below already expose the same marker details and can link out to Google Maps.
          </p>
          {laundries.map((laundry) => (
            <button
              className="laundry-tile"
              key={laundry.id}
              onClick={() => onSelectLaundry(laundry.id)}
              type="button"
            >
              <span>
                <strong>{laundry.name}</strong>
                <br />
                <span className="muted">{laundry.address}</span>
              </span>
              <span className="timeline-badge">{laundry.distanceKm} km away</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="map-fallback">
        <p className="mini-note">
          {nearbyPlaces.length > 0
            ? "Nearby laundries found around your current location."
            : "Showing demo laundries because nearby Places results are not available yet."}
        </p>
        {(nearbyPlaces.length > 0 ? nearbyPlaces : laundries).map((entry, index) => (
          <button
            className="laundry-tile"
            key={entry.id}
            onClick={() => ("distanceKm" in entry ? onSelectLaundry(entry.id) : undefined)}
            type="button"
          >
            <span>
              <strong>
                Pin {index + 1}: {entry.name}
              </strong>
              <br />
              <span className="muted">{entry.address}</span>
            </span>
            <span className="timeline-badge">
              {"distanceKm" in entry ? `${entry.distanceKm} km away` : entry.rating ? `${entry.rating} stars` : "Nearby"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
