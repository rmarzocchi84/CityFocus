$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});
var application;
require(['js/worldwind', 'js/UserInterface', 'js/geojson'],
    function (worldwind, UserInterface, GeoJson) {

        if (application) {

            worldwind = new worldwind();
            this.geojson = new GeoJson(worldwind.layerManager);
            var UserInterface = new UserInterface(worldwind.layerManager, this.geojson);
            UserInterface.listeners();

            addOSM(worldwind.layerManager, geojson);


            function addOSM(layerManager, geojson) {
                var request = new XMLHttpRequest();
                request.open("GET", "http://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities", true);
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        var xmlDom = request.responseXML;

                        if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
                            xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                        }
                        var wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);
                        var config = WorldWind.WmsLayer.formLayerConfiguration(wmsCapsDoc, null);
                        config.title = "OpenStreetMap";
                        config.layerNames = "OSM-WMS";
                        var layer = new WorldWind.WmsLayer(config, null);
                        layer.detailControl = 0.9;
                        wwd.addLayer(layer);
                        var callback= function(){
                            geojson.milano.call(geojson);
                        }
                        geojson.add("NIL_Zone", "Area", 1, callback);
                        //layerManager.synchronizeLayerList();

                    }

                };

                request.send(null);
            }
        }
    });


