/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import ClientOnly from "./client-only";
const MapContainer = () => {
  const [zoom, setZoom] = useState(9);
  const [lng, setLng] = useState(-87.65);
  const [lt, setLt] = useState(41.84);
  const mapContainerRef = useRef<MapRef | null>(null); // Explicitly typed ref
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  const [viewPort, setViewPort] = useState({
    latitude: 9.06146,
    longitude: 7.50064,
    zoom: 11,
  });

  const handleMove = (event: any) => {
    setViewPort({
      latitude: event.viewState.latitude,
      longitude: event.viewState.longitude,
      zoom: event.viewState.zoom,
    });
  };

  return (
    <ClientOnly>
      <div
        style={{ width: "100%", borderRadius: "12px" }}
        className="h-[300px] lg:h-[600px]"
      >
        <Map
          ref={mapContainerRef} // Pass MapRef here
          initialViewState={viewPort}
          mapStyle="mapbox://styles/davidleo/cm3vy7jgr00cz01sd0aqm4pql"
          mapboxAccessToken="pk.eyJ1IjoiZGF2aWRsZW8iLCJhIjoiY2x4YzhucDE2MDlodDJpcHRqbDg3N3I1dyJ9.-ZrlFQwSzS71OtfrjRED1Q"
          style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          onMove={handleMove}
        />
      </div>
      {/* <Map
        mapStyle="mapbox://styles/davidleo/cm3vy7jgr00cz01sd0aqm4pql"
        mapboxAccessToken={process.env.MAP_BOX_ACCESS_TOKEN}
        onMove={(evt) => setViewPort(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        ref={mapContainerRef}
        {...viewPort}
        // initialViewState={{
        //   longitude: -122.4,
        //   latitude: 37.8,
        //   zoom: 14
        // }}
        // style={{width: 600, height: 400}}
      /> */}
    </ClientOnly>
  );
};

export default MapContainer;
