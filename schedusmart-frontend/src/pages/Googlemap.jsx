import React, { useState, useEffect } from "react";

const Map = () => {
    const [location, setLocation] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 40.42705717062981, lng: -86.91647096088887 });
    let autocomplete;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM&libraries=places&callback=initMap`;
        script.defer = true;
        script.async = true;
        window.initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: mapCenter,
                zoom: 14
            });
            autocomplete = new window.google.maps.places.Autocomplete(
                document.getElementById('autocomplete'),
                {
                    types: ['establishment'],
                    componentRestrictions: { country: ['US'] },
                    fields: ['place_id', 'geometry', 'name']
                }
            );
            autocomplete.bindTo('bounds', map);
            map.addListener('tilesloaded', () => {
                autocomplete.addListener('place_changed', onPlaceChanged);
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [mapCenter]); 

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

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };

    return (
        <div className="map">
            <div className="search-container">
                <input
                    id="autocomplete"
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={handleInputChange}
                />
            </div>
            <div id="map" className="google-map" style={{ height: '200px', width: '200%' }}></div>
        </div>
    );
};

export default Map;
