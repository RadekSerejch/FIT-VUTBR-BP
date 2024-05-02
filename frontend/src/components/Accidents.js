import { Icon, divIcon, point } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import moment from "moment";

//Komponenta pro zobrazení nehod do mapy
function Accidents ({data, show, setSelectedAccident}){

    const customIcon = new Icon({
        iconUrl: require("../img/accident.png"),
        iconSize: [38,38]
    })

    //funkce pro vytvoření vlastní ikony pro clustery ikon
    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            iconSize: point(32, 32, true)
        });
    }


    return(
        show? 
        <div>
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createCustomClusterIcon}
                polygonOptions={{
                    fillColor: '#ffffff',
                    color: '#f00800',
                    weight: 5,
                    opacity: 1,
                    fillOpacity: 0.8,
                  }}
            >
            {data && data.map((point, index) => (
                    <Marker key={point.properties.objectid} 
                            position={[point.geometry.coordinates[1],point.geometry.coordinates[0]]}
                            icon={customIcon}
                            eventHandlers={{
                              click: (e) => {
                                setSelectedAccident(point.properties.objectid);
                              },
                              mouseover: (event) => event.target.openPopup(),
                            }}
                            >
                      <Popup>
                      {moment(point.properties.datum).format('DD.MM.YYYY')}
                      </Popup>
                    </Marker>
                  ))
            }
            </MarkerClusterGroup>
            
        </div>
        : null 
    );
}

export default Accidents;