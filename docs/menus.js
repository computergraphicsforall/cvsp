/**
 * This javascript file contains the list of functions responsible for the dynamic creation of the options presented in the menu of choropleth maps. 
 * The list of options will depend directly on the files that the user has loaded. Each option will allow the user to view the respective selected choropleth map.
 * Additionally it contains the presentation logic of some html elements that will be created, displayed, updated or hidden in the change between different choropleth maps.
 * 
 * There are also the functions that control the visualization of the layers of the spatial units,
 * limits and names available and that come by default with the system through the menu Default elements that can accompany any type of visualization.
 * 
 * @author Jorge Victorino - Miguel Barrero
 * @version 1.0
 * @copyright
 * 
 * History:
 * v1.0 First version for the dynamic creation of the menu options of choropleth maps for the different types of spatial units,
 *      as well as the configuration of each event by menu option.
 */

// this variables contains the real name of the file and the name of the option for the choropletic menu
var menuChoroplethUPZ = {};
var menuChoroplethLocalities = {};
var menuChoroplethCatastralZones = {};

// This variable contains the content of the data that is being displayed on the choropleth map
var geoDataChoropleth;

// This variable stores which is the last active choropetic map
var activeChoropleticMap = undefined;

// variables that store the last layers at the spatial unit level, limits and borders selected by the user through the menus.ññ..
var activeSpatialUnit = ID_LAYER_LCL;
var activeBorderSpatialLimit = ID_BORDER_LAYER_LCL;
var activeSpatialUnitName = ID_NAMES_LAYER_LCL;

/**
 * Function that logically adds the visualization between the different spatial units 
 * that the map has by default without any file being loaded by the user
 */
function setEventsToSpatialUnitOptions () {

    let menu = _('spatial-unit-options');

    // adding for each menu option at the spatial unit level the invocation and display event of the corresponding spatial unit
    Array.from(menu.children).forEach(function(item){

        item.addEventListener(CLICK_EVENT, function(e){

            // validating that the option name corresponds to the selected space unit (localidades)
            if(item.textContent.toString().endsWith(SU_LOCALITIES)) {
                
                if (getIdLayer(ID_LAYER_LCL) != undefined) {
                    
                    //changing the display of the layer depending on the state in which it is currently
                    let visibility = getLayoutProperty(ID_LAYER_LCL, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_LAYER_LCL, 'visibility', 'none');
                        activeSpatialUnit = undefined;

                    } else if (visibility == 'none') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_LAYER_LCL, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_LAYER_LCL, item.textContent,  _('spatial-unit-options'), activeSpatialUnit);
                        activeSpatialUnit = ID_LAYER_LCL;
                        
                    }
                }
            // validating that the option name corresponds to the selected space unit (upz)
            } else if (item.textContent.toString().endsWith(SU_UPZ) ) {

                if (getIdLayer(ID_LAYER_UPZ) != undefined) {
                    
                    //changing the display of the layer depending on the state in which it is currently
                    let visibility = getLayoutProperty(ID_LAYER_UPZ, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_LAYER_UPZ, 'visibility', 'none');
                        activeSpatialUnit = undefined;
                        

                    } else if (visibility == 'none') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_LAYER_UPZ, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_LAYER_UPZ, item.textContent,  _('spatial-unit-options'), activeSpatialUnit);
                        activeSpatialUnit = ID_LAYER_UPZ;
                    }
                }
            // validating that the option name corresponds to the selected space unit (zonas catastrales)
            } else if (item.textContent.toString().endsWith(SU_CAT_ZONE)) {

                if (getIdLayer(ID_LAYER_ZC) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_LAYER_ZC, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_LAYER_ZC, 'visibility', 'none');
                        activeSpatialUnit = undefined;

                    } else if (visibility == 'none') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_LAYER_ZC, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_LAYER_ZC, item.textContent,  _('spatial-unit-options'), activeSpatialUnit);
                        activeSpatialUnit = ID_LAYER_ZC;
                    }
                }

            }
            
        });

    });

}

