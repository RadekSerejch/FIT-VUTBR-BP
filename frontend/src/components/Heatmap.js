/*
 * BP - Radek Šerejch, xserej00
 * FIT VUT, Božetěchova 2, 612 00 Brno, Česká republika
 *
 * 2024
 */

import React, { memo } from 'react';
import { Polyline } from 'react-leaflet';

//Komponenta pro vykreslení heatmapy
const Heatmap = memo(({ model, isLoading, weights, handlePolylineClick , keys, selectedId}) => {
  return (
    <>
      {!isLoading && model.map((fullmodel, index) => (
        <Polyline key={keys[index]}
          positions={fullmodel.geometry.coordinates} 
          color={fullmodel.properties.id === selectedId ? "blue" : "red"}
          clickTolerance={20}
          weight={weights[index]}
          eventHandlers={{
            click: () => handlePolylineClick(fullmodel, index),
          }}
        />
      ))}
    </>
  );
})

export default Heatmap;