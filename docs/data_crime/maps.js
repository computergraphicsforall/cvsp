/**
 * This javascript file contains the list of functions that manage under the Mapbox API, 
 * the different layers and data resources for visualization.
 * 
 * @author Jorge Victorino - Miguel Barrero
 * @version 1.0
 * @copyright
 * 
 * History:
 * v1.0 first version to configure the layers on map and the resources.
 */

/**
 * Function that loads the map provided by the Mapbox GL JS API
 */
function loadBasicMap () {
    
    mapboxgl.accessToken = token;
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        //style: 'mapbox://styles/mapbox/light-v9',
        center: [-74.081749, 4.6097102],
        antialias: true,
        zoom: 10,
        pitch: 17,
        hash: true,
        bearing: 90
    });
}

/**
 * Function that loads the default resources and layers assigned to the system through the MapBox API.
 */
function loadDefaultElementsOnMap (){

    map.on('load', function(){

        try {

            // source and layer UPZ polygons
            addSourceMap(ID_UPZ_SOURCE, UPZ_POL_LOCAL_PATH, 'geojson');
            addLayerPolygonOnMap(ID_LAYER_UPZ, ID_UPZ_SOURCE, 'none', '#3CB8FB', '#FFFFFF');

            // source and layer localities polygons
            addSourceMap(ID_LOCALITIES_SOURCE, LCL_POL_LOCAL_PATH, 'geojson');
            addLayerPolygonOnMap(ID_LAYER_LCL, ID_LOCALITIES_SOURCE, 'none', '#3CB8FB', '#FFFFFF');

            addSourceMap(ID_CAT_ZONE_SOURCE, CAT_ZONE_POL_LOCAL_PATH, 'geojson');
            addLayerPolygonOnMap(ID_LAYER_ZC, ID_CAT_ZONE_SOURCE, 'none', '#3CB8FB', '#FFFFFF');

            // localities borders
            addLineBorderLayerOnMap (ID_BORDER_LAYER_LCL, ID_LOCALITIES_SOURCE, 'none', '#FFFFFF', 1.2);
            // upz borders
            addLineBorderLayerOnMap (ID_BORDER_LAYER_UPZ, ID_UPZ_SOURCE, 'none', '#FFFFFF', 1.2);
            // catastral zones borders
            addLineBorderLayerOnMap (ID_BORDER_LAYER_ZC, ID_CAT_ZONE_SOURCE, 'none', '#FFFFFF', 1);

            // localities names
            addSourceMap(ID_NAMES_LCL_SOURCE, LCL_UNIT_NAMES_PATH, 'geojson');
            addPolygonNamesOnMap (ID_NAMES_LAYER_LCL, ID_NAMES_LCL_SOURCE, 'none', 'NOM_LCL', 0.68, 10, 20);

            // upz names
            addSourceMap(ID_NAMES_UPZ_SOURCE, UPZ_UNIT_NAMES_PATH, 'geojson');
            addPolygonNamesOnMap (ID_NAMES_LAYER_UPZ, ID_NAMES_UPZ_SOURCE, 'none', 'UPlNombre', 0.58, 10, 20);
            
           // catastral zones names
           addSourceMap(ID_NAMES_ZC_SOURCE, ZC_UNIT_NAMES_PATH, 'geojson');
           addPolygonNamesOnMap (ID_NAMES_LAYER_ZC, ID_NAMES_ZC_SOURCE, 'none', 'ZC_NOM', 0.5, 13, 22);

           // heatmap nuse
           addSourceMap(ID_HEATMAP_NUSE_SOURCE, HEATMAP_NUSE_PATH, 'geojson');
           addSourceMap(ID_HEATMAP_PTS_NUSE_SOURCE, HEATMAP_PTS_NUSE_PATH, 'geojson');

           // Ana choropleth map
           addLayerChoroplethMap (ID_EX_CHOPLETH_PRED, ID_LOCALITIES_SOURCE, 'none', DATA_ANA, 'constancy', 'COD_LCL')
           heatMapNuse();
            
        } catch (error) {
            console.log(error);
        }
        

    });

}

/**
 * Function that allows adding a data resource for the map
 * @param {string} id unique identifier of the resource
 * @param {string} url local or remote path where the resource is located
 * @param {string} sourceType resource type (see MapBox documentation for available resource types)
 */
