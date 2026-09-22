const weatherCodes = {
  0: ['Clear sky', '☀'], 1: ['Mainly clear', '◒'], 2: ['Partly cloudy', '◒'], 3: ['Overcast', '☁'],
  45: ['Foggy', '≋'], 48: ['Rime fog', '≋'], 51: ['Light drizzle', '˙'], 53: ['Drizzle', '˙'], 55: ['Heavy drizzle', '˙'],
  61: ['Light rain', '☂'], 63: ['Rain', '☂'], 65: ['Heavy rain', '☂'], 71: ['Light snow', '❄'], 73: ['Snow', '❄'], 75: ['Heavy snow', '❄'],
  77: ['Snow grains', '❄'], 80: ['Rain showers', '☂'], 81: ['Rain showers', '☂'], 82: ['Heavy showers', '☂'],
  85: ['Snow showers', '❄'], 86: ['Snow showers', '❄'], 95: ['Thunderstorm', 'ϟ'], 96: ['Storm + hail', 'ϟ'], 99: ['Storm + hail', 'ϟ']
};

const els = Object.fromEntries(['searchForm', 'cityInput', 'locationButton', 'notice', 'updatedAt', 'currentDate', 'currentSymbol', 'placeName', 'placeRegion', 'localTime', 'temperature', 'condition', 'feelsLike', 'humidity', 'wind', 'forecastRange', 'forecastList', 'uvIndex', 'precipitation', 'sunTimes', 'coordinates'].map(id => [id, document.getElementById(id)]));
const fahrenheit = false;

function showNotice(message) { els.notice.textContent = message; els.notice.hidden = false; }
function hideNotice() { els.notice.hidden = true; }
function formatDay(date, options) { return new Intl.DateTimeFormat('en-US', options).format(new Date(`${date}T12:00:00`)); }
function formatTime(dateTime) { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(dateTime)); }
function conditionFor(code) { return weatherCodes[code] || ['Changing conditions', '◌']; }
function setLoading(isLoading) { document.body.classList.toggle('is-loading', isLoading); }

async function getCoordinates(query) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
  if (!response.ok) throw new Error('The location service is unavailable right now.');
  const data = await response.json();
  if (!data.results?.length) throw new Error(`We couldn't find “${query}”. Try a nearby city or check the spelling.`);
  return data.results[0];
}

async function getWeather(place) {
  const params = new URLSearchParams({ latitude: place.latitude, longitude: place.longitude, timezone: 'auto', forecast_days: 7, current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m', daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset' });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error('Weather data could not be loaded. Please try again.');
  return response.json();
}

function render(place, data) {
  const current = data.current;
  const daily = data.daily;
  const [condition, symbol] = conditionFor(current.weather_code);
  els.updatedAt.textContent = `UPDATED ${formatTime(current.time)}`;
  els.currentDate.textContent = formatDay(current.time.slice(0, 10), { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
  els.currentSymbol.textContent = symbol;
  els.placeName.textContent = place.name;
  els.placeRegion.textContent = [place.admin1, place.country].filter(Boolean).join(', ');
  els.localTime.textContent = formatTime(current.time);
  els.temperature.textContent = Math.round(current.temperature_2m);
  els.condition.textContent = condition;
  els.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
  els.humidity.textContent = `${current.relative_humidity_2m}%`;
  els.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  els.uvIndex.textContent = daily.uv_index_max[0].toFixed(1);
  els.precipitation.textContent = `${daily.precipitation_probability_max[0]}%`;
  els.sunTimes.textContent = `${formatTime(daily.sunrise[0])} / ${formatTime(daily.sunset[0])}`;
  els.forecastRange.textContent = `${formatDay(daily.time[0], { month: 'short', day: 'numeric' })} – ${formatDay(daily.time[6], { month: 'short', day: 'numeric' })}`.toUpperCase();
  els.coordinates.textContent = `${Number(place.latitude).toFixed(2)}° N / ${Number(place.longitude).toFixed(2)}° E`;
  els.forecastList.innerHTML = daily.time.map((date, index) => {
    const [dayCondition, daySymbol] = conditionFor(daily.weather_code[index]);
    const dayName = index === 0 ? 'Today' : formatDay(date, { weekday: 'short' });
    return `<div class="forecast-day"><div class="forecast-day-name">${dayName}<small>${dayCondition}</small></div><span class="forecast-icon" title="${dayCondition}">${daySymbol}</span><div class="forecast-temp"><strong>${Math.round(daily.temperature_2m_max[index])}°</strong><small>${Math.round(daily.temperature_2m_min[index])}°</small></div><span class="rain">${daily.precipitation_probability_max[index]}% RAIN</span></div>`;
  }).join('');
}

async function loadWeather(query) {
  setLoading(true); hideNotice();
  try { const place = await getCoordinates(query); const data = await getWeather(place); render(place, data); }
  catch (error) { showNotice(error.message || 'Something went wrong. Please try again.'); }
  finally { setLoading(false); }
}

els.searchForm.addEventListener('submit', event => { event.preventDefault(); const query = els.cityInput.value.trim(); if (!query) { showNotice('Enter a city or place to search.'); return; } loadWeather(query); });
els.locationButton.addEventListener('click', () => { if (!navigator.geolocation) { showNotice('Location access is not supported by this browser.'); return; } setLoading(true); hideNotice(); navigator.geolocation.getCurrentPosition(async ({ coords }) => { try { const place = { latitude: coords.latitude, longitude: coords.longitude, name: 'Your location', country: 'Local conditions' }; const data = await getWeather(place); render(place, data); } catch (error) { showNotice(error.message); } finally { setLoading(false); } }, () => { setLoading(false); showNotice('Location permission was not granted. Search for a city instead.'); }); });

loadWeather('London');
