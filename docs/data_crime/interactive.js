/**
 * This javascript file contains the functions of the interaction events with the data and the map.
 * It also contains the creation of the html elements that present complementary information about the data.
 * @author Jorge Victorino - Miguel Barrero
 * @version 1.0
 * @copyright
 * 
 * History:
 * v1.0 first version to configure the interaction events for each of the layers found in different menu options and system functionality.
 */

 // variable that saves the polygon id when the mouse passes over it
var hoverLayer = null;

/**
 * Function that adds the html element (container on the right side of the map) that contains the presentation and data information of the choropleth maps.
 * @param {string} id html element identifier 
 */
function addInfoChoropleticVisualization (id) {

    try {
        
        if (_(id) == undefined || _(id) == null) {
            
            let infoContainer = document.createElement('div');
            infoContainer.setAttribute('class', 'map-overlay');
            infoContainer.setAttribute('id', id);
            infoContainer.style.display = 'block';
            
            let divMap = (_('map'));
            insertAfter(divMap, infoContainer);
        }
        
    } catch (error) {
        console.log(error);
    }
}

/* Function deprecated */
function addControlToChoroplethProperties (id) {

    try {
        
        if(_(id) == undefined) {
            
            //  select master container
            let propContainer = document.createElement('div');
            propContainer.setAttribute('class', 'map-overlay');
            propContainer.setAttribute('id', id);
            propContainer.style.display = 'block';

            // inner container
            let containerSelect = document.createElement('div');
            containerSelect.setAttribute('class', 'containerElement');

            // div container for select
            let selectDiv = document.createElement('div');
            selectDiv.setAttribute('class', 'form-group');

            // select label
            let label = document.createElement('label');
            label.setAttribute('for', 'select-properties');
            label.innerText = 'Properties';

            // select 
            let selectMenu = document.createElement('select');
            selectMenu.setAttribute('class', 'form-control form-control-sm');
            selectMenu.setAttribute('id', 'select-properties');

            // append elements
            containerSelect.appendChild(label);
            containerSelect.appendChild(selectMenu);
            propContainer.appendChild(containerSelect);
            
            let divFeatures = (_('features'));
            insertAfter(divFeatures, propContainer);
        }
        
    } catch (error) {
        console.log(error);
    }

}

/**
 * Function that adds the legend (color scale) according to the data that represents the choropleth map.
 * @param {Array} dataQuantiles list of values in a logarithmic range or in percentiles of the choropleth map data
 * @param {Array} colorScale color scale for the choropleth map
 */
function addChoropleticLegend (dataQuantiles, colorScale) {

    
    let featuresContainer = _('features');
    var n = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;

    if (_('legend-container')!= null || _('legend-container') != undefined) {
        delElementVisualization ('legend-container');
    }

    // creating the legend container
    let legendContainer = document.createElement('div');
    legendContainer.setAttribute('id', 'legend-container');
    legendContainer.innerHTML = '<p><strong>Legend</strong></p>';

    // adjusting the notation for each item in the legend
    for (i = 0; i < dataQuantiles.length; i++) {
        
        var layer = dataQuantiles[i];

        if (layer.toString().split('.').length > 0) {
            console.log('es float');

            if (layer.toString().split('.')[0].length > 10) {

                layer = (layer).toExponential(2);
            } else {

                if (layer == 0) {
                    layer = 0;

                } else if(layer < 0.1) {

                    layer = layer.toExponential(2);

                } else {

                    layer = layer.toFixed(2);
                }

            }
        }
        else {
            
            if (layer.toString().length > 10) {

                layer = layer.toExponential(4);

            }
            else {
                layer =  dataQuantiles[i];
            }
        }

        var color = colorScale[i];
        if(layer == 0) {
            color = 'rgba(255, 255, 255, 1)';
        }
        
        var item = document.createElement('div');
        item.className = 'div-legend';
        
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legendContainer.appendChild(item);
      }
      featuresContainer.appendChild(legendContainer);
}

/**
 * Function that laments an html element of the visualization.
 * @param {string} id html element identifier
 */
