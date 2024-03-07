import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet"
// import { RoutingMachine } from "react-leaflet-routing-machine";
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import getGeocode from "./getGeoCode";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import { Prev } from "react-bootstrap/esm/PageItem";
function RoutingMachine({ waypoints }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        console.log("waypoints are:", waypoints)
        const routingControl = L.Routing.control({
            waypoints:
                waypoints?.map(coords => {
                    console.log('coords are:', typeof coords)
                    console.log(coords.latLng[0], coords.latLng[1])

                    return L.latLng(coords.latLng[0], coords.latLng[1])
                }),

            // [L.latLng(16.506, 80.648),
            //     L.latLng(17.384, 78.4866),
            //     L.latLng(12.971, 77.5945)
            // ]            ,
            // router: new L.Routing.GraphHopper("3c01185e-9fb4-411a-97f3-fc677dd1fcc3"),
            // lineOptions: {
            //     styles: [{ color: "#00ab55", weight: 4 }]
            // },
            // collapsible: false,
            show: true,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            addWaypoints: false
        }).addTo(map);
        routingControl.on("routesfound", function (e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            console.log(Math.floor(summary.totalDistance / 1000) + " km");
            // alert distance and time in km and minutes
            //alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
        });
        return () => {
            map.removeControl(routingControl)
        }
    }, [map])

    return null;
}

export const Map = React.forwardRef((props) => {
    const customIcon = L.icon({
        iconUrl: 'https://www.clker.com/cliparts/m/x/7/l/N/z/location-marker-md.png',
        iconSize: [20, 50], // size of the icon
        popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
    });

    const [data, setData] = useState(props.data);
    // Default map center coordinates
    // const center = [51.505, -0.09];
    const [centerpin, setCenter] = useState([51.52, -0.13]); // Default map center coordinates
    // const routeCoordinates = [[51.515, -0.1], [51.52, -0.12]]; // Example route coordinates

    const [place, setPlace] = useState(['Dwarka,New Delhi', props.destination]);
    const [geocode, setGeocode] = useState(null);
    const refMap = useRef()
    const handleSearch = async () => {
        try {
            const results = await Promise.all(place.map(p => getGeocode(p)));
            console.log(results);
            const geocodes = results.map(result => [result.lat, result.lon]);
            setGeocode(geocodes);
            // If you want to set the center to the first result
            if (results[0]) {
                setCenter([results[0].lat, results[0].lon]);
            }
        } catch (error) {
            // Handle error (e.g., display a message to the user)
            console.error('Error in handleSearch:', error);
        }
    };
    useEffect(() => {
        handleSearch();
    }, [place]); // Trigger handleSearch when the place changes


    useEffect(() => {
        if (refMap.current) {
            refMap.current.setView(centerpin, 13)
        }
        console.log("ref map connected")
        console.log("geocordinate=>", centerpin);
    }, [centerpin])

    return (
        centerpin.length !== 0 && !areArraysEqual(centerpin, [51.52, -0.13]) &&
        <MapContainer
            center={centerpin}
            zoom={13}
            style={{ height: '500px', width: '100%' }}
            ref={refMap}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <RoutingMachine
                position="topright"
                waypoints={geocode.map(coords => ({ latLng: coords }))}
            />
            {geocode && geocode.map((coords, index) => (

                <Marker key={index} position={coords} icon={customIcon}>
                    <Popup>

                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
});


const areArraysEqual = (array1, array2) => {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
};

