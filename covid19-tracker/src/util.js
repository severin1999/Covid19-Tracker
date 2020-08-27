import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 600
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1000
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 1800
    },
};
  

export const sortData = data => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => b.cases - a.cases);
};

export const printStat = stat => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType='cases') => (
    data.map(country => (
        <Circle 
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className='info-container'>
                    <div
                        className='info-flag'
                        style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                    />
                    <h3 className='info-country'>
                        {country.country}
                    </h3>
                    <div className='info-data'>
                        <strong>Cases:</strong>
                        {numeral(country.cases).format("0,0")}
                    </div>
                    <div className='info-data'>
                        <strong>Recovered:</strong>
                        {numeral(country.recovered).format("0,0")}
                    </div>
                    <div className='info-data'>
                        <strong>Deaths:</strong>
                        {numeral(country.deaths).format("0,0")}
                    </div>
                </div>
            </Popup>
        </Circle>
    ))
)