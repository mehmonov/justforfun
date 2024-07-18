let map, antipodeMap, marker, antipodeMarker;

document.getElementById('locationInput').addEventListener('input', function() {
    const query = this.value;
    if (query.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}`)
            .then(response => response.json())
            .then(data => {
                const suggestions = document.getElementById('suggestions');
                suggestions.innerHTML = '';
                data.forEach(place => {
                    const suggestionItem = document.createElement('li');
                    suggestionItem.textContent = place.display_name;
                    suggestionItem.className = 'cursor-pointer p-2 hover:bg-gray-200';
                    suggestionItem.addEventListener('click', function() {
                        document.getElementById('locationInput').value = place.display_name;
                        suggestions.innerHTML = '';
                        document.getElementById('locationInput').dataset.lat = place.lat;
                        document.getElementById('locationInput').dataset.lon = place.lon;
                        showMap(place.lat, place.lon);
                    });
                    suggestions.appendChild(suggestionItem);
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }
});

document.getElementById('calculateBtn').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('locationInput').dataset.lat);
    const lon = parseFloat(document.getElementById('locationInput').dataset.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
        calculateAntipode(lat, lon);
    } else {
        alert('Please select a valid location from the suggestions.');
    }
});

document.getElementById('locateBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name;
                    document.getElementById('locationInput').value = address;
                    document.getElementById('locationInput').dataset.lat = lat;
                    document.getElementById('locationInput').dataset.lon = lon;
                    showMap(lat, lon);
                })
                .catch(error => console.error('Error fetching address:', error));
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function showMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }
}

function calculateAntipode(latitude, longitude) {
    const antipodeLatitude = -latitude;
    let antipodeLongitude = (longitude + 180) % 360;
    if (antipodeLongitude > 180) {
        antipodeLongitude -= 360;
    }

    document.getElementById('result').innerHTML = `
        <p>Antipode Coordinates: Latitude ${antipodeLatitude.toFixed(4)}, Longitude ${antipodeLongitude.toFixed(4)}</p>
    `;

    showAntipodeMap(antipodeLatitude, antipodeLongitude);
}

function showAntipodeMap(lat, lon) {
    if (!antipodeMap) {
        antipodeMap = L.map('antipodeMap').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(antipodeMap);
    } else {
        antipodeMap.setView([lat, lon], 10);
    }

    if (antipodeMarker) {
        antipodeMarker.setLatLng([lat, lon]);
    } else {
        antipodeMarker = L.marker([lat, lon]).addTo(antipodeMap);
    }
}

function getAddress(latitude, longitude, prefix) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                const address = data.display_name;
                document.getElementById('result').innerHTML += `<p>${prefix} ${address}</p>`;
            } else {
                document.getElementById('result').innerHTML += `<p>${prefix} Address not found.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching address:', error);
            document.getElementById('result').innerHTML += `<p>${prefix} Error fetching address.</p>`;
        });
}
