import wixData from 'wix-data';

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

function initMap() {
    const zoomLevel = getZoomLevel();
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.7308768, lng: 90.5694174 },
        zoom: zoomLevel,
        mapId: '86ae51499fc30605',
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        minZoom: 2,
        maxZoom: 4,
    });

    function createMarkers(data) {
        data.forEach((item) => {
            const markerData = {
                position: {
                    lat: item.latitude,
                    lng: item.longitude
                },
                title: item.title,
                subtitle: item.subTitle,
                impact: item.impactOnIndia,
                status: item.conflictStatus,
                icon: {
                    url: "https://static.wixstatic.com/shapes/5fce4c_974dd891b7874ea4a8067bdf338c4dcc.svg",
                    scaledSize: {
                        width: 20,
                        height: 20
                    }
                },
                image: item.image,
                articleUrl: `/article/${item._id}` // Dynamic URL for each article
            };

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
                    <div class="arrow" onclick="window.location.href='${markerData.articleUrl}'">
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
    }

    wixData.query("ConflictTrackerArticles")
        .find()
        .then((results) => {
            createMarkers(results.items);
        })
        .catch((error) => {
            console.error('Error loading marker data from Wix:', error);
            // Fallback to marker-data.json if the Wix query fails
            fetch('https://5fce4cfc-ecde-4711-8030-3e266a18dfb7.usrfiles.com/ugd/5fce4c_5e7de29c691a40c7a3dc0ed69d0802c3.json')
                .then(response => response.json())
                .then(data => {
                    createMarkers(data);
                })
                .catch((jsonError) => {
                    console.error('Error loading marker data from JSON:', jsonError);
                });
        });
}

window.initMap = initMap;