function addSourceMap (id, url, sourceType) {

    try {
        
        if ((id != null || id != undefined) && (url != null || url != undefined) && (sourceType != null || sourceType != undefined)) {
            
            map.addSource(id, {type: sourceType, data: url});
        } else {
            console.log('Unable to add a resource to the map');
        }

        
    } catch (error) {

        console.log(error);
    }
}

/**
 * Function that allows adding a layer of polygons on the map. 
 * Polygons can represent different spatial units.
 * @param {string} idLayer unique identifier of the layer
 * @param {string} idSource identifier of the resource that contains the polygon data. These resources are previously loaded
 * @param {string} layout visibility of the layer, if it is visible it is assigned 'visible' if it is not visible it is assigned 'none'
 * @param {string} fillColor color for polygons
 * @param {string} fillOutlineColor border color for polygons
 */
function addLayerPolygonOnMap (idLayer, idSource, layout, fillColor, fillOutlineColor) {

    map.addLayer({
        id: idLayer,
        type: 'fill',
        source: idSource,
        layout: {visibility: layout},
        paint: {
            'fill-color': fillColor,
            'fill-outline-color': fillOutlineColor,
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.7,
                0.5
            ]
        }
    });
}

/**
 * Function that adds a line type layer to build the borders or limits of the spatial units.
 * @param {string} idLayer unique identifier of the layer
 * @param {string} idSoruce identifier of the resource that contains the polygon data. These resources are previously loaded.
 * @param {string} layout visibility of the layer, if it is visible it is assigned 'visible' if it is not visible it is assigned 'none'
 * @param {string} lineColor line color
 * @param {float} lineWith line width
 */
function addLineBorderLayerOnMap (idLayer, idSoruce, layout, lineColor, lineWith) {

    map.addLayer({
        id: idLayer,
        type: 'line',
        source: idSoruce,
        layout: { 'visibility': layout },
        paint: {
            'line-color': lineColor,
            'line-width': lineWith
        }
    });
}

/**
 * Function to add the names to each of the polygons of a layer.
 * @param {string} idLayer unique identifier of the layer
 * @param {string} idSource identifier of the resource that contains the data of the polygon names
 * @param {string} layout visibility of the layer, if it is visible it is assigned 'visible' if it is not visible it is assigned 'none'
 * @param {string} idMatch master identifier with which the name of the polygon is searched in the data set
 * @param {float} fontScale font scale
 * @param {float} minZoom minimum zoom at which the layer is displayed
 * @param {float} maxZoom maximum zoom at which the layer is displayed
 */
function addPolygonNamesOnMap (idLayer, idSource, layout, idMatch, fontScale, minZoom, maxZoom) {

    map.addLayer({
        id: idLayer,
        type: 'symbol',
        source: idSource,
        minzoom: minZoom,
        maxzoom: maxZoom,
        layout: {
            'visibility': layout,
            'text-field': ['format', ['upcase', ['get', idMatch]],
                {'font-scale': fontScale}],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
            'text-max-width': 3,
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            
            //'icon-image': ['concat', ['get', 'icon'], '-15']
        },
        paint: {"text-color": "#FFFFFF"}
    });
}

/**
 * Function to create choropleth maps.
 * @param {string} idLayer unique identifier of the layer
 * @param {string} idSource identifier of the resource that contains the polygon data. These resources are previously loaded.
 * @param {string} layout visibility of the layer, if it is visible it is assigned 'visible' if it is not visible it is assigned 'none'
 * @param {object} dataChoropleth geojson data
 * @param {*} propertyName property from which the choropleth map is built
 * @param {*} idMatch master identifier from which each of the base polygons of the map are related to the master identifier of the data for each of the spatial units
 */
