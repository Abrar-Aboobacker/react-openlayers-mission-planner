import "ol/ol.css";
import React, { useEffect, useRef } from "react";
import {  View } from "ol";
import OpenLayersMap from 'ol/Map';
import { Draw } from 'ol/interaction';
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import * as turf from '@turf/turf';

interface MapComponentProps{
  isDrawing:boolean;
  setIsDrawing:React.Dispatch<React.SetStateAction<boolean>>;
  setModalData:React.Dispatch<React.SetStateAction<any>>;
}

const MapComponent:React.FC<MapComponentProps>= ({ isDrawing, setIsDrawing, setModalData }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const sourceRef = useRef(new VectorSource());
  useEffect(() => {
    const map = new OpenLayersMap({  // Using renamed import
      target: mapRef.current ?? undefined,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: sourceRef.current,
        }),
      ],
      view: new View({
        center: fromLonLat([77.594566, 12.9715987]), // Fixed coordinate order: [longitude, latitude]
        zoom: 12,
      }),
    });

    if (isDrawing) {
      const draw = new Draw({
        source: sourceRef.current,
        type: 'LineString',
      });

      map.addInteraction(draw);

      draw.on('drawend', (event) => {
        const lineString:any = event?.feature?.getGeometry()?.getCoordinates();
        const waypoints = lineString.map((coord: { lat: number; lng: number }, index: number) => ({
          id: `WP(${String(index).padStart(2, '0')})`,
          coordinates: coord,
        }));

        const distances = waypoints.slice(1).map((_:any, index:number) => {
          return turf.distance(
            turf.point(waypoints[index].coordinates),
            turf.point(waypoints[index + 1].coordinates),
            { units: 'meters' }
          );
        });

        const modalData = waypoints.map((wp:any, index:number) => ({
          ...wp,
          distance: distances[index] || 0,
        }));

        setModalData(modalData);
        setIsDrawing(false);
        map.removeInteraction(draw);
      });
    }

    return () => {
      map.setTarget(null);
    };
  }, [isDrawing, setIsDrawing, setModalData]);


  return (
    <div
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      ref={mapRef}
    />
  );
};

export default MapComponent;
