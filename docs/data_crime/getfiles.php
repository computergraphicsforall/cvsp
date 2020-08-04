<?php
$directory = $_POST['directory'];
$explore;
$dir_content;
switch((int)$directory) {
    case 1:

        $explore = "data_crime/choropleth/upz/";
        $dir_content = scandir($explore);
    break;

    case 2:
        $explore = "data_crime/choropleth/lcl/";
        $dir_content = scandir($explore);
    break;

    case 3:
        $explore = "data_crime/choropleth/cat_zone/";
        $dir_content = scandir($explore);
    break;

    case 4:
        $explore = "data_crime/heatmap/";
        $dir_content = scandir($explore);
    break;
    
    case 5:
        $explore = "data_crime/animation/";
        $dir_content = scandir($explore);
    break;
}
echo $dir_content;

?>