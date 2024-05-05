/*
 * BP - Radek Šerejch, xserej00
 * FIT VUT, Božetěchova 2, 612 00 Brno, Česká republika
 *
 * 2024
 */

import moment from 'moment';
import rightIcon from '../img/right.png';

//Komponenta pro detail nehody
function AccidentDetail({show, accident, closeDetail}){
    return(
        show && 
        <div id="detail">
            <div className='rightIcon'><img src={rightIcon} alt='close' onClick={() => {closeDetail()}}></img></div>

            <div className='detailData'>
                <h2>{accident.properties.nazev}</h2>
                <div className='accidentTable'>
                    <table>
                        <tbody>
                            <tr>
                                <td><h4>Datum a čas</h4></td>
                                <td>{moment(accident.properties.datum).format('DD.MM.YYYY')} {accident.properties.hodina}:00</td>
                            </tr>
                            <tr>
                                <td><h4>Zavinění nehody</h4></td>
                                <td>{accident.properties.zavineni}</td>
                            </tr>
                            <tr>
                                <td><h4>Stav vozovky v místě nehody</h4></td>
                                <td>{accident.properties.stav_vozovky}</td>
                            </tr>
                            <tr>
                                <td><h4>Povětrnostní podmínky v době nehody</h4></td>
                                <td>{accident.properties.povetrnostni_podm}</td>
                            </tr>
                            <tr>
                                <td><h4>Viditelnost v době nehody</h4></td>
                                <td>{accident.properties.viditelnost}</td>
                            </tr>
                            <tr>
                                <td><h4>Následky nehody</h4></td>
                                <td>{accident.properties.nasledky}</td>
                            </tr>
                            <tr>
                                <td><h4>Druh vozidla účastníka</h4></td>
                                <td>{accident.properties.druh_vozidla}</td>
                            </tr>
                            <tr>
                                <td><h4>Alkohol u viníka</h4></td>
                                <td>{accident.properties.alkohol}</td>
                            </tr>
                            <tr>
                                <td><h4>Druh komunikace nehody</h4></td>
                                <td>{accident.properties.druh_komun}</td>
                            </tr>
                            <tr>
                                <td><h4>Stav cyklisty 24 hodin po nehodě</h4></td>
                                <td>{accident.properties.nasledek}</td>
                            </tr>
                            <tr>
                                <td><h4>Věková skupina</h4></td>
                                <td>{accident.properties.vek_skupina}</td>
                            </tr>
                            <tr>
                                <td><h4>Rozhledové poměry v místě nehody</h4></td>
                                <td>{accident.properties.rozhled}</td>
                            </tr>
                            <tr>
                                <td><h4>Místo nehody</h4></td>
                                <td>{accident.properties.misto_nehody}</td>
                            </tr>
                            <tr>
                                <td><h4>Druh nehody</h4></td>
                                <td>{accident.properties.srazka}</td>
                            </tr>
                            <tr>
                                <td><h4>Příčina nehody</h4></td>
                                <td>{accident.properties.pricina}</td>
                            </tr>
                            <tr>
                                <td><h4>Celková hmotná škoda při nehodě (ve stovkách Kč)</h4></td>
                                <td>{accident.properties.hmotna_skoda}</td>
                            </tr>
                            <tr>
                                <td><h4>Lehce zraněných osob</h4></td>
                                <td>{accident.properties.lehce_zran_os}</td>
                            </tr>
                            <tr>
                                <td><h4>Těžce zraněných osob</h4></td>
                                <td>{accident.properties.tezce_zran_os}</td>
                            </tr>
                            <tr>
                                <td><h4>Usmrcených osob</h4></td>
                                <td>{accident.properties.usmrceno_os}</td>
                            </tr>
                            <tr>
                                <td><h4>Označení osoby</h4></td>
                                <td>{accident.properties.osoba}</td>
                            </tr>
                            <tr>
                                <td><h4>Bližší označení osoby</h4></td>
                                <td>{accident.properties.ozn_osoba}</td>
                            </tr>
                            <tr>
                                <td><h4>Ovlivnění řidiče</h4></td>
                                <td>{accident.properties.ovlivneni_ridice}</td>
                            </tr>
                            <tr>
                                <td><h4>Stav řidiče vozidla</h4></td>
                                <td>{accident.properties.stav_ridic}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AccidentDetail;