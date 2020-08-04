<?php

$fileName = $_FILES['inputFileIV']['name'];
$fileTmpLoc = $_FILES['inputFileIV']['tmp_name'];
$fileType = $_FILES['inputFileIV']['type'];
$fileSize = $_FILES['inputFileIV']['size'];
$typeRep = $_POST['typeOfile'];

if (!$fileTmpLoc) {
    echo 'ERROR: Please browse for a file before clicking the upload data button';
    exit();
} else {
    switch((int)$typeRep) {

        case 1:

            if (move_uploaded_file($fileTmpLoc, 'data_crime/choropleth/lcl/'.$fileName)) {
                echo '$fileName upload is complete';
            } else {
                echo 'load failed';
            }
            break;
        case 2:

            if (move_uploaded_file($fileTmpLoc, 'data_crime/choropleth/upz/'.$fileName)) {
                echo '$fileName upload is complete';
            } else {
                echo 'load failed';
            }
            break;
        case 3:

            if (move_uploaded_file($fileTmpLoc, 'data_crime/choropleth/cat_zone/'.$fileName)) {
                echo '$fileName upload is complete';
            } else {
                echo 'load failed';
            }
    }
}
?>