/**
 * Function that logically adds the visualization between the different spatial 
 * units that the map has by default without any file being loaded by the user
 */
function setEventsToSpaceUnitLimitsOptions () {

    let menu = _('spatial-limit-options');

    // adding for each limit menu option the invocation and display event for each spatial unit
    Array.from(menu.children).forEach(function(item){

        item.addEventListener(CLICK_EVENT, function(e){

            // validating that the name of the option corresponds to the limits of the selected spatial unit (localidades)
            if(item.textContent.toString().endsWith(SUL_LOCALITIES)) {
                
                if (getIdLayer(ID_BORDER_LAYER_LCL) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_BORDER_LAYER_LCL, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_BORDER_LAYER_LCL, 'visibility', 'none');
                        activeBorderSpatialLimit = undefined;

                    } else if (visibility == 'none') {
                        
                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_BORDER_LAYER_LCL, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_BORDER_LAYER_LCL, item.textContent, _('spatial-limit-options'), activeBorderSpatialLimit);
                        activeBorderSpatialLimit = ID_BORDER_LAYER_LCL;
                        
                    }
                }
            // validating that the name of the option corresponds to the limits of the selected spatial unit (upz)
            } else if (item.textContent.toString().endsWith(SUL_UPZ) ) {

                if (getIdLayer(ID_BORDER_LAYER_UPZ) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_BORDER_LAYER_UPZ, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_BORDER_LAYER_UPZ, 'visibility', 'none');
                        activeBorderSpatialLimit = undefined;
                        

                    } else if (visibility == 'none') {
                        // changing the option status

                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_BORDER_LAYER_UPZ, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_BORDER_LAYER_UPZ, item.textContent,  _('spatial-limit-options'), activeBorderSpatialLimit);
                        activeBorderSpatialLimit = ID_BORDER_LAYER_UPZ;
                    }
                }
            // validating that the name of the option corresponds to the limits of the selected spatial unit (zonas catastrales)
            } else if (item.textContent.toString().endsWith(SUL_CAT_ZONE)) {

                if (getIdLayer(ID_BORDER_LAYER_ZC) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_BORDER_LAYER_ZC, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_BORDER_LAYER_ZC, 'visibility', 'none');
                        activeBorderSpatialLimit = undefined;

                    } else if (visibility == 'none') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_BORDER_LAYER_ZC, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_BORDER_LAYER_ZC, item.textContent,  _('spatial-limit-options'), activeBorderSpatialLimit);
                        activeBorderSpatialLimit = ID_BORDER_LAYER_ZC;
                    }
                }

            }
            
        });

    });

}

/**
 * Function that logically adds the display between the different 
 * spatial units the names that represent them
 */
