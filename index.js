document.addEventListener('DOMContentLoaded', function() {

    const container = document.querySelector('.container');
    const searchButton = document.querySelector('.search-box button');
    const regionSelect = document.querySelector('#region');
    const beachSelect = document.querySelector('#beach');
    const surfBox = document.querySelector('.surf-box');
    const surfDetails = document.querySelector('.surf-details');
    const error404 = document.querySelector('.not-found');
    
    const locations = {
        'Long Beach': {
            region: "central",
            lat: 49.1532,
            lon: -125.9136
            
        },
        'Cox Bay': {
            region: "central",
            lat: 49.113359,  
            lon: -125.8863
            
        },
        'North Chesterman': {
            region: "central",
            lat: 49.1130,
            lon: -125.8836
        },
        'South Chesterman': {
            region: "central",
            lat: 49.1139,
            lon: -125.9061
        },
        'Florencia Bay': {
            region: "central",
            lat: 49.0807 ,
            lon: -125.8846
        },
        'Wickanninish': {
            region: "central",
            lat: 49.0772,
            lon: -125.8769
        },
    
        'Sombrio': {
            region: "south",
            lat: 48.49945,
            lon: -124.2937
        },
    
        'Jordan River': {
            region: "south",
            lat: 48.4205,
            lon: -124.04923
        },
    
        'Sewage Waste': {
            region: "south",
            lat:48.4221,
            lon: -124.0576
        }
    
    };
    
    
    regionSelect.addEventListener('change', (event) => {
        const selectedRegion = event.target.value;
        beachSelect.innerHTML = ''; 
    
        
        for (let beach in locations) {
            if (locations[beach].region === selectedRegion) {
                const option = document.createElement('option');
                option.value = beach;
                option.textContent = beach;
                beachSelect.appendChild(option);
            }
        }
    });
    
    searchButton.addEventListener('click', () => {
        const APIKey = 'c5b043ce-743b-11ee-8d52-0242ac130002-c5b04432-743b-11ee-8d52-0242ac130002';
    
        const selectedBeach = beachSelect.value;
    
        if (!selectedBeach || !locations[selectedBeach]) {
            console.error("Please select a beach");
            return;
        }
    
        const { lat, lon } = locations[selectedBeach];
    
        fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lon=${lon}&params=waveHeight,windSpeed,windDirection,airTemperature,cloudCover,swellHeight,swellPeriod`, {
            headers: {
                'Authorization': APIKey
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(json => {
            
            const waveHeight = (json.hours[0].waveHeight.sg + json.hours[0].waveHeight.noaa) / 2;
            const windSpeed = (json.hours[0].windSpeed.sg + json.hours[0].windSpeed.noaa) / 2;
            const windDirection = Math.round((json.hours[0].windDirection.sg + json.hours[0].windDirection.noaa) / 2);
            const airTemperature = (json.hours[0].airTemperature.sg + json.hours[0].airTemperature.noaa) / 2;
            const swellHeight = (json.hours[0].swellHeight.sg + json.hours[0].swellHeight.noaa) / 2;
            const swellPeriod = (json.hours[0].swellPeriod.sg + json.hours[0].swellPeriod.noaa) / 2;
            const cloudCover = (json.hours[0].cloudCover.sg + json.hours[0].cloudCover.noaa) / 2;
    
                document.querySelector('.wave-height').innerText = `${waveHeight} m`;
                document.querySelector('.wind-speed').innerText = `${windSpeed} km/h`;
                document.querySelector('.wind-direction').innerText = `${windDirection}°`;
                document.querySelector('.air-temperature').innerText = `${airTemperature}°C`;
                document.querySelector('.swell-height-value').innerText = `${swellHeight} m`;
                document.querySelector('.swell-period-value').innerText = `${swellPeriod} s`;
                document.querySelector('.cloud-cover').innerText = `${cloudCover}%`;
    
                
    
            surfBox.style.display = '';
            surfDetails.style.display = '';
            surfBox.classList.add('fadeIn');
            surfDetails.classList.add('fadeIn');
            container.style.height = '590px';
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
            container.style.height = '400px';
            surfBox.style.display = 'none';
            surfDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
        });
    });
    console.log(container);
    console.log(surfBox);
    console.log(surfDetails);
    console.log(error404);
    
    
    regionSelect.dispatchEvent(new Event('change'));
    
    
    })