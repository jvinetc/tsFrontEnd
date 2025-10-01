import { GoogleMap, Marker, LoadScript, InfoWindow } from '@react-google-maps/api';
import 'leaflet/dist/leaflet.css';
import type { IStop } from '../interface/Stop';
import { useEffect, useRef, useState } from 'react';

const MapView = ({ stops, activeStopId, setActiveStopId }: { stops: IStop[], activeStopId: number, setActiveStopId: (value: number | null) => void }) => {

    const mapKey = import.meta.env.VITE_MAP_KEY;
    const [stop, setStop] = useState<IStop | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [mapsApi, setMapsApi] = useState<typeof google.maps | null>(null);
    useEffect(() => {
        const selectedStop = stops.find((s) => s.id === activeStopId);
        if (selectedStop && mapRef.current) {
            mapRef.current.panTo({ lat: selectedStop.lat ?? 0, lng: selectedStop.lng ?? 0 });
            mapRef.current.setZoom(15);
        }
    }, [activeStopId]);
   

    return (
        <LoadScript googleMapsApiKey={mapKey}>
            <GoogleMap center={{ lat: -33.45, lng: -70.66 }} zoom={12}
                mapContainerStyle={{ width: '100%', height: '100%' }} onLoad={(map) => {
                    mapRef.current = map;
                    setMapsApi(window.google.maps);
                }}>
                {mapsApi && stops.map((s: IStop) => {
                    const initial = s.Driver?.User?.firstName?.charAt(0).toUpperCase() || '';
                    const initStatus = s.status?.charAt(0).toUpperCase() || '';
                    return (
                        <Marker key={s.Sell && s.status === 'pickUp' ? s.sellId : s.id}
                            position={{
                                lat: s.Sell && s.status === 'pickUp' ? Number(s.Sell.lat) : s.lat ?? 0,
                                lng: s.Sell && s.status === 'pickUp' ? Number(s.Sell.lng) : s.lng ?? 0
                            }}

                            label={initial ? { text: `${initial}-${initStatus}`, color: 'black', fontSize: '14px' } : initStatus}
                            icon={{
                                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                scaledSize: new mapsApi.Size(
                                    activeStopId === s.Sell && s.status === 'pickUp' ? s.sellId ? 65 : 55 : s.id ? 65 : 55,
                                    activeStopId === s.Sell && s.status === 'pickUp' ? s.sellId ? 65 : 55 : s.id ? 65 : 55
                                ),
                            }}
                            onClick={() => {
                                setActiveStopId(s.Sell && s.status === 'pickUp' ? Number(s.sellId) : Number(s.id));
                                setStop(s);
                            }} />
                    )
                })}
                {stop && (
                    <InfoWindow
                        position={{
                            lat: stop.Sell && stop.status === 'pickUp' ? Number(stop.Sell.lat) : stop.lat ?? 0,
                            lng: stop.Sell && stop.status === 'pickUp' ? Number(stop.Sell.lng) : stop.lng ?? 0
                        }}
                        onCloseClick={() => {
                            setActiveStopId(null)
                            setStop(null);
                        }}
                    >
                        <div>
                            <strong>{stop.addresName}</strong><br />
                            {stop.addres}, {stop.Comuna?.name}<br />
                            {stop.status === 'pickUp' && `Retiro: ${stop.Sell?.addres}, ${stop.Sell?.Comuna?.name} < br />`}
                            Conductor: {stop.Driver?.User?.firstName} {stop.Driver?.User?.lastName}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>

    )
};

export default MapView;