function setEventsToSpaceUnitNamesOptions () {

    let menu = _('spatial-name-options');

    // adding for each menu option the invocation of names and the display event for each spatial unit
    Array.from(menu.children).forEach(function(item){

        item.addEventListener(CLICK_EVENT, function(e){

            // validating that the option name corresponds to the names of the selected spatial units (localities)
            if(item.textContent.toString().endsWith(SUN_LOCALITIES)) {
                
                if (getIdLayer(ID_NAMES_LAYER_LCL) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_NAMES_LAYER_LCL, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_NAMES_LAYER_LCL, 'visibility', 'none');
                        activeSpatialUnitName = undefined;

                    } else if (visibility == 'none') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_NAMES_LAYER_LCL, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_NAMES_LAYER_LCL, item.textContent, _('spatial-name-options'), activeSpatialUnitName);
                        activeSpatialUnitName = ID_NAMES_LAYER_LCL;
                        
                    }
                }
            // validating that the option name corresponds to the names of the selected spatial units (upz)
            } else if (item.textContent.toString().endsWith(SUN_UPZ) ) {

                if (getIdLayer(ID_NAMES_LAYER_UPZ) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_NAMES_LAYER_UPZ, 'visibility');
                    if (visibility == 'visible') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_NAMES_LAYER_UPZ, 'visibility', 'none');
                        activeSpatialUnitName = undefined;
                        

                    } else if (visibility == 'none') {

                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_NAMES_LAYER_UPZ, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_NAMES_LAYER_UPZ, item.textContent,  _('spatial-name-options'), activeSpatialUnitName);
                        activeSpatialUnitName = ID_NAMES_LAYER_UPZ;
                    }
                }
            // validating that the option name corresponds to the names of the selected spatial units (zonas catastrales)
            } else if (item.textContent.toString().endsWith(SUN_CAT_ZONE)) {

                if (getIdLayer(ID_NAMES_LAYER_ZC) != undefined) {
                    
                    let visibility = getLayoutProperty(ID_NAMES_LAYER_ZC, 'visibility');
                    if (visibility == 'visible') {
                        
                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Hide', 'Show');
                        setLayoutProperty (ID_NAMES_LAYER_ZC, 'visibility', 'none');
                        activeSpatialUnitName = undefined;

                    } else if (visibility == 'none') {
                        
                        // changing the option status
                        item.textContent = item.textContent.toString().replace('Show', 'Hide');
                        setLayoutProperty (ID_NAMES_LAYER_ZC, 'visibility', 'visible');
                        hideDeafaultSpatialLayerByMenuOption (ID_NAMES_LAYER_ZC, item.textContent,  _('spatial-name-options'), activeSpatialUnitName);
                        activeSpatialUnitName = ID_BORDER_LAYER_ZC;
                    }
                }

            }
            
        });

    });

}

/**
 * Function that controls the activation or de-activation of a layer when it is changed through the menu of default elements.
 * 
 * @param {string} idLayer identifier of the layer to be activated
 * @param {string} optionName name of the default item menu option you are trying to activate
 * @param {string} menu identifier of the menu containing the options
 * @param {string} active identifier of the currently active layer
 */

function hideDeafaultSpatialLayerByMenuOption (idLayer, optionName, menu, active) {

    if (idLayer != active && active != undefined) {

        let localityUnits = menu;
        setLayoutProperty (active, 'visibility', 'none');

        if (localityUnits.childElementCount > 0) {

            Array.from(localityUnits.children).forEach(function(item){

                if (item.innerText.toString().startsWith('Hide') && item.innerText != optionName){
                    item.innerText = item.innerText.toString().replace('Hide', 'Show');
                }
            });
        }
    }

}

/**
 * Function that dynamically builds the menu of choropleth maps for different spaces. 
 * The menu options depend on the number of files that exist for each type of space unit. 
 * The names of the options will correspond to the name of the file found in each directory of the different space units.
 * 
 * @param {string} idMenu menu name
 * @return it resolves as true if it finds files and rejects if it doesn't find files. 
 *         If it is rejected, no options will be added to the indicated menu through the idMenu parameter
 */
function menuChoroplethMaps (idMenu) {

    return new Promise (function(resolve, reject) {

        // getting the html object
        let currentOptions = _(idMenu);
        let choroFilesOnDisk;
        let idDirectory = getIdResourceFolder(idMenu);
        
        // when the map loads for the first time 
        if (currentOptions.childElementCount == 0) {

            // reading the items found in the directory for the indicated menu
            choroFilesOnDisk = listDirectoryFiles(idDirectory).catch(err => console.log('check errors: ' + err));
            choroFilesOnDisk.then(function (files) {
                
                
                if (Object.keys(files).length > 0) {
                    
                    for (option in files) {

                        // format option name and add to history in menu choropleth by session
                        let optionName = getIdOfLayerByNameOfFile(files[option]);
                        optionName = formatOptions(optionName);

                        // creating a new options in menu
                        let newOption = document.createElement('a');
                        let currentMenu = currentOptions.getAttribute('name');
                        newOption.setAttribute('class', 'dropdown-item');
                        newOption.setAttribute('href', '#');
                        newOption.textContent = 'Show: ' + optionName;
                        currentOptions.appendChild(newOption);
                        
                        // add file history and get name of menu list and event
                        let menu = addOptionToListMenu (currentMenu, optionName, files[option]);
                        addEventToChoroplethMap(CLICK_EVENT, optionName,  newOption, menu);
                        
                    }
                    resolve();

                } else {
                    console.log('Not found in the choroplethic maps directory.');
                    reject();
                }
            });
        }

    });
}

