// Grab HTML elements
const searchBtn = document.getElementById('searchBtn');
const countrySelect = document.getElementById('countrySelect');
const tierSelect = document.getElementById('tierSelect');
const daysInput = document.getElementById('daysInput');
const travelersInput = document.getElementById('travelersInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const suggestionDisplay = document.getElementById('suggestionDisplay');
const calculationDisplay = document.getElementById('calculationDisplay');

// Listen for button click
searchBtn.addEventListener('click', async () => {
    const selectedCountry = countrySelect.value;
    const selectedTier = tierSelect.value;
    const days = parseInt(daysInput.value);
    const travelers = parseInt(travelersInput.value);

    // Basic Input Validation
    if (!selectedCountry) {
        weatherDisplay.innerText = "Please select a country first!";
        suggestionDisplay.innerText = "";
        calculationDisplay.innerText = "";
        return;
    }

    if (isNaN(days) || days <= 0 || isNaN(travelers) || travelers <= 0) {
        calculationDisplay.innerText = "⚠️ Please enter valid numbers for Days and Travelers (> 0).";
        return;
    }

    // Set coordinates, timezones, and base daily rates in RM depending on the country
    let lat = 35.6762, lon = 139.6503; // Default Tokyo (Japan)
    let timeZoneID = "Asia/Tokyo";
    let baseDailyRateRM = 650; 

    if (selectedCountry === 'Malaysia') {
        lat = 3.1390; lon = 101.6869; // Kuala Lumpur
        timeZoneID = "Asia/Kuala_Lumpur";
        baseDailyRateRM = 250; 
    } else if (selectedCountry === 'Switzerland') {
        lat = 46.9480; lon = 7.4474; // Bern
        timeZoneID = "Europe/Zurich";
        baseDailyRateRM = 950; 
    }

    // Adjust daily rate multipliers based on traveler style
    let tierMultiplier = 1.0; 
    let tierName = "Mid-Range";
    
    if (selectedTier === 'budget') {
        tierMultiplier = 0.6; 
        tierName = "Budget";
    } else if (selectedTier === 'luxury') {
        tierMultiplier = 2.2; 
        tierName = "Luxury";
    }

    const finalDailyRateRM = Math.round(baseDailyRateRM * tierMultiplier);

    try {
        weatherDisplay.innerText = "Fetching weather data from API...";
        suggestionDisplay.innerText = "Generating suggestions...";
        calculationDisplay.innerText = "Calculating estimated expenses...";
        
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from API");
        }

        const data = await response.json();
        
        // TASK 2: RETRIEVING 5 PIECES OF API INFORMATION
        const countryInfo = selectedCountry;                             
        const temp = data.current_weather.temperature;                  
        const windspeed = data.current_weather.windspeed;                 
        const weatherCode = data.current_weather.weathercode;             
        
        // 5. Get exact local time in the selected country using its timezone
        const localTime = new Date().toLocaleTimeString('en-US', { 
            timeZone: timeZoneID, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });

        // Convert weather code into readable text
        let weatherCondition = "Clear / Normal";
        if (weatherCode > 0 && weatherCode <= 3) weatherCondition = "Partly Cloudy / Overcast";
        else if (weatherCode >= 51 && weatherCode <= 67) weatherCondition = "Rainy / Showers";
        else if (weatherCode >= 71 && weatherCode <= 77) weatherCondition = "Snowy";

        // Display all 5 retrieved API/calculated data points clearly (Fixed typo here)
        weatherDisplay.innerHTML = `<strong>1. Country:</strong> ${countryInfo} <br>
                                    <strong>2. Temperature:</strong> ${temp}°C <br>
                                    <strong>3. Wind Speed:</strong> ${windspeed} km/h <br>
                                    <strong>4. Condition:</strong> ${weatherCondition} <br>
                                    <strong>5. Local Time:</strong> ${localTime} (${timeZoneID})`;

        // TASK 3: STUDENT-WRITTEN SUGGESTION LOGIC
        let recommendations = "";

        if (selectedCountry === "Japan") {
            if (temp > 22) {
                recommendations = `☀️ Great weather in Japan! (${tierName} style): Visit Ueno Park, walk around Senso-ji Temple, or enjoy local street food.`;
            } else {
                recommendations = `🌥️ It's a bit chilly in Japan. (${tierName} style): Explore museums, underground shopping malls, or relaxing hot springs.`;
            }
        } 
        else if (selectedCountry === "Malaysia") {
            if (temp > 30) {
                recommendations = `🔥 Warm weather in Malaysia! (${tierName} style): Visit Aquaria KLCC, escape to Genting Highlands, or enjoy local treats by the beach.`;
            } else {
                recommendations = `🌧️ Mild or rainy weather in Malaysia. (${tierName} style): Visit indoor galleries or explore food spots in Petaling Street.`;
            }
        } 
        else if (selectedCountry === "Switzerland") {
            if (temp > 15) {
                recommendations = `🏔️ Pleasant Swiss weather! (${tierName} style): Take a scenic boat cruise or hike around Bernese Oberland.`;
            } else {
                recommendations = `❄️ Cold or snowy in Switzerland! (${tierName} style): Enjoy Swiss cheese fondue in Bern or visit the Swiss Alpine Museum.`;
            }
        } 
        else {
            recommendations = "No specific suggestions available for this selection.";
        }

        suggestionDisplay.innerHTML = `<strong>Activity Suggestions:</strong><br>${recommendations}`;

        // TASK 4: MEANINGFUL CALCULATION LOGIC
        const totalEstimatedCost = finalDailyRateRM * days * travelers;

        calculationDisplay.innerHTML = `💰 <strong>Estimated ${tierName} Trip Cost:</strong> RM ${totalEstimatedCost.toLocaleString()} 
                                        <br><small>(Based on RM ${finalDailyRateRM}/day per person for ${days} days and ${travelers} traveler(s))</small>`;

    } catch (error) {
        weatherDisplay.innerText = "Error: Could not retrieve API data. Please check your connection.";
        suggestionDisplay.innerText = "Could not generate suggestions due to API failure.";
        calculationDisplay.innerText = "Calculation aborted due to API failure.";
    }
});