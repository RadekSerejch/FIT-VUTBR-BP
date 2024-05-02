const express = require('express')
const axios = require('axios');
const app = express()
var fs = require('fs');
const cors = require('cors');
const moment = require('moment');
//var detektoryJsonFile = require("../cycling_data/datasets/cyklodetektory.geojson")

app.use(cors());

app.get('/', (req, res) => {
    console.log('here')
    res.send('hahaha kokote')
})

app.get('/detectors', async(req, res) => {
  
  /*fs.readFile('../cycling_data/datasets/cyklodetektory.geojson', 'utf8', (err, data) => {
        if (err) {
          console.error('Chyba při čtení souboru:', err);
          return res.status(500).send('Nastala chyba při čtení souboru.');
        }
    
        try {
          // Parsování geojsonu
          var geojson = JSON.parse(data);
           //debugger
          // Filtrace - například zde filtrování podle vlastnosti "type"
          /*const filteredFeatures = geojson.features.filter(feature => {
            return new Date(feature.properties.EndOfInterval)  > new Date("2023");
          });*/
          
          //geojson.features = filteredFeatures;
          // Vytvoření nového geojsonu s filtrovanými prvky
          /*const filteredGeojson = {
            type: 'FeatureCollection',
            features: filteredFeatures
          };
    
          // Odeslání filtrovaného geojsonu jako odpověď
          res.json(geojson);
        } catch (error) {
          console.error('Chyba při zpracování geojsonu:', error);
          res.status(500).send('Nastala chyba při zpracování geojsonu.');
        }
      });*/
      const response = await axios.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/cyklodetektory/FeatureServer/0/query?where=1=1&outFields=*&f=geojson');
      const data = await response.data;
      res.json(data)
})

app.get('/bikeToWork', async(req, res) =>{
    
  /*fs.readFile('../cycling_data/datasets/do_prace_na_kole.geojson', 'utf8', (err, data) => {
        if (err) {
          console.error('Chyba při čtení souboru:', err);
          return res.status(500).send('Nastala chyba při čtení souboru.');
        }
    
        try {
          // Parsování geojsonu
          var geojson = JSON.parse(data);
            debugger
          // Filtrace - například zde filtrování podle vlastnosti "type"
          /*const filteredFeatures = geojson.features.filter(feature => {
            return new Date(feature.properties.data_2021)  > 60;
          });
          
          geojson.features = filteredFeatures;
          *//*
          res.json(geojson);
        } catch (error) {
          console.error('Chyba při zpracování geojsonu:', error);
          res.status(500).send('Nastala chyba při zpracování geojsonu.');
        }
      });*/
      //debugger
      const response = await axios.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/dpnk_data/FeatureServer/0/query?where=1=1&outFields=*&f=geojson');
      //const response2 
    
      const data = response.data;
      
      var data2 = response.data;
     
    
      while(data2.features.length == 2000){
        const hodnoty = data2.features.map(objekt => objekt.properties.OBJECTID);
        const maxHodnota = Math.max(...hodnoty);
        const response2 = await axios.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/dpnk_data/FeatureServer/0/query?where=OBJECTID>' + maxHodnota + '&outFields=*&f=geojson');
        data2 = response2.data;
        data.features.push(...data2.features);
      }

      res.json(data)

})

app.get('/fullModel', (req, res) => {
    fs.readFile('../cycling_data/datasets/full_model.geojson', 'utf8', (err, data) => {
        if (err) {
          console.error('Chyba při čtení souboru:', err);
          return res.status(500).send('Nastala chyba při čtení souboru.');
        }
    
        try {
          // Parsování geojsonu
          var geojson = JSON.parse(data);
          //  debugger
          // Filtrace - například zde filtrování podle vlastnosti "type"
          const filteredFeatures = geojson.features.filter(feature => {
            return feature.properties.biketowork_id != null || feature.properties.city_census_id != null;
          });

          geojson.features = filteredFeatures;
          

          geojson.features.forEach(feature => {
            feature.geometry.coordinates.forEach((element, index) => {
                feature.geometry.coordinates[index] = element.map(subArray => {
                    let [y, x] = subArray;
                    return [x, y];
                });
            });
        });



          res.json(geojson);
        } catch (error) {
          console.error('Chyba při zpracování geojsonu:', error);
          res.status(500).send('Nastala chyba při zpracování geojsonu.');
        }
      });
})

app.get('/census', async(req, res) => {
    /*fs.readFile('../cycling_data/datasets/bkom_scitanie.geojson', 'utf8', (err, data) => {
        if (err) {
          console.error('Chyba při čtení souboru:', err);
          return res.status(500).send('Nastala chyba při čtení souboru.');
        }
    
        try {
          // Parsování geojsonu
          var geojson = JSON.parse(data);
            //debugger
          // Filtrace - například zde filtrování podle vlastnosti "type"
          /* const filteredFeatures = geojson.features.filter(feature => {
            return new Date(feature.properties.data_2021)  > 60;
          });
          
          geojson.features = filteredFeatures;
           *//*
          res.json(geojson);
        } catch (error) {
          console.error('Chyba při zpracování geojsonu:', error);
          res.status(500).send('Nastala chyba při zpracování geojsonu.');
        }
      });*/
      //debugger
      const response = await axios.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/intenzita_cyklodopravy_pentlogramy/FeatureServer/0/query?where=1=1&outFields=*&f=geojson');
      //const response2 
    
      const data = response.data;
      

      res.json(data)

})

