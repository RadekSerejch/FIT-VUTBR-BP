import './App.css';
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react';
import DetectorDetail from './components/DetectorDetail.js'
import { v4 as uuidv4 } from 'uuid';
import { MapContainer, TileLayer } from 'react-leaflet';
import RoadDetail from './components/RoadDetail.js';
import DataSetsPicker from './components/DatasetsPicker.js';

import Heatmap from './components/Heatmap.js';
import Accidents from './components/Accidents.js';
import AccidentDetail from './components/AccidentDetail.js';
import Detectors from './components/Detectors.js';

function App() {
  const [points, setPoints] = useState([])
  
  const [showDetector, setShowDetector] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showRoad, setShowRoad] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [selectedRoadCensus, setSelectedRoadCensus] = useState(null);

  const [accidents, setAccidents] = useState([]);
  const [showAccident, setShowAccident] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null); 
  const [showAccidentDetail, setShowAccidentDetail] = useState(false);

  const [model, setModel] = useState([]);

  const [bikeToWork, setBikeToWork] = useState([]);
  const [census, setCensus] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  
  const [bikeToWorkMap, setBikeToWorkMap] = useState({});
  const [maxBikeToWork, setMaxBikeToWork] = useState([0,0,0,0,0]);
  const [maxCensus, setMaxCensus] = useState([0,0,0,0,0,0,0,0]);
  const [weights, setWeights] = useState([]);
  const [roadKeys, setRoadKeys] = useState([]);
  const [useDataset, setUseDataset] = useState([true, true, true, false]);

  const [bikeToWorkHeatmap, setBikeToWorkHeatmap] = useState([true, true, true, true, true]);
  const [censusHeatmap, setCensusHeatmap] = useState([true, true, true, true, true, true, true, true]);

  const [errorLoading, setErrorLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      console.log(isLoading);
      setIsLoading(true);
      
      var resultDetectors, jsonResultDetectors, resultAll, jsonResultAll, resultBikeToWork, jsonResultBikeToWork, resultCensus, jsonResultCensus;

      try{
        resultDetectors = await fetch('http://localhost:3001/detectors')
        jsonResultDetectors = await resultDetectors.json();

        resultAll = await fetch('http://localhost:3001/fullModel')
        jsonResultAll = await resultAll.json();

        resultBikeToWork = await fetch('http://localhost:3001/bikeToWork')
        jsonResultBikeToWork = await resultBikeToWork.json();

        resultCensus = await fetch('http://localhost:3001/census')
        jsonResultCensus = await resultCensus.json();
      }catch (e){
        setErrorLoading(e);
        return;
      }

      setPoints(jsonResultDetectors.features)
      setModel(jsonResultAll.features);
      setBikeToWork(jsonResultBikeToWork.features);

      const tempMap = new Map();
      var tempMax = [0,0,0,0,0];
      jsonResultBikeToWork.features.forEach((element,index) => {
        //debugger
        if(element.properties.data_2018 > tempMax[0]){
          tempMax[0] = element.properties.data_2018;
        }
        if(element.properties.data_2019 > tempMax[1]){
          tempMax[1] = element.properties.data_2019;
        }
        if(element.properties.data_2020 > tempMax[2]){
          tempMax[2] = element.properties.data_2020;
        }
        if(element.properties.data_2021 > tempMax[3]){
          tempMax[3] = element.properties.data_2021;
        }
        if(element.properties.dpnk_22 > tempMax[4]){
          tempMax[4] = element.properties.dpnk_22;
        }
        tempMap.set(element.properties.GID_ROAD, index);
      });
      setMaxBikeToWork([...tempMax])
      setBikeToWorkMap(tempMap);

      
      var tempMaxCensus = [0,0,0,0,0,0,0,0];
      jsonResultCensus.features.forEach((element) => {
        if(element.properties.vik_2016 > tempMaxCensus[0]){
          tempMaxCensus[0] = element.properties.vik_2016;
        }
        if(element.properties.prac_2016 > tempMaxCensus[1]){
          tempMaxCensus[1] = element.properties.vik_2016;
        }
        if(element.properties.vik_2018 > tempMaxCensus[2]){
          tempMaxCensus[2] = element.properties.vik_2016;
        }
        if(element.properties.prac_2018 > tempMaxCensus[3]){
          tempMaxCensus[3] = element.properties.vik_2016;
        }
        if(element.properties.vik_2020 > tempMaxCensus[4]){
          tempMaxCensus[4] = element.properties.vik_2016;
        }
        if(element.properties.prac_2020 > tempMaxCensus[5]){
          tempMaxCensus[5] = element.properties.vik_2016;
        }
        if(element.properties.vik_2022 > tempMaxCensus[6]){
          tempMaxCensus[6] = element.properties.vik_2016;
        }
        if(element.properties.prac_2022 > tempMaxCensus[7]){
          tempMaxCensus[7] = element.properties.vik_2016;
        }
      })
      const updatedMaxCensus = tempMaxCensus.map(item => item * 10);
      setMaxCensus([...updatedMaxCensus]);
      setCensus(jsonResultCensus.features);


      const calculatedWeights = jsonResultAll.features.map(fullmodel => getWeight(jsonResultBikeToWork.features[tempMap.get(fullmodel.properties.biketowork_id)], jsonResultCensus.features.find(objekt => objekt.properties.ObjectId === fullmodel.properties.city_census_id), tempMax, updatedMaxCensus));
      console.log(calculatedWeights.length);
      setKeys(calculatedWeights.length);
      setWeights([...calculatedWeights]);

      setIsLoading(false);
      
    }

    
    if(!isLoading){
      console.log("loading data");
      fetchData();
    }
    
  }, [])

  const setKeys = (size) => {
    if(roadKeys.length === 0){
      const array = Array.from({ length: size }, (_, index) => uuidv4())
      setRoadKeys([...array]);
    }
    else{
      const incrementedNumbers = roadKeys.map(() => uuidv4());
      setRoadKeys(incrementedNumbers);
    }
    console.log("a");
  }

  const LoadAccidents = async () => {
    if(accidents.length === 0){
      const result = await fetch('http://localhost:3001/accidents')
      const jsonResult = await result.json();
      console.log(jsonResult);
      setAccidents(jsonResult.features);
    }
    else{
      setShowAccident(true);
    }
  }

  useEffect(() => {
    if(accidents.length > 0){
      setShowAccident(true);
    }
  }, [accidents])

  useEffect(() =>{
    //debugger
      if(bikeToWorkMap.size > 0 && maxCensus !== 0){
        const calculatedWeights = model.map(fullmodel => getWeight(bikeToWork[bikeToWorkMap.get(fullmodel.properties.biketowork_id)], census.find(objekt => objekt.properties.ObjectId === fullmodel.properties.city_census_id), maxBikeToWork, maxCensus));
        setKeys(calculatedWeights.length);
        setWeights([...calculatedWeights]);
      }

      if(useDataset[3]){
        LoadAccidents();
      }
      else{
        setShowAccident(false);
      }
      
      
  }, [useDataset, bikeToWorkHeatmap, censusHeatmap])

  const regeneratePrevKey = (index) => {
    var tmpKeys = roadKeys;
    if(selectedRoad != null){
      const indexes = model.reduce((acc, obj, index) => {
        if (obj.properties.id === selectedRoad) {
          acc.push(index);
        }
        return acc;
      }, []);
      
      indexes.forEach((element) => {
        tmpKeys[element] = uuidv4();
      })
    }
    if(index){
      console.log("here");
      tmpKeys[index] = uuidv4();
    }
    setRoadKeys([...tmpKeys]);

  }

  const detectorClick = (index) => {

    regeneratePrevKey(null);
    setShowRoad(false);
    setSelectedRoad(null);
    setSelectedAccident(null);
    setShowAccidentDetail(false);
    setShowDetector(true);
    setSelectedPoint(index);
  }

  const closeAccidentDetail = () => {
    setShowAccidentDetail(false);
    setSelectedAccident(null)
  }

  const accidentClick = (index) => {
    console.log("here")
    setShowRoad(false);
    setSelectedRoad(null);
    setShowDetector(false);
    setSelectedPoint(null);
    setSelectedAccident(index);
    setShowAccidentDetail(true);
  }

  function closeDetectorDetail(){
    //debugger;
    setShowDetector(false);
    setSelectedPoint(null);
  }

  function closeRoadDetail(){
    regeneratePrevKey(null);
    setShowRoad(false);
    setSelectedRoad(null);
    setSelectedRoadCensus(null);
  }

  const mapRange = (value, inputMin, inputMax, outputMin, outputMax) => {
    return ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) + outputMin;
  };

  function getWeight(biketoWorkEntity, censusEntity, BikeToWorkMax, CensusMax){
    var all = 0;
    var max = 0;
    try{
      
      if(useDataset[0] && biketoWorkEntity){
        if(bikeToWorkHeatmap[0]){
          all += biketoWorkEntity.properties.data_2018;
          max += BikeToWorkMax[0];
        }
        if(bikeToWorkHeatmap[1]){
          all += biketoWorkEntity.properties.data_2019;
          max += BikeToWorkMax[1];
        }
        if(bikeToWorkHeatmap[2]){
          all += biketoWorkEntity.properties.data_2020;
          max += BikeToWorkMax[2];
        }
        if(bikeToWorkHeatmap[3]){
          all += biketoWorkEntity.properties.data_2021;
          max += BikeToWorkMax[3];
        }
        if(bikeToWorkHeatmap[4]){
          all += biketoWorkEntity.properties.dpnk_22;
          max += BikeToWorkMax[4];
        }
        //all += biketoWorkEntity.properties.data_2018 + biketoWorkEntity.properties.data_2019 + biketoWorkEntity.properties.data_2020 + biketoWorkEntity.properties.data_2021 + biketoWorkEntity.properties.dpnk_22;
        //max += maxBikeToWork;
      }
      if(useDataset[1] && censusEntity){
        if(censusHeatmap[0]){
          all += censusEntity.properties.vik_2016 * 10;
          max += CensusMax[0];
        }
        if(censusHeatmap[1]){
          all += censusEntity.properties.prac_2016 * 10;
          max += CensusMax[1];
        }
        if(censusHeatmap[2]){
          all += censusEntity.properties.vik_2018 * 10;
          max += CensusMax[2];
        }
        if(censusHeatmap[3]){
          all += censusEntity.properties.prac_2018 * 10;
          max += CensusMax[3];
        }
        if(censusHeatmap[4]){
          all += censusEntity.properties.vik_2020 * 10;
          max += CensusMax[4];
        }
        if(censusHeatmap[5]){
          all += censusEntity.properties.prac_2020 * 10;
          max += CensusMax[5];
        }
        if(censusHeatmap[6]){
          all += censusEntity.properties.vik_2022 * 10;
          max += CensusMax[6];
        }
        if(censusHeatmap[7]){
          all += censusEntity.properties.prac_2022 * 10;
          max += CensusMax[7];
        }

        //all += (censusEntity.properties.prac_2016 + censusEntity.properties.vik_2016 + censusEntity.properties.prac_2018 + censusEntity.properties.vik_2018 + censusEntity.properties.prac_2020 + censusEntity.properties.vik_2020 + censusEntity.properties.prac_2022 + censusEntity.properties.vik_2022) * 10;
        //debugger
        //max += maxCensus;

      }
      
      //console.log(mapRange(all, 0, maxBikeToWork, 1, 4), all, maxBikeToWork)
      return mapRange(all, 0, max, 0.5, 10);
      
    }
    catch(e){
      //tady je chyba ze to sem skoci pokazdy, i kdyz biketowork je a census neni
      if(all !== 0){
        return mapRange(all, 0, max, 0.5, 10);
      }
      else{
        return 0;
      }
    }
  }

  const handlePolylineClick = (fullmodel, index) => {
    console.log("clicked")
    setShowDetector(false);
    setSelectedPoint(null);
    setShowRoad(true);
    setSelectedRoad(fullmodel.properties.id);
    setSelectedRoadCensus(fullmodel.properties.city_census_id);
    regeneratePrevKey(index);
  };

  if(errorLoading){
    return(
      <div className='errDiv'>
        <h1>Nastala chyba při načítání dat...</h1>
      </div>
    )
  }

  return (
    <div>
        
      <DetectorDetail show = {showDetector} closeFunction = {closeDetectorDetail}  detector = {showDetector? points[selectedPoint] : null} points={points}/>
      <RoadDetail show = {showRoad} closeFunction={closeRoadDetail} road={showRoad? bikeToWork[bikeToWorkMap.get(model.find(objekt => objekt.properties.id === selectedRoad).properties.biketowork_id)] : null} road_scitani = {showRoad? census.find(objekt => objekt.properties.ObjectId === selectedRoadCensus) : null}/>
      <AccidentDetail show={showAccidentDetail} closeDetail={closeAccidentDetail} accident={showAccidentDetail ? accidents.find(objekt => objekt.properties.objectid === selectedAccident) : null} />
        
    <MapContainer center={[49.1946, 16.6088]} zoom={13}>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.flaticon.com/free-icons/map-pin" title="map pin icons">Map pin icons created by Md Tanvirul Haque - Flaticon</a> contributors '
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      
      <Detectors points={points} show={useDataset[2]} detectorClick={detectorClick} isLoading={isLoading} />
      <Heatmap model = {model} isLoading = {isLoading} weights = {weights} handlePolylineClick = {handlePolylineClick} keys={roadKeys} selectedId={selectedRoad} />
      <Accidents data={accidents} show={showAccident} setSelectedAccident={accidentClick}/>
    </MapContainer>
      <DataSetsPicker setDataset={setUseDataset} useDataset={useDataset} bikeToWork={bikeToWorkHeatmap} census={censusHeatmap} setBikeToWork={setBikeToWorkHeatmap} setCensus={setCensusHeatmap}/>
      {isLoading ?
        <div id="loadingDiv">
          <img src='./Spinner-1s-200px.svg' alt='Loading...'></img>
        </div>
        : null
      }
      
    
    </div>
  );
}

export default App;