/**
 * Function that establishes which is the identifier of the directory that must be accessed according to the menu option of choroplethic maps parameterized.
 * @param {string} idMenu menu name.
 * @return identifier of the directory that corresponds to the menu of choropleth maps according to the spatial unit
 */
function getIdResourceFolder (idMenu) {

    if (idMenu === 'upz-choro-options') {
        return 1;
    }
    if (idMenu === 'localities-choro-options') {
        return 2;
    }
    if (idMenu === 'catastral-choro-options') {
        return 3;
    }
    
}
/**
 * Function that adjusts and formats the text to be displayed in an option
 * @param {string} name text
 * @return formatted text
 */
function formatOptions (name) {

    let formatOption = name[0].toUpperCase() + name.slice(1);
    //formatOption = formatOption.replace(/[&\/\\#, +$~%.'":*-?<>{}]/g, ' ');
    formatOption = formatOption.replace(/[^a-zA-Z0-9()]/g, ' '); 
    return formatOption;
}

/**
 * Function that temporarily stores the names of the choroplethic map files for each menu option according to the spatial unit.
 * @param {string} idOption identifier of the options menu containing the file name
 * @param {string} nameOption name of the option previously assigned according to the file name
 * @param {string} refFile full name of the file found in the directory
 * @return identifier of the menu to which the choropleth map is assigned 
 */
function addOptionToListMenu (idOption, nameOption, refFile) {

    if (idOption === 'localities-choro-options') {
        
        menuChoroplethLocalities[nameOption] = refFile;
        return MENU_CHOROPLETH_BY_LOCALITIES;
    }
    if (idOption === 'upz-choro-options') {
        
        menuChoroplethUPZ[nameOption] = refFile;
        return MENU_CHOROPLETH_BY_UPZ;
    }
    if (idOption === 'catastral-choro-options') {

        menuChoroplethCatastralZones[nameOption] = refFile;
        return MENU_CHOROPLETH_BY_CAT_ZONE;
    }
}

/**
 * Function that adds the event of loading the data, the properties of the data, 
 * and the interactive events on the map for each option of the menu of choropleth maps.
 * The name of the menu option will be the same name for the name of the layer on the map
 * @param {string} typeOfEvent event type on the html element
 * @param {string} optionName menu option name
 * @param {htmlElement} htmlElement html element
 * @param {string} menu menu identifier
 */
