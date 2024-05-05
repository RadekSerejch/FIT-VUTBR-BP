/*
 * BP - Radek Šerejch, xserej00
 * FIT VUT, Božetěchova 2, 612 00 Brno, Česká republika
 *
 * 2024
 */

import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet"

//Komponenta pro zobrazení detektorů
function Detectors({points, show, detectorClick, isLoading}){
    
    const customIcon = new Icon({
        iconUrl: require("../img/location.png"),
        iconSize: [38,38]
    })
    
    return(
        <>
            {!isLoading && show && points.map((point, index) => (
                <Marker key={point.properties.LocationId} 
                        position={[point.geometry.coordinates[1],point.geometry.coordinates[0]]}
                        icon={customIcon}
                        eventHandlers={{
                        click: (e) => {
                            detectorClick(index)
                        },
                        mouseover: (event) => event.target.openPopup(),
                        }}
                        >
                <Popup>
                {point.properties.UnitName}
                </Popup>
                </Marker>
            ))
            }
        </>
    );
}

export default Detectors;