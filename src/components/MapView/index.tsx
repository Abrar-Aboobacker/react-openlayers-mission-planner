import "ol/ol.css";
import React, { useEffect, useRef } from "react";
import { View } from "ol";
import OpenLayersMap from 'ol/Map';
import { Draw } from 'ol/interaction';
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import * as turf from '@turf/turf';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

interface Waypoint {
  id: string;
  coordinates: Coordinate;
  distance?: number;
}

interface MapComponentProps {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setModalData:any
}
const MapComponent: React.FC<MapComponentProps> = ({ isDrawing, setIsDrawing, setModalData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<VectorSource>(new VectorSource());

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new OpenLayersMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: sourceRef.current,
        }),
      ],
      view: new View({
        center: fromLonLat([77.594566, 12.9715987]),
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
        const feature = event.feature as Feature<LineString>;
        const geometry = feature.getGeometry();
        
        if (!geometry) return;
        
        const coordinates = geometry.getCoordinates();
        const waypoints: Waypoint[] = coordinates.map((coord, index) => ({
          id: `WP(${String(index).padStart(2, '0')})`,
          coordinates: coord,
        }));

        const distances = waypoints.slice(1).map((_, index) => {
          const point1 = turf.point([
            waypoints[index].coordinates[0],
            waypoints[index].coordinates[1]
          ]);
          const point2 = turf.point([
            waypoints[index + 1].coordinates[0],
            waypoints[index + 1].coordinates[1]
          ]);
          
          return turf.distance(point1, point2, { units: 'meters' });
        });

        const modalData: Waypoint[] = waypoints.map((wp, index) => ({
          ...wp,
          distance: distances[index] || 0,
        }));

        setModalData(modalData);
        setIsDrawing(false);
        map.removeInteraction(draw);
      });
    }

    return () => {
      map.setTarget(undefined);
    };
  }, [isDrawing, setIsDrawing, setModalData]);

  return (
    <div
      className="absolute inset-0 w-full"
      ref={mapRef}
    />
  );
};

export default MapComponent;