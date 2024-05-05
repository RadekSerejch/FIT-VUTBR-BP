/*
 * BP - Radek Šerejch, xserej00
 * FIT VUT, Božetěchova 2, 612 00 Brno, Česká republika
 *
 * 2024
 */

import { useEffect, useState } from 'react';
import closeIcon from '../img/close.png';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
function DiagramDetail({type, detectors, closeFunction}){
    //data pro diagram
    const [diagramData, setDiagramData] = useState([]);
    //indikátor načtení
    const [loaded, setLoaded] = useState(false);
    //popisky pro diagram
    const [diagramProperties, setDiagramProperties] = useState({Key1: "", Key2: "", Name1: "", Name2: ""});

    useEffect(() => {
        const fetchData = async () => {
            var jsonResult = null;
            var result = null
            //načtení dat podle typu grafu, který má být zobrazen
            switch(type){
                case 0:
                    result = await fetch('http://localhost:3001/compareCyclistsPedestrians')
                    jsonResult = await result.json();
                    setDiagramProperties({Key1: "cyclists", Key2: "pedestrians", Name1: "Cyklisté", Name2: "Chodci"});
                    break;
                case 1:
                    result = await fetch('http://localhost:3001/compareWeekWeekend')
                    jsonResult = await result.json();
                    setDiagramProperties({Key1: "week", Key2: "weekend", Name1: "Všední den", Name2: "Víkend"});
                    break;
                case 2:
                    result = await fetch('http://localhost:3001/compareDayNight')
                    jsonResult = await result.json();
                    setDiagramProperties({Key1: "day", Key2: "night", Name1: "Den", Name2: "Noc"});
                    break;
                default:
                    break;
            }
            //vytvoření dat pro graf 
            if(detectors.length > 0){
                var helpArray = [];
                jsonResult.forEach((element) => {
                    
                    const help = detectors.find(objekt => objekt.properties.LocationId === element.id);
                    if(help !== undefined){
                        helpArray.push({...element, name: help.properties.UnitName})
                    }
                })
                setDiagramData([...helpArray])
                setLoaded(true);
            }
        }
        if(!loaded){
            fetchData();
        }
    }, [])

    return(
        <div className="DiagramDetailBackground">
            <div className="DiagramDetail">
                <img src={closeIcon} alt='close' onClick={() => {closeFunction()}}></img>
                <h4>Srovnání všech detektorů</h4>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart
                    width={500}
                    height={300}
                    data={diagramData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={diagramProperties.Key1} fill="#da2127" stackId={1} name={diagramProperties.Name1} activeBar={<Rectangle fill="#ae1a20" stroke="" />} />
                    <Bar dataKey={diagramProperties.Key2} fill="#0B3954" stackId={1} name={diagramProperties.Name2} activeBar={<Rectangle fill="#0B3954" stroke="" />} />
                    </BarChart>
                </ResponsiveContainer>
                {!loaded && 
                <div className='loadingDivDiagram'>
                    <img src='./Spinner-1s-200px.svg' alt='Loading...'></img>
                    <p>Toto bude nejspíše chvíli trvat...</p>
                </div>
                }
            </div>
        </div>
    )
}

export default DiagramDetail;