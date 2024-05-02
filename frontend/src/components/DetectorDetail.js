import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import filterIcon from '../img/filter.png';
import rightIcon from '../img/right.png';
import moment from 'moment';

import DiagramDetail from './DiagramDetail';
import DateFilter from './DateFilter';

//Komponenta pro detail detektoru
function DetectorDetail({show, closeFunction, detector, points}){
    const chartRef = useRef(null);

    //data z api
    const [history, setHistory] = useState([]);

    //data pro tabulku a grafy
    const [tableData, setTableData] = useState([]);
    const [pieChartData, setPieChartData] = useState([[],[]]);
    const [pieChartWeekData, setPieChartWeekData] = useState([[],[]]);
    const [pieChartHourData, setPieChartHourData] = useState([[],[]]);

    const [isLoading, setIsLoading] = useState(true);

    const [showDetail, setShowDetail] = useState(false);
    const [detailId, setDetailId] = useState(0);

    const [showFilter, setShowFilter] = useState(false);

    const [historyChartFiltered, setHistoryChartFiltered] = useState([]);
    
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);

    //data pro filtr
    const [selectedTimes, setSelectedTimes] = useState([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
    const [selectedDays, setSelectedDays] = useState([true, true, true, true, true, true, true]);
    const [selectedDateFirst, setSelectedDateFirst] = useState();
    const [selectedDateSecond, setSelectedDateSecond] = useState();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            const result = await fetch('http://localhost:3001/detectorsHis/' + detector.properties.LocationId)
            const jsonResult = await result.json();
            
            setHistory(jsonResult.features);
            
            //inicializace dat pro hranice datového filtru
            var minDateTmp = jsonResult.features[0].properties.EndOfInterval;
            var maxDateTmp = jsonResult.features[0].properties.EndOfInterval;
            
            jsonResult.features.forEach((element) => {
                    //hledání hranic datového filtru
                    if(moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').toDate() > moment(maxDateTmp, 'DD.MM.YYYY HH:mm').toDate()){
                        maxDateTmp = element.properties.EndOfInterval;
                    }
                    if(moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').toDate() < moment(minDateTmp, 'DD.MM.YYYY HH:mm').toDate()){
                        minDateTmp = element.properties.EndOfInterval;
                    }
            });
            
            //nastavení hranic datového filtru
            setMinDate(minDateTmp);
            setMaxDate(maxDateTmp);
            setSelectedDateFirst(moment(minDateTmp, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
            setSelectedDateSecond(moment(maxDateTmp, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
            //nastavení dat pro grafy
            filterData(moment(minDateTmp, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'), moment(maxDateTmp, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'), jsonResult.features, selectedDays, selectedTimes);

            setIsLoading(false);
        }

        if(detector != null){
            fetchData();
        }
    }, [detector])

    useEffect(() => {
        console.log("chart rendered")
      }, [chartRef]);


    const filterData = (dateStart, dateEnd, dataset, selectedDaysIn, selectedTimesIn) => {
        console.log(dateStart, dateEnd)
        
        console.log("filter started");
        var tmpArray = [];
        var tmpTableData = [];
        var cnt = 0;
        var cntDays = 0;
        var prevDate = null;

        //inicializace dat pro tabulku
        tmpTableData.push({direction: detector.properties.FirstDirection_Name, cyclists: 0, pedestrians: 0, avgCyclists: 0, avgPedestrians: 0})
        tmpTableData.push({direction: detector.properties.SecondDirection_Name, cyclists: 0, pedestrians: 0, avgCyclists: 0, avgPedestrians: 0})

        //inicializace dat pro grafy
        var tmpPieWeekData = [[],[]];
        tmpPieWeekData[0].push({name: "víkend", data: 0, color: "#da2127"});
        tmpPieWeekData[0].push({name: "všední den", data: 0, color: "#0B3954"});
        tmpPieWeekData[1].push({name: "víkend", data: 0, color: "#da2127"});
        tmpPieWeekData[1].push({name: "všední den", data: 0, color: "#0B3954"});
        var tmpPieHourData = [[],[]];
        tmpPieHourData[0].push({name: "den", data: 0, color: "#da2127"});
        tmpPieHourData[0].push({name: "noc", data: 0, color: "#0B3954"});
        tmpPieHourData[1].push({name: "den", data: 0, color: "#da2127"});
        tmpPieHourData[1].push({name: "noc", data: 0, color: "#0B3954"});
        
        dataset.forEach((element) => {
            //ověření, zda záznam odpovídá filtru
            const help1 = moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').toDate() >= moment(dateStart, 'YYYY-MM-DD').toDate()
            const help2 = moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').toDate() <= moment(dateEnd, 'YYYY-MM-DD').toDate()
            const help3 = selectedTimesIn[moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour()]
            const help4 = selectedDaysIn[moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').isoWeekday() - 1]
            if(moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').toDate() >= moment(dateStart, 'YYYY-MM-DD').toDate() && moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').toDate() <= moment(dateEnd, 'YYYY-MM-DD').toDate() &&
                selectedTimesIn[moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour()]  && selectedDaysIn[moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').isoWeekday() - 1]){
                
                //přidání dat pro tabulku
                tmpTableData[0].cyclists += element.properties.FirstDirection_Cyclists;
                tmpTableData[1].cyclists += element.properties.SecondDirection_Cyclists;
                tmpTableData[0].pedestrians += element.properties.FirstDirection_Pedestrians;
                tmpTableData[1].pedestrians += element.properties.SecondDirection_Pedestrians;
                
                //přidání dat pro spojitý graf s historií záznamů
                tmpArray.push({time: element.properties.EndOfInterval, cyclists: element.properties.FirstDirection_Cyclists + element.properties.SecondDirection_Cyclists, pedestrians: element.properties.FirstDirection_Pedestrians + element.properties.SecondDirection_Pedestrians})
                
                //počítání záznamů
                cnt++;

                //počítání dnů
                if(prevDate == null || !moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').isSame(prevDate, 'day')){
                    cntDays++;
                    prevDate = moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm');
                }

                //přidání dat pro graf všední den/víkend
                if(moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').isoWeekday() < 6){
                    //vsedni
                    tmpPieWeekData[0][1].data += element.properties.FirstDirection_Cyclists + element.properties.FirstDirection_Pedestrians;
                    tmpPieWeekData[1][1].data += element.properties.SecondDirection_Cyclists + element.properties.SecondDirection_Pedestrians;
                }
                else{
                    //vikend
                    tmpPieWeekData[0][0].data += element.properties.FirstDirection_Cyclists + element.properties.FirstDirection_Pedestrians;
                    tmpPieWeekData[1][0].data += element.properties.SecondDirection_Cyclists + element.properties.SecondDirection_Pedestrians;
                }

                //přidání dat pro graf den/noc
                if(moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour() > 6 && moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour() <= 22)
                {
                    tmpPieHourData[0][0].data += element.properties.FirstDirection_Cyclists + element.properties.FirstDirection_Pedestrians;
                    tmpPieHourData[1][0].data += element.properties.SecondDirection_Cyclists + element.properties.SecondDirection_Pedestrians;
                }
                else
                {
                    tmpPieHourData[0][1].data += element.properties.FirstDirection_Cyclists + element.properties.FirstDirection_Pedestrians;
                    tmpPieHourData[1][1].data += element.properties.SecondDirection_Cyclists + element.properties.SecondDirection_Pedestrians;
                }
            }
        })

        //nastavení dat pro grafy den/noc a všední den/víkend
        setPieChartWeekData(tmpPieWeekData);
        setPieChartHourData(tmpPieHourData);

        //doplnění dat pro tabulku
        tmpTableData[0].avgCyclists = Math.round(tmpTableData[0].cyclists / cnt);
        tmpTableData[1].avgCyclists = Math.round(tmpTableData[1].cyclists / cnt);
        tmpTableData[0].avgPedestrians = Math.round(tmpTableData[0].pedestrians / cnt);
        tmpTableData[1].avgPedestrians = Math.round(tmpTableData[1].pedestrians / cnt);
        tmpTableData[0].avgCyclistsDays = Math.round(tmpTableData[0].cyclists / cntDays);
        tmpTableData[1].avgCyclistsDays = Math.round(tmpTableData[1].cyclists / cntDays);
        tmpTableData[0].avgPedestriansDays = Math.round(tmpTableData[0].pedestrians / cntDays);
        tmpTableData[1].avgPedestriansDays = Math.round(tmpTableData[1].pedestrians / cntDays);
        setTableData(tmpTableData);

        //nastavení dat pro graf historie záznamů
        setHistoryChartFiltered(tmpArray);

        //nastavení dat pro graf cyklsité/chodci
        var tmpPieData = [[],[]];
        tmpPieData[0].push({name: "cyklistů", data: tmpTableData[0].cyclists, color: "#da2127", direction: detector.properties.FirstDirection_Name});
        tmpPieData[0].push({name: "chodců", data: tmpTableData[0].pedestrians, color: "#0B3954", direction: detector.properties.FirstDirection_Name});
        tmpPieData[1].push({name: "cyklistů", data: tmpTableData[1].cyclists, color: "#da2127", direction: detector.properties.SecondDirection_Name});
        tmpPieData[1].push({name: "chodců", data: tmpTableData[1].pedestrians, color: "#0B3954", direction: detector.properties.SecondDirection_Name});
        setPieChartData(tmpPieData);

        console.log("filter ended");
    }

    //funkce pro ovládání kliknutí na tlačítko filtrovat
    const filterDataClick = (dateFirst, dateSecond, selectedDaysIn, selectedTimesIn) => {
        filterData(dateFirst, dateSecond, history, selectedDaysIn, selectedTimesIn);
    }

    //funkce pro ovládání klinutí na detail grafu
    const chartDetailClick = (id) => {
        setDetailId(id);
        setShowDetail(true);
    }

    //funkce pro ovládání zavření detailu
    const chartDetailClose = () => {
        setShowDetail(false);
    }

    return(
        show?
        <div id="detail">
            <div className='rightIcon'><img src={rightIcon} alt='close' onClick={() => {closeFunction()}}></img></div>
            <div className='filterIcon'><img src={filterIcon} alt='filter' onClick={() => {setShowFilter(!showFilter)}}></img></div>
            
            { isLoading || !detector ?<><p>Načítání...</p> <img src='./Spinner-1s-200px.svg'></img></> : 
            <div className='detailData'>
            <div id="detectorTable">
            <table>
                <tbody>
                <tr>
                <td colSpan={3}><h2 style={{color:"#black"}}>{detector.properties.UnitName}</h2></td>
                </tr>
                <tr>
                <td></td>
                <td colSpan={2}>směr</td>
                </tr>
                <tr>
                <td></td>
                <td><h3 style={{color:"#0B3954"}}>{detector.properties.FirstDirection_Name}</h3></td>
                <td><h3 style={{color:"#da2127"}}>{detector.properties.SecondDirection_Name}</h3></td>
                </tr>
                <tr>
                <td><h4>cyklistů</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].cyclists}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].cyclists}</h4></td>
                </tr>
                <tr>
                <td><h4>chodců</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].pedestrians}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].pedestrians}</h4></td>
                </tr>
                <tr>
                <td><h4>celkem</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].cyclists + tableData[0].pedestrians}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].cyclists + tableData[1].pedestrians}</h4></td>
                </tr>
                <tr>
                <td><h4>průměr cyklistů za hodinu</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].avgCyclists}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].avgCyclists}</h4></td>
                </tr>
                <tr>
                <td><h4>průměr chodců za hodinu</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].avgPedestrians}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].avgPedestrians}</h4></td>
                </tr>
                <tr>
                <td><h4>průměr cyklistů za den</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].avgCyclistsDays}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].avgCyclistsDays}</h4></td>
                </tr>
                <tr>
                <td><h4>průměr chodců za den</h4></td>
                <td><h4 style={{color:"#0B3954"}}>{tableData[0].avgPedestriansDays}</h4></td>
                <td><h4 style={{color:"#da2127"}}>{tableData[1].avgPedestriansDays}</h4></td>
                </tr>
                </tbody>
            </table>
            </div>

            <div className='directions'>
                <div className='directionName'><h3>{detector.properties.FirstDirection_Name}</h3></div>
                <div className='directionName'><h3>{detector.properties.SecondDirection_Name}</h3></div>
            </div>
            
            
            <div className='diagramBlock' style={{height: "300px"}} onClick={() => {chartDetailClick(0)}}>
                <h3>poměr cyklistů a chodců</h3>
                <ResponsiveContainer width="100%" height="50%">
                    <PieChart width={400} height={400}>
                        <Pie data={pieChartData[0]} dataKey="data" cx="25%" cy="50%" outerRadius={40} fill="#da2127"  label legendType='none'>
                        {pieChartData[0].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Pie data={pieChartData[1]} dataKey="data" cx="75%" cy="50%" outerRadius={40} fill="#da2127" label legendType='plain'>
                        {pieChartData[1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height="40%" style={{margin: '0 auto'}}>
                    <BarChart
                    width={500}
                    height={300}
                    data={tableData}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 40,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="direction"/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cyclists" fill="#da2127" stackId="1" activeBar={<Rectangle fill="#ae1a20" stroke="" />} legendType='plain' name="Cyklisté"/>
                    <Bar dataKey="pedestrians" fill="#0B3954" stackId="1" activeBar={<Rectangle fill="#0B3954" stroke="" />} legendType='plain' name="Chodci"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className='diagramBlock' onClick={() => {chartDetailClick(1)}}>
            <h3>poměr provozu o víkendu a všední den</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart width={400} height={400}>
                        <Pie data={pieChartWeekData[0]} dataKey="data" cx="25%" cy="50%" outerRadius={40} fill="#da2127"  label legendType='none'>
                        {pieChartWeekData[0].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Pie data={pieChartWeekData[1]} dataKey="data" cx="75%" cy="50%" outerRadius={40} fill="#da2127" label legendType='plain'>
                        {pieChartWeekData[1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className='diagramBlock' onClick={() => {chartDetailClick(2)}}>
                <h3>poměr provozu ve dne a v noci</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart width={400} height={400}>
                        <Pie data={pieChartHourData[0]} dataKey="data" cx="25%" cy="50%" outerRadius={40} fill="#da2127"  label legendType='none'>
                        {pieChartHourData[0].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Pie data={pieChartHourData[1]} dataKey="data" cx="75%" cy="50%" outerRadius={40} fill="#da2127" label legendType='plain'>
                        {pieChartHourData[1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={{height: "200px"}} id='lineChart'>
            <h3>Jednotlivé záznamy detektoru</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                ref={chartRef}
                width={500}
                height={300}
                data={historyChartFiltered}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                
                <Line type="monotone" dataKey="cyclists" stroke="#da2127" dot={false} strokeWidth={3} name='cyklisté'/>
                <Line type="monotone" dataKey="pedestrians" stroke="#0B3954" dot={false} strokeWidth={3} name='chodci'/>
                </LineChart>
            </ResponsiveContainer>
            </div>

            <DateFilter showFilter={showFilter} isLoading={isLoading} minDate={minDate} maxDate={maxDate} filterData={filterDataClick} setSelectedDaysOuter={setSelectedDays} setSelectedTimesOuter={setSelectedTimes} selectedTimesIn={selectedTimes} selectedDaysIn={selectedDays}></DateFilter>
            
            {
                showDetail ? <DiagramDetail type={detailId} detectors={points} closeFunction={chartDetailClose}/> : null
            }
            </div>}
        </div>

        : null
    )
}

export default DetectorDetail;