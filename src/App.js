import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card,  CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from "./Table";
import './App.css';
import { sortData, prettyPrintStat } from "./util";
import numeral from 'numeral';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  // STATE = How to write a variable in REACT <<<<<

  // https://disease.sh/v3/covid-19/countries ==> API Call to fetch the names of the countries.

  // USEEFFECT = Runs a piece of code 
  // Based on a given condition 

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")     // This fetches the data for the "Worldwide" option in the dropdown, that appears initially, when the page is first visited.
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });

  }, []);





  useEffect(() => {       // async -> send a request, wait for it, do something with the input.

    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {

        const countries = data.map((country) => (
          {
            name: country.country, //India, Israel
            value: country.countryInfo.iso2, // UK, USA, FR
          }));

          let sortedData = sortData(data);
          setTableData(sortedData); // Sets the data in the Live cases table.
          setMapCountries(data);
          setCountries(countries); // Shows the corresponding country for each data
      });
    };  

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;



    const url = countryCode === 'worldwide' 
    ? 'https://diseases.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)                       /* Waits for the data to be recieved from the API */
    .then(response => response.json())     /* After recieving the data, performs the next response */
    .then(data => {
      setCountry(countryCode);

                                      // All of the data from the country response from the API
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);


    });
  }; 

   // Calls the particular country info from API and stores it, in order to be called from the particular tables to display particular type of data required.
                                                       // open console in the browser and check for the info that you have recieved from the API, 
                                                      //... Because most of the API's do not provide the specific data seperately as of provided by the current project's API (disease.sh)


  
  return (
    <div className="app"> 
    <div className="app__left">
      <div className="app__header" >
      <h1>Covid-19 Tracker</h1>
      <FormControl className="app_dropdown">
        <Select 
        variant="outlined" 
        onChange={onCountryChange}
        value={country}
        >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          

        </Select>
      </FormControl>
      </div>
      

    <div className="app__stats">  

      <InfoBox
      isRed
      active={casesType === "cases"}
      onClick={(e) => setCasesType("cases")}
       title="Coronavirus cases" 
       cases={prettyPrintStat(countryInfo.todayCases)} 
       total={prettyPrintStat(countryInfo.cases)} 
       />

      <InfoBox
      active={casesType === "recovered"}
      onClick={(e) => setCasesType("recovered")}
       title="Recovered" 
       cases={prettyPrintStat(countryInfo.todayRecovered)} 
       total={prettyPrintStat(countryInfo.recovered)} 
       />

      <InfoBox
      isRed
      active={casesType === "deaths"}
      onClick={(e) => setCasesType("deaths")}
       title="Deaths" 
       cases={prettyPrintStat(countryInfo.todayDeaths)} 
       total={prettyPrintStat(countryInfo.deaths)} 
       />
       
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;