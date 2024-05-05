/*
 * BP - Radek Šerejch, xserej00
 * FIT VUT, Božetěchova 2, 612 00 Brno, Česká republika
 *
 * 2024
 */

import { useEffect, useState } from "react";

function DataSetsPicker({setDataset, useDataset, bikeToWork, census, setBikeToWork, setCensus}){
    //pole indikující, zda mají být jednotlivé datasety použity
    const [datasets, setDatasets] = useState(useDataset);
    
    //pole indikující, zda mají být jednotlivé části datasetů použity (např. bikeToWork 2020)
    const [bikeToWorkHeatmap, setBikeToWorkHeatmap] = useState(bikeToWork);
    const [censusHeatmap, setCensusHeatmap] = useState(census);

    //proměnné indikující, zda se mají zobrazit v okně části datasetů
    const [showBikeToWorkDetail, setShowBikeToWorkDetail] = useState(false);
    const [showCensusDetail, setShowCensusDetail] = useState(false);

    //funkce pro obsluhu vypínání/zapínání jednotlivých datových sad
    const changeDatasets = (i) => {
        setDatasets(prevState => {
            const newSelectedDays = [...prevState];
            newSelectedDays[i] = !newSelectedDays[i];
            return newSelectedDays
        })
    }

    //funkce pro obsluhu zobrazování/skrývání okna pro části datasetu bikeToWork
    const showDetailBikeToWork = () => {
        setShowBikeToWorkDetail(!showBikeToWorkDetail);
    }

    //funkce pro obsluhu zobrazování/skrývání okna pro části datasetu census
    const showDetailCensus = () => {
        setShowCensusDetail(!showCensusDetail);
    }

    //funkce pro obsluhu vypínání/zapínání částí datové sady bikeToWork
    const changeBikeToWork = (index) => {
        setBikeToWorkHeatmap(prevState => {
            const newSelectedDays = [...prevState];
            newSelectedDays[index] = !newSelectedDays[index];
            return newSelectedDays
        });
    }

    //funkce pro obsluhu vypínání/zapínání částí datové sady census
    const changeCensus = (index) => {
        setCensusHeatmap(prevState => {
            const newSelectedDays = [...prevState];
            newSelectedDays[index] = !newSelectedDays[index];
            return newSelectedDays
        });
    }

    //funkce pro nastavování zobrazení datových sad
    useEffect(() => {
        setDataset(datasets);
    }, [datasets])

    useEffect(() => {
        setCensus(censusHeatmap);
    }, [censusHeatmap])

    useEffect(() => {
        setBikeToWork(bikeToWorkHeatmap);
    }, [bikeToWorkHeatmap])
    
    return(
        <div id="dataSetPicker">
            Vyberte datové sady:
            <div className="Dataset">
                <div className="DatasetHeader">
                    <label className="container">BikeToWork<input type="checkbox" checked={datasets[0]} onChange={() => {changeDatasets(0)}}/><span className="checkmark"></span></label><img src="./down.png" alt='detail' onClick={() => {showDetailBikeToWork()}}></img>
                </div>
                
                {showBikeToWorkDetail && 
                <div>
                    <div className="InnerDataset"><label className="container">2018<input type="checkbox" checked={bikeToWorkHeatmap[0]} onChange={() => {changeBikeToWork(0)}}></input><span className="checkmark"></span></label></div>
                    <div className="InnerDataset"><label className="container">2019<input type="checkbox" checked={bikeToWorkHeatmap[1]} onChange={() => {changeBikeToWork(1)}}></input><span className="checkmark"></span></label></div>
                    <div className="InnerDataset"><label className="container">2020<input type="checkbox" checked={bikeToWorkHeatmap[2]} onChange={() => {changeBikeToWork(2)}}></input><span className="checkmark"></span></label></div>
                    <div className="InnerDataset"><label className="container">2021<input type="checkbox" checked={bikeToWorkHeatmap[3]} onChange={() => {changeBikeToWork(3)}}></input><span className="checkmark"></span></label></div>
                    <div className="InnerDataset"><label className="container">2022<input type="checkbox" checked={bikeToWorkHeatmap[4]} onChange={() => {changeBikeToWork(4)}}></input><span className="checkmark"></span></label></div>
                </div> }
            </div>

            <div className="Dataset">
                <div className="DatasetHeader">
                    <label className="container"> Sčítání<input type="checkbox" checked={datasets[1]} onChange={() => {changeDatasets(1)}}/> <span className="checkmark"></span></label> <img src="./down.png" alt='detail' onClick={() => {showDetailCensus()}}></img>
                </div>
                
                {showCensusDetail && 
                    <div>
                        <div className="InnerDataset"><label className="container"> 2016 víkend<input type="checkbox" checked={censusHeatmap[0]} onChange={() => {changeCensus(0)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2016 všední den<input type="checkbox" checked={censusHeatmap[1]} onChange={() => {changeCensus(1)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2018 víkend<input type="checkbox" checked={censusHeatmap[2]} onChange={() => {changeCensus(2)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2018 všední den<input type="checkbox" checked={censusHeatmap[3]} onChange={() => {changeCensus(3)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2020 víkend<input type="checkbox" checked={censusHeatmap[4]} onChange={() => {changeCensus(4)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2020 všední den<input type="checkbox" checked={censusHeatmap[5]} onChange={() => {changeCensus(5)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2022 víkend<input type="checkbox" checked={censusHeatmap[6]} onChange={() => {changeCensus(6)}}></input><span className="checkmark"></span></label></div>
                        <div className="InnerDataset"><label className="container"> 2022 všední den<input type="checkbox" checked={censusHeatmap[7]} onChange={() => {changeCensus(7)}}></input><span className="checkmark"></span></label></div>
                    </div> }
            </div>
            <div className="Dataset">
                <div className="DatasetHeader"><label className="container"> Detektory<input type="checkbox" checked={datasets[2]} onChange={() => {changeDatasets(2)}}/> <span className="checkmark"></span></label></div>
            </div>
            
            <div className="Dataset">
                <div className="DatasetHeader"><label className="container"> Nehody<input type="checkbox" checked={datasets[3]} onChange={() => {changeDatasets(3)}}/> <span className="checkmark"></span></label></div>
            </div>
            
        </div>
    );
}

export default DataSetsPicker;