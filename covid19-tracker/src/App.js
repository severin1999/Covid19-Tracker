import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, CardContent, Card } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, printStat } from './util';
import numeral from 'numeral';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 44.439663,
    lng: 26.096306
  });
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(response => response.json())
      .then(data => {
        const allCountries = data.map(country => ({
          name: country.country,
          value: country.countryInfo.iso2,
          flag: country.countryInfo.flag
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(allCountries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async event => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = 
      countryCode === 'worldwide' 
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      if (countryCode === 'worldwide')  return setMapZoom(3); 
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(7)
    })
  };

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>
            Covid-19 Tracker
          </h1>

          <FormControl className='app__dropdown'>
            <Select variant='outlined' value={country} onChange={onCountryChange}>
              <MenuItem value='worldwide'>Worlwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem value={country.name} key={index}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
          <InfoBox
            active={casesType === 'cases'}
            title='New Cases' 
            cases={
              countryInfo.todayCases < 1000 ? `+${countryInfo.todayCases}` : printStat(countryInfo.todayCases)
            } 
            total={numeral(countryInfo.cases).format('0.0a')} 
            onClick={e => setCasesType('cases')}
          />
          <InfoBox
            active={casesType === 'recovered'}
            isGreen
            title='Recovered' 
            cases={
              countryInfo.todayRecovered < 1000 ? `+${countryInfo.todayRecovered}` : printStat(countryInfo.todayRecovered)
            } 
            total={numeral(countryInfo.recovered).format('0.0a')}
            onClick={e => setCasesType('recovered')}
          />
          <InfoBox
            active={casesType === 'deaths'}
            title='Deaths' 
            cases={
              countryInfo.todayDeaths < 1000 ? `+${countryInfo.todayDeaths}` : printStat(countryInfo.todayDeaths)
            } 
            total={numeral(countryInfo.deaths).format('0.0a')}
            onClick={e => setCasesType('deaths')}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>
            Live Cases by Country
          </h3>
          <Table countries={tableData} />
          <h3>
            Worldwide new {casesType}
          </h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
