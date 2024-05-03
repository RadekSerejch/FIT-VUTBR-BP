import { useEffect, useState } from "react";
import moment from 'moment';
import Slider from 'react-slider'

function CustomSlider({sliderMin, sliderMax, setBoundries}){
    //datumové hodnoty pro levý a pravý slider
    const [sliderLeft, setSliderLeft] = useState(moment(moment(sliderMin, 'DD.MM.YYYY HH:mm').format('MM.DD.YYYY')));
    const [sliderRight, setSliderRight] = useState(moment(moment(sliderMax, 'DD.MM.YYYY HH:mm').format('MM.DD.YYYY')));
    // číselné hodnoty pro levý a pravý slider
    const [values, setValues] = useState([]);
    //maximální číselná hodnota pravého slideru
    const [maxVal, setMaxVal] = useState();
    
    useEffect(() => {
        //vypočtení číselného rozsahu pro slider
        const date1 = new Date(moment(sliderMin, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
        const date2 = new Date(moment(sliderMax, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
        const differenceMs = Math.abs(date2 - date1);

        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        
        setMaxVal(differenceDays);
        setValues([0,differenceDays])
    }, [])

    useEffect(() => {
        //promítnutí změny v číselných hodnotách slideru do datumových hodnot
        if(maxVal !== undefined){
            var date1 = new Date(moment(sliderMin, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
            var date2 = new Date(moment(sliderMax, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
            date1 = new Date(date1.getTime() + (values[0] * (1000 * 60 * 60 * 24)));
            date2 = new Date(date2 - ((maxVal - values[1]) * (1000 * 60 * 60 * 24)));

            setSliderLeft(moment(date1));
            setSliderRight(moment(date2));
        }
        
    }, [values, maxVal])


    //funkce pro ovládání změny na levém datumovém inputu
    const handleChangeLeft = (event) => {
        var tmpVal = values;
        //počítání rozdílu zvoleného a minimálního datumu ve dnech
        const date1 = new Date(moment(sliderMin, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
        const date2 = new Date(moment(event.target.value).format('YYYY-MM-DD'));
        const differenceMs = Math.abs(date2 - date1);
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        tmpVal[0] = differenceDays;
        setValues(tmpVal);
        setBoundries(moment(event.target.value).format('YYYY-MM-DD'), sliderRight.format('YYYY-MM-DD'))
        setSliderLeft(moment(event.target.value));
    };

    //funkce pro ovládání změny na pravém datumovém inputu
    const handleChangeRight = (event) => {
        var tmpVal = values;

        //počítání rozdílu zvoleného a maximálního datumu ve dnech
        const date1 = new Date(moment(sliderMax, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD'));
        const date2 = new Date(moment(event.target.value).format('YYYY-MM-DD'));
        const differenceMs = Math.abs(date2 - date1);
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        tmpVal[1] = maxVal - differenceDays;
        setValues(tmpVal);
        setBoundries(sliderLeft.format('YYYY-MM-DD'), moment(event.target.value).format('YYYY-MM-DD'))
        setSliderRight(moment(event.target.value));
    };

    const handleAfterChange = () => {
        setBoundries(sliderLeft.format('YYYY-MM-DD'), sliderRight.format('YYYY-MM-DD'))
    }


    return(
        <div id="OwnSlider">
            <div>
                <input type="date"  onChange={handleChangeLeft} value={sliderLeft.format("YYYY-MM-DD")} min={moment(sliderMin, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD')} max={moment(sliderMax, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD')}></input>
                -
                <input type="date"  onChange={handleChangeRight} value={sliderRight.format("YYYY-MM-DD")} min={moment(sliderMin, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD')} max={moment(sliderMax, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD')}></input>
                
                <Slider className={"slider"}
                        onChange={setValues}
                        onAfterChange={handleAfterChange}
                        value={values}
                        min={0}
                        max={maxVal}/>
                
            </div>
        </div>
    )
}
export default CustomSlider;
