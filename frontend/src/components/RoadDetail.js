import { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import rightIcon from '../img/right.png';

//Komponenta detailu cesty
function RoadDetail({show, closeFunction, road, road_scitani}){
    //data modelu bikeToWork
    const [data, setData] = useState([]);
    //data modelu census
    const [censusData, setCensusData] = useState([])
    
    useEffect(() =>{
        //nastavení dat pro diagramy
        if(road != null){
            const tempData = [{name: "2018", amount: road.properties.data_2018},
                            {name: "2019", amount: road.properties.data_2019},
                            {name: "2020", amount: road.properties.data_2020},
                            {name: "2021", amount: road.properties.data_2021},
                            {name: "2022", amount: road.properties.dpnk_22}];
            setData(tempData);
        }
        if(road_scitani != null){
            const tempData = [{name: "2016", víkend: road_scitani.properties.vik_2016 * 10, všední: road_scitani.properties.prac_2016 * 10},
                            {name: "2018", víkend: road_scitani.properties.vik_2018 * 10, všední: road_scitani.properties.prac_2018 * 10},
                            {name: "2020", víkend: road_scitani.properties.vik_2020 * 10, všední: road_scitani.properties.prac_2020 * 10},
                            {name: "2022", víkend: road_scitani.properties.vik_2022 * 10, všední: road_scitani.properties.prac_2022 * 10}];
            setCensusData(tempData);

        }
    }, [road, road_scitani])
    
    //část pro mdoel sčítání
    const returnScitani = () => {
        return road_scitani?
        <div className='raodBlock' style={{height: '350px'}}>
        <h2>Sčítání</h2>
        <div className='roadTable'>
        <table>
            <tbody>
                <tr>
                    <td></td>
                    <td><h4 style={{color:"#da2127"}}>víkend</h4></td>
                    <td><h4 style={{color:"#0B3954"}}>všední den</h4></td>
                </tr>
                <tr>
                    <td><h4>2016</h4></td>
                    <td><h4 style={{color:"#da2127"}}>{road_scitani.properties.vik_2016 * 10}</h4></td>
                    <td><h4 style={{color:"#0B3954"}}>{road_scitani.properties.prac_2016 * 10}</h4></td>
                </tr>
                <tr>
                    <td><h4>2018</h4></td>
                    <td><h4 style={{color:"#da2127"}}>{road_scitani.properties.vik_2018 * 10}</h4></td>
                    <td><h4 style={{color:"#0B3954"}}>{road_scitani.properties.prac_2018 * 10}</h4></td>
                </tr>
                <tr>
                    <td><h4>2020</h4></td>
                    <td><h4 style={{color:"#da2127"}}>{road_scitani.properties.vik_2020 * 10}</h4></td>
                    <td><h4 style={{color:"#0B3954"}}>{road_scitani.properties.prac_2020 * 10}</h4></td>
                </tr>
                <tr>
                    <td><h4>2022</h4></td>
                    <td><h4 style={{color:"#da2127"}}>{road_scitani.properties.vik_2022 * 10}</h4></td>
                    <td><h4 style={{color:"#0B3954"}}>{road_scitani.properties.prac_2022 * 10}</h4></td>
                </tr>
            </tbody>
        </table>
        </div>
        <ResponsiveContainer width="100%" height="40%">
            <BarChart
            width={500}
            height={300}
            data={censusData}
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
            <Bar dataKey="víkend" fill="#da2127" activeBar={<Rectangle fill="#ae1a20" stroke="" />} />
            <Bar dataKey="všední" fill="#0B3954" activeBar={<Rectangle fill="#0B3954" stroke="" />} />
            </BarChart>
        </ResponsiveContainer>
        </div>
        : null;
    }

    //část pro bikeToWork
    const returnBikeToWork = () => {
        return road?
            <div className='raodBlock' style={{height:"300px"}}>
                <h2>BikeToWork</h2>
                
                <div className='roadTable'>
                    <table>
                        <tbody>
                            <tr>
                                <td><h4 >2018</h4></td>
                                <td><h4 >2019</h4></td>
                                <td><h4 >2020</h4></td>
                                <td><h4 >2021</h4></td>
                                <td><h4 >2022</h4></td>
                            </tr>
                            <tr>
                                <td><h4 style={{color:"#da2127"}}>{road.properties.data_2018}</h4></td>
                                <td><h4 style={{color:"#da2127"}}>{road.properties.data_2019}</h4></td>
                                <td><h4 style={{color:"#da2127"}}>{road.properties.data_2020}</h4></td>
                                <td><h4 style={{color:"#da2127"}}>{road.properties.data_2021}</h4></td>
                                <td><h4 style={{color:"#da2127"}}>{road.properties.dpnk_22}</h4></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                

                <ResponsiveContainer width="100%" height="50%">
                    <BarChart
                    width={500}
                    height={300}
                    data={data}
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
                    <Bar dataKey="amount" fill="#da2127" activeBar={<Rectangle fill="#ae1a20" stroke="" />} name="cyklsitů" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        : null;
    }

    return(
        show?
        <div id="detail">
            <div className='rightIcon'><img src={rightIcon} alt='close' onClick={() => {closeFunction()}}></img></div>
            <div className='detailData'>
                {returnBikeToWork()}
                {returnScitani()}
            </div>
        </div>

        : null
    )
}

export default RoadDetail;