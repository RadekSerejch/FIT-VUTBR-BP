import { useState } from "react";
import CustomSlider from "./CustomSlider";
import moment from "moment";

function DateFilter({showFilter, isLoading, minDate, maxDate, filterData, setSelectedTimesOuter, setSelectedDaysOuter, selectedTimesIn, selectedDaysIn}){

    //vybrané dny a časy
    const [selectedTimes, setSelectedTimes] = useState(selectedTimesIn);
    const [selectedDays, setSelectedDays] = useState(selectedDaysIn);

    //hranice filtru
    const [selectedDateFirst, setSelectedDateFirst] = useState(moment(minDate, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
    const [selectedDateSecond, setSelectedDateSecond] = useState(moment(maxDate, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));

    //změna ve vybraných časech
    const changeTime = (i) =>{
        setSelectedTimes(prevState => {
            const newSelectedTimes = [...prevState];
            newSelectedTimes[i] = !newSelectedTimes[i];
            return newSelectedTimes;
          });
    }

    //změna ve vybraných dnech
    const changeDay = (i) => {
        setSelectedDays(prevState => {
            const newSelectedDays = [...prevState];
            newSelectedDays[i] = !newSelectedDays[i];
            return newSelectedDays
        })
    }

    //ovládání kliknutí na filtraci dat
    const filterClick = () => {
        setSelectedDaysOuter(selectedDays);
        setSelectedTimesOuter(selectedTimes);
        filterData(selectedDateFirst, selectedDateSecond, selectedDays, selectedTimes);
    }

    //změna vybraných hranic datumů
    const setDateLimit = (first, second) => {
        setSelectedDateFirst(first);
        setSelectedDateSecond(second);
    }

    return(
        showFilter && !isLoading &&
        <div className='dateFilter'>
             <div id="filterButtonDiv">
                <button id="filterButton" onClick={filterClick}>filtrovat</button>
            </div>
            <CustomSlider sliderMin = {minDate} sliderMax={maxDate} setBoundries={setDateLimit}/>

            <div id='datesContainer'>
                

               
                <div id="times">
                    <div className="DaysHours">
                    <div className="DaysHoursHeader">vyberte časy:</div>
                    {selectedTimes.map((key,index) => (
                        <div key={index}><label className="container"><input key={index} type='checkbox' checked={selectedTimes[index]} onChange={() => {changeTime(index)}}/> {index}:00 <span className="checkmark daysHoursCheckBox"></span></label></div>
                    ))}
                    </div>
                </div>
                <div id="days">
                    <div className="DaysHours">
                    <div className="DaysHoursHeader">vyberte dny:</div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[0]} onChange={() => {changeDay(0)}}/> pondělí <span className="checkmark daysHoursCheckBox"></span></label></div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[1]} onChange={() => {changeDay(1)}}/> úterý <span className="checkmark daysHoursCheckBox"></span></label></div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[2]} onChange={() => {changeDay(2)}}/> středa <span className="checkmark daysHoursCheckBox"></span></label></div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[3]} onChange={() => {changeDay(3)}}/> čtvrtek <span className="checkmark daysHoursCheckBox"></span></label></div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[4]} onChange={() => {changeDay(4)}}/> pátek <span className="checkmark daysHoursCheckBox"></span></label></div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[5]} onChange={() => {changeDay(5)}}/> sobota <span className="checkmark daysHoursCheckBox"></span></label></div>
                    <div><label className="container"><input type='checkbox' checked={selectedDays[6]} onChange={() => {changeDay(6)}}/> neděle <span className="checkmark daysHoursCheckBox"></span></label></div>
                    </div>
                </div>
                
            </div>
        </div>
        
        
    );
}

export default DateFilter;