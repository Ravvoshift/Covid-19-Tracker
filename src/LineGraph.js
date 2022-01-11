import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";


const options = {
    plugins:{
legend: {
 display: false,
}},
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],

        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};


    // https://disease.sh/v3/covid-19/historical/all?lastdays=120

    // Giving a call to the above endpoint gives the data about the covid-19 cases history from the past 120 days.
    
    const buildChartData = (data, casesType) => {
        let chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint, //The data provided by the endpoint doesn't specify the 24-hr cases and hence, we subtract the total cases until yesterday from the total cases until today, in order to get the cases from the past 24 hrs only.
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };



    function LineGraph({ casesType = "cases", ...props }) {
        const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let chartData = buildChartData(data, casesType);
        
                setData(chartData);
        });
    };

    fetchData();
}, [casesType]);

return (
  <div>
    {data?.length > 0 && (
      <Line
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: data,
            },
          ],
        }}
        options={options}
      />
    )}
  </div>
);
}

export default LineGraph;