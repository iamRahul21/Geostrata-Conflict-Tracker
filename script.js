document.getElementById('hamburger').addEventListener('click', function () {
    var overlay = document.getElementById('overlay');
    if (overlay.style.display === 'block') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'block';
    }
});

let currentInfoWindow = null;

function getZoomLevel() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 576) {
        return 4;  // Mobile devices
    } else if (screenWidth <= 768) {
        return 4;  // Small tablets
    } else if (screenWidth <= 992) {
        return 3;  // Tablets
    } else if (screenWidth <= 1200) {
        return 3;  // Small desktops
    } else {
        return 2;  // Large desktops
    }
}

// function getCenterCoordinates() {
//     const screenWidth = window.innerWidth;

//     if (screenWidth <= 576) {
//         // 19.7308768,86.5694174 INDIA
//         return { lat: 19.7308768, lng: 78.5694174 };  // Center for mobile devices
//     } else if (screenWidth <= 768) {
//         return { lat: 30.5937, lng: 70.9629 };  // Center for small tablets
//     } else if (screenWidth <= 992) {
//         return { lat: 40.5937, lng: 60.9629 };  // Center for tablets
//     } else if (screenWidth <= 1200) {
//         return { lat: 50.5937, lng: 50.9629 };  // Center for small desktops
//     } else {
//         return { lat: 10.7308768, lng: 90.5694174 };  // Center for large desktops
//     }
// }

function initMap() {
    const zoomLevel = getZoomLevel();
    // const centerCoordinates = getCenterCoordinates();

    const map = new google.maps.Map(document.getElementById("map"), {
        // center: centerCoordinates,
        center: { lat: 39.7308768, lng: 90.5694174 },
        zoom: zoomLevel,
        mapId: '86ae51499fc30605',
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        minZoom: 2,
        maxZoom: 4,
    });

    fetch('marker-data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(markerData => {
                const marker = new google.maps.Marker({
                    position: markerData.position,
                    map: map,
                    title: markerData.title,
                    icon: {
                        url: markerData.icon.url,
                        scaledSize: new google.maps.Size(markerData.icon.scaledSize.width, markerData.icon.scaledSize.height)
                    }
                });

                const contentString = `
                    <div class="card">
                        <div class="container1">
                            <div class="image-container">
                                <img src="${markerData.image}" alt="${markerData.title}"/>
                            </div>
                        </div>
                        <div class="blank"></div>
                        <div class="container2">
                            <div class="content">
                                <div class="header">
                                    <p class="info-subtitle">${markerData.subtitle}</p>
                                    <h1 class="info-title">${markerData.title}</h1>
                                </div>
                                <div class="details">
                                    <hr width="100%" size=".01">
                                    <p><strong>Impact on India:</strong> <span>${markerData.impact}</span></p>
                                    <hr width="100%" size=".01">
                                    <p><strong>Conflict Status:</strong> <span>${markerData.status}</span></p>
                                    <hr width="100%" size=".01">
                                </div>
                            </div>
                        </div>
                        <div class="arrow" onclick="window.location.href='info.html'">
                            <span>&rarr;</span>
                        </div>
                    </div>`;

                const infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    ariaLabel: markerData.title,
                });

                marker.addListener("mouseover", () => {
                    if (currentInfoWindow) {
                        currentInfoWindow.close();
                    }
                    infowindow.open({
                        anchor: marker,
                        map,
                        shouldFocus: false,
                    });
                    currentInfoWindow = infowindow;
                });

                google.maps.event.addListener(map, 'click', function() {
                    if (currentInfoWindow) {
                        currentInfoWindow.close();
                        currentInfoWindow = null;
                    }
                });
            });
        })
        .catch(error => console.error('Error loading marker data:', error));
}

window.initMap = initMap;