function addEventToChoroplethMap (typeOfEvent, optionName, htmlElement, menu) {
    
    htmlElement.addEventListener(typeOfEvent, function(e) {

        let path;
        let idSource;
        let idMatch 

        // establishing the resource to use on event
        if (menu === MENU_CHOROPLETH_BY_LOCALITIES) {

            path = BASE_PATH + CHOROPLETH_PATH + LCL_CHOROPLETH + menuChoroplethLocalities[optionName];
            idSource = ID_LOCALITIES_SOURCE;
            idMatch = ID_MATCH_LOCALITIES;

        } else if (menu === MENU_CHOROPLETH_BY_UPZ) {

            path = BASE_PATH + CHOROPLETH_PATH + UPZ_CHOROPLETH + menuChoroplethUPZ[optionName];
            idSource = ID_UPZ_SOURCE;
            idMatch = ID_MATCH_UPZ;

        } else if (menu === MENU_CHOROPLETH_BY_CAT_ZONE) {

            path = BASE_PATH + CHOROPLETH_PATH + CAT_ZONE_CHOROPLETH + menuChoroplethCatastralZones[optionName];
            idSource = ID_CAT_ZONE_SOURCE;
            idMatch = ID_MATCH_CAT_ZONE ;
        }

        // validating that the menu option has a path related to a file previously saved in the directories for each of the spatial units.
        if (path != undefined) {
            
            // validating if the layer has been previously loaded 
            if (getIdLayer(optionName) == undefined) {

                // reading geojson file
                let dataChoropleth = readGeoFiles(path).catch(err => console.log('check errors: ' + err));
                dataChoropleth.then (function (data){

                    // global variable to manipulate choropletic data
                    geoDataChoropleth = data;

                    // get default property in geojson file and set this property for choropleth map
                    let defaultProperty = getDefaultProperty (data, idMatch);
                    htmlElement.textContent = 'Hide: ' + optionName;

                    hideChoropleticLayerByMenuOption(optionName);
                    addInfoChoropleticVisualization ('features'); 
                    addInteractiveInfoVisualization (optionName, idSource, idMatch, defaultProperty, data);
                    
                    let dataProperties = getPropertiesByData (data, idMatch);
                    if (Object.keys(dataProperties).length > 1) {

                        addChoropleticProperties(dataProperties, optionName, idSource, data, idMatch, CLICK_EVENT);     
                    }
                    
                    addLayerChoroplethMap (optionName, idSource, 'visible', data, defaultProperty, idMatch);
                    activeChoropleticMap = optionName;

                    
                 });
                 
            // if it is already loaded, the data is hidden or displayed depending on the state    
            } else {
                
                if (getLayoutProperty(optionName, 'visibility') === 'visible') {

                    htmlElement.textContent = 'Show: ' + optionName;
                    removeLayer(optionName);
                    delElementVisualization ('features');
                    
                }
            }   
        }     
    });
} 

/**
 * Function that sets a default property of the dataset. 
 * The first display of the coroplietico map will be done by this property. 
 * The only properties that will be added are numeric.
 * @param {object} data geojson data
 * @param {*} idMatch master identifier for the spatial unit of the choropleth map
 * @return property name
 */
/* Function to load by default a property in the coropleticp map */
function getDefaultProperty (data, idMatch) {

    let props = data.features[0].properties;
    let propName;
    for (prop in props) {

        if (prop != idMatch && isNumeric(props[prop])) {

            propName = prop;
            break;
        }
    }
    return propName;
}

/**
 * Function that hides or removes the layer that is being displayed so that it can be replaced by another. 
 * This can be done by alternating between different spatial units for different choropleth maps.
 * @param {string} idLayer identifier of the layer to be activated
 */
/** funtion to update the layer */
function hideChoropleticLayerByMenuOption(idLayer) {


    if (idLayer != activeChoropleticMap && activeChoropleticMap != undefined) {

        let localitiesMenu = _('localities-choro-options');
        let upzMenu = _('upz-choro-options');
        let catZoneMenu = _('catastral-choro-options');
        
        removeLayer(activeChoropleticMap);
        
        if (_('features') != null || _('features') != undefined){
            delElementVisualization('features');
            
        }
        
        if (localitiesMenu.children.length > 0) {
            
            Array.from(localitiesMenu.children).forEach(function(item){
                
                if (item.innerText.toString().startsWith('Hide') && !item.innerText.toString().endsWith(idLayer)){
                    item.innerText = item.innerText.toString().replace('Hide', 'Show');
                }
            });
        }
        
        if (upzMenu.children.length > 0) {
            
            Array.from(upzMenu.children).forEach(function(item){
                
                if (item.innerText.toString().startsWith('Hide') && !item.innerText.toString().endsWith(idLayer)){
                    item.innerText = item.innerText.toString().replace('Hide', 'Show');
                }
            });
        }
        if (catZoneMenu.children.length > 0) {
            
            Array.from(catZoneMenu.children).forEach(function(item){

                if (item.innerText.toString().startsWith('Hide') && !item.innerText.toString().endsWith(idLayer)){
                    item.innerText = item.innerText.toString().replace('Hide', 'Show');
                }
            });
        }
    }
}

