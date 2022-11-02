import React from "react";
import { useRef } from "react";
import { useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA0iteu2Opq6xvE1yLjGgoMQcyiRkj-pe8",
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  return (
    <div className="container bg-light">
      <div className="col-md-10 m-auto my-5 p-5 shadow">
        <div className="row d-flex">
          <div className="form-group my-2 col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="origin"
              ref={originRef}
            />
          </div>
          <div className="form-group my-2 col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="destination"
              ref={destiantionRef}
            />
          </div>
          <div className="col-md-3 my-2">
            <button className="btn btn-primary" onClick={calculateRoute}>
              Calculate Route
            </button>
          </div>
        </div>
        <div className="row d-flex">
          <div className="col-md-3 text-secondary">
            <span>Duration</span>
          </div>
          <div className="col-md-3 text-secondary">
            <span>Distance</span>
          </div>
          <div className="col-md-3 text-secondary">
            <button
              className="btn btn-info"
              onClick={() => {
                map.panTo(center);
                map.setZoom(15);
              }}
            >
              Back to Center
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;