function delElementVisualization (id) {

    _(id).remove();
}

/**
 * Function that allows inserting an html element after an already constituted html element in the visualization
 * @param {HtmlElement} referenceNode referenced html element
 * @param {*HtmlElement} newNode new html element
 */
function insertAfter(referenceNode, newNode) {

    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* Function deprecated */
function addChoropleticPropertiesToSelect (data) {

    let selectElement = _('select-properties');
    for (element in data) {
        
        let option = document.createElement('option');
        option.innerText = element;
        option.value = element;
        selectElement.appendChild(option);
        
    }

}

/**
 * Function that adds the list of properties from the dataset in the html container.
 * @param {Array} data choropleth map dataset property list 
 * @param {string} idLayer choropleth map layer identifier
 * @param {string} idSource identifier of the data resource with which the polygons are drawn
 * @param {object} dataChoropleth geojson data
 * @param {string} idMatch master identifier according to the spatial unit of the choropleth map
 * @param {string} typeOfEvent event type on the html element
 */
function addChoropleticProperties (data, idLayer, idSource, dataChoropleth, idMatch, typeOfEvent) {
    
    // getting the html container
    let propertiesList = _('features');
    let cnt = 0;

    if (_('properties') == null || _('properties') == undefined) {

        // generating the property list on the html element
        let div = document.createElement('div');
        div.setAttribute('class', 'property-options');
        div.setAttribute('id', 'property-options');
        div.innerHTML = '<p><strong>Properties</strong></p>';
        let ul = document.createElement('ul');
        ul.setAttribute('class', 'list-group');

        // iterating the property list
        for (element in data) {

            let li = document.createElement('li');
            let option = document.createElement('a');

            if (cnt == 0) {
                li.className = 'active';
            }
            cnt++;
            option.setAttribute('href', '#');
            option.innerText = formatProperties(element);
            option.value = element;
            li.appendChild(option);
            ul.appendChild(li);

            // adding the interaction event on the html element
            option.addEventListener(typeOfEvent, function (e) {

                let property = option.value;
                console.log(property);
                addLayerChoroplethMap (idLayer, idSource, 'visible', dataChoropleth, property, idMatch);
                addInteractiveInfoVisualization (idLayer, idSource, idMatch, property, dataChoropleth);
            });
    
        }
        div.appendChild(ul);
        propertiesList.appendChild(div);

        $(document).on('click', '.property-options ul li', function(){
    
            $(this).addClass('active').siblings().removeClass('active');
    
        });

    }

}

/**
 * Function that adds to each element of the property list the option to update and generate the choropleth map.
 * @param {string} idLayer choropleth map layer identifier
 * @param {string} idSource identifier of the data resource with which the polygons are drawn
 * @param {object} dataChoropleth geojson data
 * @param {string} idMatch master identifier according to the spatial unit of the choropleth map
 * @param {string} typeOfEvent event type on the html element
 * @param {HTMLElement} htmlElement element html
 */
function addEventChoroplethMapByProperty (idLayer, idSource, dataChoropleth, idMatch, typeOfEvent, htmlElement) {

    htmlElement.addEventListener(typeOfEvent, function (e) {

        let property = htmlElement.value;
        addLayerChoroplethMap (idLayer, idSource, 'visible', dataChoropleth, property, idMatch);
        addInteractiveInfoVisualization (idLayer, idSource, idMatch, property, dataChoropleth);
    });
}

/**
 * Function to change the style of the cursor over layer
 * @param {string} idLayer layer identifier
 */
function addCursorStyleOnLayer (idLayer) {

    map.on('mouseenter', idLayer, function() {
        map.getCanvas().style.cursor = 'pointer';  
    });

    map.on('mouseleave', idLayer, function() {
        map.getCanvas().style.cursor = '';  
    });
}

/**
 * Function to change the opacity of each spatial unit when placing the mouse
 * @param {string} idLayer layer identifier
 * @param {string} idSource source identifier
 */
function addChangeOpacityOnLayer (idLayer, idSource) {
    
    map.on('mousemove', idLayer, function(e) {

        if (hoverLayer) {
            
            map.setFeatureState({source: idSource, id: hoverLayer}, {hover: false});
        }

        hoverLayer = e.features[0].id;
        map.setFeatureState({source: idSource, id: hoverLayer}, {hover: true});
        
    });

    map.on('mouseleave', idLayer, function() {
        
        if (hoverLayer) {

            map.setFeatureState({source: idSource, id: hoverLayer}, {hover: false});
        }
        hoverLayer = null;
    });
}

/**
 * Function adds the information of the data set and manages its update when the mouse position is changed through the spatial units that make up the choropleth map
 * @param {string} idLayer layer identifier
 * @param {string} idSource source identifier
 * @param {string} idMatch master identifier according to the spatial unit of the choropleth map
 * @param {string} property selected property on the choroplethic map
 * @param {object} data geojson data
 */
function addInteractiveInfoVisualization (idLayer, idSource, idMatch, property, data) {

    // validating if container exists
    var infoContainer;   
    if (_('info-choropleth') == null || _('info-choropleth') == undefined) {

        // creating html title visualization
        var divContainer = _('features');
        var titleContainer = document.createElement('h2');
        titleContainer.innerHTML = '<strong>' + data.config.title + '</strong>';

        // add elements to container
        divContainer.appendChild(titleContainer);

        // creating html info container based in data information
        infoContainer = document.createElement('div');
        infoContainer.setAttribute('id', 'info-choropleth');

        divContainer.appendChild(infoContainer);

    } else {

        infoContainer = _('info-choropleth');
    }

    // config event of mouse on to change the data visualization
    map.on('mousemove', idLayer, function(e) {

        // making a query based in mouse point
        let spatialUnit = map.queryRenderedFeatures(e.point, {layers:[idLayer]});
        // get the first valuea from query
        let idMatchQuery = spatialUnit[0]['properties'][idMatch];
        // default value 
        let valueProperty = 0;

        // configuring the information from the data set and the selected space unit
        if (spatialUnit.length > 0) {
            

            for (var i = 0; i < data.features.length; i++) {

                if (data['features'][i]['properties'][idMatch] == idMatchQuery) {
                    valueProperty = data['features'][i]['properties'][property];
                    break;
                }
            }
            if (idSource == ID_LOCALITIES_SOURCE) {
                infoContainer.innerHTML = '<h3><strong> Location code: </strong>' + spatialUnit[0]['properties'][idMatch] + '</h3>' +
                                      '<p><h8><strong>' + spatialUnit[0].properties.NOM_LCL + '</strong></h8></p>' + 
                                      '<p><strong><em>' + property + ': </strong>' + valueProperty.toFixed(4) +'</em></p>';

            } else if (idSource == ID_UPZ_SOURCE) {

                infoContainer.innerHTML = '<h3><strong> UPZ code: </strong>' + spatialUnit[0]['properties'][idMatch] + '</h3>' +
                                      '<p><h8><strong>' + spatialUnit[0].properties.UPlNombre + '</strong></h8></p>' + 
                                      '<p><strong><em>' + property + ': </strong>' + valueProperty.toFixed(4)  +'</em></p>';

            } else if (idSource == ID_CAT_ZONE_SOURCE) {

                infoContainer.innerHTML = '<h3><strong> C. Zone code: </strong>' + spatialUnit[0]['properties'][idMatch] + '</h3>' +
                                      '<p><h8><strong>' + spatialUnit[0].properties.ZC_NOM + '</strong></h8></p>' + 
                                      '<p><strong><em>' + property + ': </strong>' + valueProperty.toFixed(4) +'</em></p>';

                
            }

        }

    }); 

}

/**
 * Function to format the text that is shown in the properties of the choroplethic map
 * @param {string} name property name
 * @return property formatted property
 */
function formatProperties (name) {

    let formatOption = name[0].toUpperCase() + (name.slice(1)).toLowerCase();
    //formatOption = formatOption.replace(/[&\/\\#, +$~%.'":*-?<>{}]/g, ' ');
    formatOption = formatOption.replace(/[^a-zA-Z0-9()]/g, ' '); 
    return formatOption;
}