function menuHeatMaps(id) {


    let menu = _(id);

    Array.from(menu.children).forEach(function(item, index){

        if (index == 0) {
            
            item.addEventListener(CLICK_EVENT, function(e){

                if (item.innerText.toString().startsWith('Show') && getLayoutProperty(ID_HEATMAP_NUSE, 'visibility') == 'none' && getLayoutProperty(ID_PTS_HEATMAP_NUSE, 'visibility') == 'none') {

                    
                    setLayoutProperty(ID_HEATMAP_NUSE, 'visibility', 'visible');
                    setLayoutProperty(ID_PTS_HEATMAP_NUSE, 'visibility', 'visible');
                    item.innerText = item.innerText.toString().replace('Show', 'Hide');

                }
                else {

                    setLayoutProperty(ID_HEATMAP_NUSE, 'visibility', 'none');
                    setLayoutProperty(ID_PTS_HEATMAP_NUSE, 'visibility', 'none');
                    item.innerText = item.innerText.toString().replace('Hide', 'Show');
                }

            });
        }

    });

}

function menuStaticChoropleth(id) {


    let menu = _(id);

    Array.from(menu.children).forEach(function(item, index){

        if (index == 0) {
            
            item.addEventListener(CLICK_EVENT, function(e){

                if (item.innerText.toString().startsWith('Show') && getLayoutProperty(ID_EX_CHOPLETH_PRED, 'visibility') == 'none' && getLayoutProperty(ID_EX_CHOPLETH_PRED, 'visibility') == 'none') {

                    addInfoChoropleticVisualization ('features'); 
                    addInteractiveInfoVisualization (ID_EX_CHOPLETH_PRED, ID_LOCALITIES_SOURCE, 'COD_LCL', 'constancy', DATA_ANA);
                    setLayoutProperty(ID_EX_CHOPLETH_PRED, 'visibility', 'visible');
                    item.innerText = item.innerText.toString().replace('Show', 'Hide');

                    let dataProperties = getPropertiesByData (DATA_ANA, 'COD_LCL');
                    if (Object.keys(dataProperties).length > 1) {

                        addChoropleticProperties(dataProperties, ID_EX_CHOPLETH_PRED, ID_LOCALITIES_SOURCE, DATA_ANA, 'COD_LCL', CLICK_EVENT);     
                    }

                }
                else {

                    setLayoutProperty(ID_HEATMAP_NUSE, 'visibility', 'none');
                    item.innerText = item.innerText.toString().replace('Hide', 'Show');
                }

            });
        }

    });

}
/**
 * Function to load all properties that are numeric as display options in the properties menu for choroplietic map.
 * The name and value of the property by which the data is bound to the space units will not be a menu property
 * @param {object} data geojson data
 * @param {*} idMatch master identifier for the spatial unit of the choropleth map
 * @return list of properties for the menu
 */
function getPropertiesByData (data, idMatch) {

    let menuProps = {};
    let props = data.features[0].properties;
    for (prop in props) {

        if (prop !== idMatch && isNumeric(props[prop])) {

            menuProps[prop] = prop;
        }
    }  
    return menuProps;
}

/**
 * Function to validate if a value is numeric
 * @param {string} value value to evaluate
 * @return true or false. depends on whether the string or value entered is a number
 */

function isNumeric(value) {

    if (typeof value !== 'number') {
        return false
    }
    if (value !== Number(value)) {
        return false
    }
    if (value === Infinity || value === !Infinity) {
        return false
    }
    return true;
}