function addLayerChoroplethMap (idLayer, idSource, layout, dataChoropleth, propertyName, idMatch) {
    
    // variable containing the values for a property on the dataset
    var dataValues = [];
    
    // logarithmic range, percentage for the color range and color scale
    var quantiles, colorScale;
    chpColorsMap = ['match', ['get', idMatch]];

    var dr = dataChoropleth;
    
    // saving property values in a new array
    dr.features.forEach(function (item) {
        try {

            dataValues.push(item['properties'][propertyName]);

        } catch (error) {
            console.error(error);
        }
    });
    
    try {

        if (dataValues.length > 0) {
            
            // defining the logarithmic or percentile range for the color scale
            quantiles = chroma.limits(dataValues, 'q', 4);
            console.log(quantiles);
            // generating the color scale according to the palette assigned within the dataset
            colorScale = chroma.scale([dr.config.c_palete[0], dr.config.c_palete[1]]).mode('lch').colors(dr.config.qcolors);
            console.log(colorScale);
            //
            dr.features.forEach(function(item){
    
                var color = '#f0df0a';
    
                for (var i = 0; i < quantiles.length; i++){
                    
                    if ((item['properties'][propertyName] <= quantiles[i]) && item['properties'][propertyName] != 0) {
                        
                        color = colorScale[i];
                        chpColorsMap.push(item['properties'][idMatch], color);
                        break;
                    } else {
                        color = 'rgba(0,0,0,0)'; //colorScale[0];
                    }
                }
            });
            // last value is the default, used where there is no data
            chpColorsMap.push('rgba(0,0,0,0)');
            
            // If there is no choropleth map with the name of the layer that is trying to create a new one, a new layer of this type is added.
            if (getIdLayer(idLayer) == undefined) {

                map.addLayer({
                    id: idLayer,
                    type: 'fill',
                    source: idSource,
                    layout: {visibility: layout},
                    paint: {
                        'fill-color': chpColorsMap,
                        'fill-outline-color': "#FFFFFF",
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            0.5,
                            0.8
                        ]
                    }
                });

                // change cursor on layer
                addCursorStyleOnLayer (idLayer);
                // add opacity change over space units
                addChangeOpacityOnLayer (idLayer, idSource);
                
                addChoropleticLegend(quantiles, colorScale);
            // otherwise the layer is updated 
            } else {

                setPaintProperty (idLayer, 'fill-color', chpColorsMap);
                setPaintProperty (idLayer, 'fill-outline-color', "#FFFFFF");
                addChoropleticLegend (quantiles, colorScale);
            }
            
        } else {
    
            console.log('No values to build choropleth map');
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

function heatMapNuse() {  

    map.addLayer({
        'id': ID_HEATMAP_NUSE,
        'type': 'heatmap',
        'source': ID_HEATMAP_NUSE_SOURCE,
        'layout': { 'visibility': 'none' },
        'minzoom': 8,
        'paint': {
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, 100, 10, 100, 11, 100, 12, 100, 13, 100, 14, 100, 15, 100],
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'incidents'], 0, 0, 10000, 0.5, 20000, 0.75, 40000, 1, 60000, 1.5, 80000, 2],
            'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
             0, 'rgba(33,102,172,0)', 
             0.2, 'rgba(51, 153, 255, 0.7)', 
             0.5, 'rgba(51, 204, 51,0.7)', 
             0.8, 'rgba(255, 204, 102, 0.7)', 
             1, 'rgba(204, 0, 0,0.7)'],
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'],12, 1 ,18, 0],
        
        }

    });

    map.addLayer({
        'id': ID_PTS_HEATMAP_NUSE,
        'type': 'circle',
        'source': ID_HEATMAP_PTS_NUSE_SOURCE,
        'layout': { 'visibility': 'none' },
        'minzoom': 13,
        'paint':{
            'circle-radius': 4,
            'circle-color': '#1AA1F3',
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity':['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, 1] 
        }
    });

}

/**
 * Function that gets a layer on the map
 * @param {string} id layer identifier
 * @return if the layer exists it returns the id if it doesn't return undefined
 */
function getIdLayer (id) {

    return map.getLayer(id);
}

/**
 * Function to validate the state of a property of a layer
 * @param {string} idLayer layer identifier
 * @param {string} property layer property
 * @return property value
 */
function getLayoutProperty (idLayer, property) {
    
    return map.getLayoutProperty(idLayer, property);
}

/**
 * Function that modifies a design property of a layer on the map.
 * @param {string} idLayer layer identifier
 * @param {string} property layer property
 * @param {string} value new value or asigment value
 */
function setLayoutProperty (idLayer, property, value) {
    
    map.setLayoutProperty(idLayer, property, value);
}

/**
 * Function that modifies a paint property of a layer on the map.
 * @param {*} idLayer layer identifier
 * @param {*} prop layer property
 * @param {*} value new value or asigment value
 */
function setPaintProperty (idLayer, prop, value) {

    map.setPaintProperty(idLayer, prop, value);
}

/**
 * Function that removes a layer from the map
 * @param {*} idLayer layer identifier
 */
function removeLayer(idLayer) {
   
    map.removeLayer(idLayer);
}