app.get('/detectorsHis/:id', async (req, res) => {
  //debugger
  const id = req.params.id;
  console.log(id);
  const response = await axios.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/cyklodetektory_history/FeatureServer/0/query?where=LocationId=' + id + '&outFields=*&f=geojson');
  //const response2 

  const data = response.data;
  
  var data2 = response.data;
 
  
  while(data2.features.length == 1000){
    const hodnoty = data2.features.map(objekt => objekt.properties.ObjectId);
    const maxHodnota = Math.max(...hodnoty);
    const response2 = await axios.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/cyklodetektory_history/FeatureServer/0/query?where=LocationId=' + id + ' AND ObjectId>' + maxHodnota + '&outFields=*&f=geojson');
    data2 = response2.data;
    data.features.push(...data2.features);
  }
  
  //const data2 = response2.data;

  //data.features.push(...data2.features)
  res.json(data);
})

app.get('/compareCyclistsPedestrians', async (req, res) => {
  console.log(111111);
  let resultData = [];
  let maxObjectId = 0;

  async function fetchData() {
      try {
          const response = await axios.get(`https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/cyklodetektory_history/FeatureServer/0/query?where=ObjectId>${maxObjectId}&outFields=*&f=geojson`);
          const features = response.data.features;

          if (features.length === 0) {
              res.json(resultData);
              return; // End recursion if no more data available
          }

          // Process fetched data
          features.forEach(element => {
              const index = resultData.findIndex(obj => obj.id === element.properties.LocationId);
              if (index === -1) {
                  resultData.push({
                      id: element.properties.LocationId,
                      cyclists: element.properties.FirstDirection_Cyclists + element.properties.SecondDirection_Cyclists,
                      pedestrians: element.properties.FirstDirection_Pedestrians + element.properties.SecondDirection_Pedestrians
                  });
              } else {
                  resultData[index].cyclists += element.properties.FirstDirection_Cyclists + element.properties.SecondDirection_Cyclists;
                  resultData[index].pedestrians += element.properties.FirstDirection_Pedestrians + element.properties.SecondDirection_Pedestrians;
              }
          });

          // Find the maximum ObjectId for the next request
          maxObjectId = Math.max(...features.map(objekt => objekt.properties.ObjectId));

          // Fetch next batch of data recursively
          await fetchData();
      } catch (error) {
          console.error('Error while fetching data:', error);
          res.status(500).send('An error occurred while fetching data.');
      }
  }

  // Start fetching data
  await fetchData();
});


// compareWeekWeekend endpoint
app.get('/compareWeekWeekend', async (req, res) => {
  console.log(222222);
  let resultData = [];
  let maxObjectId = 0;

  async function fetchData() {
      try {
          const response = await axios.get(`https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/cyklodetektory_history/FeatureServer/0/query?where=ObjectId>${maxObjectId}&outFields=*&f=geojson`);
          const features = response.data.features;

          if (features.length === 0) {
              res.json(resultData);
              return; // End recursion if no more data available
          }

          features.forEach(element => {
              const index = resultData.findIndex(obj => obj.id === element.properties.LocationId);
              const all = element.properties.FirstDirection_Cyclists + element.properties.SecondDirection_Cyclists + element.properties.FirstDirection_Pedestrians + element.properties.SecondDirection_Pedestrians;
              if (index === -1) {
                  if (moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').isoWeekday() < 6) {
                      resultData.push({ id: element.properties.LocationId, week: all, weekend: 0 });
                  } else {
                      resultData.push({ id: element.properties.LocationId, week: 0, weekend: all });
                  }
              } else {
                  if (moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').isoWeekday() < 6) {
                      resultData[index].week += all;
                  } else {
                      resultData[index].weekend += all;
                  }
              }
          });

          // Find the maximum ObjectId for the next request
          maxObjectId = Math.max(...features.map(objekt => objekt.properties.ObjectId));

          // Fetch next batch of data recursively
          await fetchData();
      } catch (error) {
          console.error('Error while fetching data:', error);
          res.status(500).send('An error occurred while fetching data.');
      }
  }

  // Start fetching data
  await fetchData();
});

// compareDayNight endpoint
app.get('/compareDayNight', async (req, res) => {
  console.log(333333);
  let resultData = [];
  let maxObjectId = 0;

  async function fetchData() {
      try {
          const response = await axios.get(`https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/cyklodetektory_history/FeatureServer/0/query?where=ObjectId>${maxObjectId}&outFields=*&f=geojson`);
          const features = response.data.features;

          if (features.length === 0) {
              res.json(resultData);
              return; // End recursion if no more data available
          }

          features.forEach(element => {
              const index = resultData.findIndex(obj => obj.id === element.properties.LocationId);
              const all = element.properties.FirstDirection_Cyclists + element.properties.SecondDirection_Cyclists + element.properties.FirstDirection_Pedestrians + element.properties.SecondDirection_Pedestrians;
              if (index === -1) {
                  if (moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour() > 6 && moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour() <= 22) {
                      resultData.push({ id: element.properties.LocationId, day: all, night: 0 });
                  } else {
                      resultData.push({ id: element.properties.LocationId, day: 0, night: all });
                  }
              } else {
                  if (moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour() > 6 && moment(element.properties.EndOfInterval, 'DD.MM.YYYY HH:mm').hour() <= 22) {
                      resultData[index].day += all;
                  } else {
                      resultData[index].night += all;
                  }
              }
          });

          // Find the maximum ObjectId for the next request
          maxObjectId = Math.max(...features.map(objekt => objekt.properties.ObjectId));

          // Fetch next batch of data recursively
          await fetchData();
      } catch (error) {
          console.error('Error while fetching data:', error);
          res.status(500).send('An error occurred while fetching data.');
      }
  }

  // Start fetching data
  await fetchData();
});

app.get('/accidents', async (req, res) => {
  const response = await axios.get('https://gis.brno.cz/ags1/rest/services/Hosted/Cyklo_nehody/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson');
  //const response2 
  const data = response.data;
  

  res.json(data)
});

app.listen(3001)