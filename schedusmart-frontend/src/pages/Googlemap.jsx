// import React, { useState, useEffect } from "react";
// import GoogleMapReact from "google-map-react";
// import { Icon } from "@iconify/react";
// import locationIcon from "@iconify/icons-mdi/map-marker";
// // import "./Googlemap.css"

// const Map = () => {
//     const [location, setLocation] = useState("");
//     const [mapCenter, setMapCenter] = useState({ lat: 40.42705717062981, lng: -86.91647096088887 });
//     let autocomplete;

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM&libraries=places&callback=initAutocomplete`;
//         script.defer = true;
//         script.async = true;
//         window.initAutocomplete = () => {
//             autocomplete = new window.google.maps.places.Autocomplete(
//                 document.getElementById('autocomplete'),
//                 {
//                     types: ['establishment'],
//                     componentRestrictions: { country: ['US'] },
//                     fields: ['place_id', 'geometry', 'name']
//                 }
//             );
//             autocomplete.addListener('place_changed', onPlaceChanged);
//         };
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []); 

//     const onPlaceChanged = () => {
//         let place = autocomplete.getPlace();
//         if (!place.geometry) {
//             document.getElementById('autocomplete').placeholder = 'Enter a place';
//         } else {
//             setMapCenter({
//                 lat: place.geometry.location.lat(),
//                 lng: place.geometry.location.lng()
//             });
//             setLocation(place.formatted_address);
//         }
//     };

//     return (
//         <div className="map">
//             <div className="search-container">
//                 <input
//                     id="autocomplete"
//                     type="text"
//                     placeholder="Enter location"
//                     value={location}
//                     onChange={(event) => setLocation(event.target.value)}
//                 />
//             </div>
//             <div className="google-map" style={{ height: '200px', width: '150%' }}>
//                 <GoogleMapReact
//                     bootstrapURLKeys={{ key: "AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM" }}
//                     center={mapCenter}
//                     defaultZoom={14}
//                 >
//                     <div
//                         lat={mapCenter.lat}
//                         lng={mapCenter.lng}
//                     >
//                         <Icon icon={locationIcon} className="pin-icon" />
//                         <p className="pin-text">{location}</p>
//                     </div>
//                 </GoogleMapReact>
//             </div>
//         </div>
//     );
// };

// export default Map;



import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/map-marker";

const Map = () => {
    const [location, setLocation] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 40.42705717062981, lng: -86.91647096088887 });
    let autocomplete;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM&libraries=places&callback=initAutocomplete`;
        script.defer = true;
        script.async = true;
        window.initAutocomplete = () => {
            autocomplete = new window.google.maps.places.Autocomplete(
                document.getElementById('autocomplete'),
                {
                    types: ['establishment'],
                    componentRestrictions: { country: ['US'] },
                    fields: ['place_id', 'geometry', 'name']
                }
            );
            autocomplete.addListener('place_changed', onPlaceChanged);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []); 

    const onPlaceChanged = () => {
        let place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            document.getElementById('autocomplete').placeholder = 'Enter a place';
        } else {
            setMapCenter({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
            setLocation(place.formatted_address);
        }
    };

    return (
        <div className="map">
            <div className="search-container">
                <input
                    id="autocomplete"
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                />
            </div>
            <div className="google-map" style={{ height: '200px', width: '200%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM" }}
                    center={mapCenter}
                    defaultZoom={14}
                >
                    <div
                        lat={mapCenter.lat}
                        lng={mapCenter.lng}
                    >
                        <Icon icon={locationIcon} className="pin-icon" />
                        <p className="pin-text">{location}</p>
                    </div>
                </GoogleMapReact>
            </div>
        </div>
    );
};

export default Map;

