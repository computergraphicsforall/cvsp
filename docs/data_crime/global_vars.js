/**
 * This javascript file contains the list of the constants and global variables that are manipulated through the application's life cicle. 
 * These constants contain:
 * - addresses of the default resources and where the coroplieticos maps are housed 
 * - identifiers for menus, space units, unit limits and their respective names
 * - identifiers for each of the layer types
 * - identifiers for the events
 * - addresses of the drivers in some operations that the server solves
 * 
 * @author Jorge Victorino - Miguel Barrero
 * @version 1.0
 * @copyright
 * 
 * History:
 * v1.0 first version to configure the interaction events for each of the layers found in different menu options and system functionality.
 */

// id token mapbox user
const token = 'pk.eyJ1IjoibWJhcnJlcm9wIiwiYSI6ImNrN28zZjczbTA0ZWwzaXF3aDAxcHl1dGkifQ.DlJqaPP1eC7PF_y-bbWjeg';

// local resources for the map configuration
const UPZ_POL_LOCAL_PATH = '../cvsp/data_crime/upz.json';
const CNTS_UPZ_LOCAL_PATH = '../cvsp/data_crime/centroids_upz_nuse_month.geojson';
const STKDE_UPZ_LOCAL_PATH = '../cvsp/data_crime/stkde_centroids_upz_nuse_month.geojson';
const UPZ_POL_EXTERNAL_PATH = 'https://datcloudflareosabiertos.bogota.gov.co/dataset/e1c11929-1b57-4900-8cae-0d236123b40a/resource/806a7752-c73d-4643-aaf0-ce88ab659bae/download/upla.json';
const LCL_POL_LOCAL_PATH = '../cvsp/data_crime/poligonos-localidades.geojson';
const CAT_ZONE_POL_LOCAL_PATH ='../cvsp/data_crime/scatgeojson.geojson';
const LCL_UNIT_NAMES_PATH = '../cvsp/data_crime/lcl_names.geojson';
const UPZ_UNIT_NAMES_PATH = '../cvsp/data_crime/upz_names.geojson';
const ZC_UNIT_NAMES_PATH = '../cvsp/data_crime/zc_names.geojson';
const HEATMAP_NUSE_PATH = '../cvsp/data_crime/heatmap/heatmap_nuse.geojson';
const HEATMAP_PTS_NUSE_PATH = '../cvsp/data_crime/heatmap/pts_nuse.geojson';
const CHORO_EX_PREDICT_PATH = '../cvsp/data_crime/choropleth/lcl/choropleth_predictability_localidades.geojson';

// global variables
var map, chpColorsMapUPZ;

// menu variables
const MENU_CHOROPLETH_BY_LOCALITIES = 'menuChoroplethLocalities';
const MENU_CHOROPLETH_BY_UPZ = 'menuChoroplethUPZ';
const MENU_CHOROPLETH_BY_CAT_ZONE = 'menuChoroplethCatastralZones';

// identifiers for local directoryes
const CHOROPLETH_LOCALITIES = 1;
const CHOROPLETH_UPZ = 2;
const CHOROPLETH_CAT_ZONE = 3;

// identifiers for local files
const CHOROPLETH_FILE_LCL = 1;
const CHOROPLETH_FILE_UPZ = 2;
const CHOROPLETH_FILE_ZC = 3;

// idenfiers for spatial unit layers and others
const ID_LOCALITIES_SOURCE = 'lcl';
const ID_UPZ_SOURCE = 'upz';
const ID_CAT_ZONE_SOURCE = 'cat_zone';


const ID_NAMES_LCL_SOURCE = 'lcl-name';
const ID_NAMES_UPZ_SOURCE = 'upz-name';
const ID_NAMES_ZC_SOURCE = 'zc-name';

const ID_EX_CHOPLETH_PRED = 'choro-predic-layer';
const ID_EX_CHOPLETH_SOURCE = 'choro-predic';
const ID_EX_NUSE = 'choro-nuse-layer';


const ID_HEATMAP_NUSE_SOURCE = 'hp-nuse';
const ID_HEATMAP_PTS_NUSE_SOURCE = 'pts-nuse';
const ID_HEATMAP_NUSE = 'heatmap-nuse';
const ID_PTS_HEATMAP_NUSE = 'pts-hp-nuse';

const ID_MATCH_LOCALITIES = 'COD_LCL';
const ID_MATCH_UPZ = 'COD_UPZ';
const ID_MATCH_CAT_ZONE = 'COD_ZC';

const CLICK_EVENT = 'click';
const ONCHANGE_EVENT = 'change';

// user variables
const BASE_PATH = 'data_crime/'
const CHOROPLETH_PATH = 'choropleth/';
const HEATMAP_PATH = 'heatmap/';
const ANIMATION_PATH = 'animation/';

const UPZ_CHOROPLETH = 'upz/';
const LCL_CHOROPLETH = 'lcl/';
const CAT_ZONE_CHOROPLETH = 'cat_zone/';

const SERVER_RESOURCE_PATH = 'docs/upload.php';
const SERVER_FILE_PATH = 'docs/getfiles.php';

// default menu names spatial units
const SU_LOCALITIES = 'Localities';
const SU_UPZ = 'UPZ';
const SU_CAT_ZONE = 'Catastral zones';

//default menu names space unit limits
const SUL_LOCALITIES = 'Locality limits';
const SUL_UPZ = 'UPZ limits';
const SUL_CAT_ZONE = 'Catastral limits';

//default menu names space unit limits
const SUN_LOCALITIES = 'Localities names';
const SUN_UPZ = 'UPZ names';
const SUN_CAT_ZONE = 'Catastral zone names';

// default id for polygons layers
const ID_LAYER_LCL = 'lcl-layer';
const ID_LAYER_UPZ = 'upz-layer';
const ID_LAYER_ZC = 'zc-layer';

// default id for border layers
const ID_BORDER_LAYER_LCL = 'lcl-brd-layer'; 
const ID_BORDER_LAYER_UPZ = 'upz-brd-layer';
const ID_BORDER_LAYER_ZC = 'zc-brd-layer';

// default id for name layers
const ID_NAMES_LAYER_LCL = 'lcl-name-layer'; 
const ID_NAMES_LAYER_UPZ = 'upz-name-layer';
const ID_NAMES_LAYER_ZC = 'zc-name-layer';



