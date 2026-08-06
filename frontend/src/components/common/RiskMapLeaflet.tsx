import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getStationName, type RiskStation } from '../../types';
import { getRiskColor } from '../../utils/helpers';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RiskMapLeafletProps {
  stations: RiskStation[];
  center?: [number, number];
  zoom?: number;
}

const RiskMapLeaflet = ({ stations, center = [25.5, 89.5], zoom = 7 }: RiskMapLeafletProps) => {
  const createCustomIcon = (riskLabel: string) => {
    const color = getRiskColor(riskLabel as any);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: '#041E42' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {stations.map((station) => (
          <div key={station.station_id}>
            {/* Pulsing effect for high-risk stations */}
            {station.risk_label === 'RED' && (
              <CircleMarker
                center={[station.lat, station.lon]}
                radius={30}
                color={getRiskColor(station.risk_label)}
                fillColor={getRiskColor(station.risk_label)}
                fillOpacity={0.2}
                weight={2}
              />
            )}
            
            <Marker
              position={[station.lat, station.lon]}
              icon={createCustomIcon(station.risk_label)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold mb-1">{getStationName(station.station_id)}</div>
                  <div>Risk: <span style={{ color: getRiskColor(station.risk_label) }}>{station.risk_label}</span></div>
                  <div>Water Level: {station.predicted_water_level_m?.toFixed(2)}m</div>
                  <div>Threshold: {station.flood_threshold_m.toFixed(2)}m</div>
                  <div className="text-xs mt-1">{station.risk_description}</div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default RiskMapLeaflet;
