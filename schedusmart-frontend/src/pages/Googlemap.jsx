import React from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/map-marker";

const location = {
    address: "Purdue University",
    lat: 40.42705717062981, 
    lng: -86.91647096088887,
};

const LocationPin = ({ text }) => (
    <div className="pin">
        <Icon icon={locationIcon} className="pin-icon" />
        <p className="pin-text">{text}</p>
    </div>
);

const Map = () => {
    return (
        <div className="map">
            <h2 className="map-h2">Come Visit Us At Our Campus</h2>
            <div className="google-map" style={{ height: '200px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM" }}
                    defaultCenter={{ lat: location.lat, lng: location.lng }}
                    defaultZoom={17}
                >
                    <LocationPin
                        lat={location.lat}
                        lng={location.lng}
                        text={location.address}
                    />
                </GoogleMapReact>
            </div>
        </div>
    );
};

export default Map;
