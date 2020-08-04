/**
 * This javascript file contains the list of functions responsible for reading files and directories. 
 * There are other functions that are related to the dynamic construction of html elements that support file handling.
 * 
 * @author Jorge Victorino - Miguel Barrero
 * @version 1.0
 * @copyright
 * 
 * History:
 * v1.0 first version to manipulate files and directories in the aplicaction.
 */

// forms variables
var loadFiles = false;
var fileData;
var formData;
var stateParseData;

// xhr variables to read files and directories under an xmlhttprequest request
var xhrDataForm, xhrDataRead, xhrFilesInDirectory;

// variables that select from the DOM the state of the loading bar for the file loading function
const progressBarFill = document.querySelector('#progressBar > .progress-bar');
const progressBarText = progressBarFill.querySelector('.progress-bar-text');

/**
 * Function to get elements of the DOM by id
 * @param {string} e id of html element
 * @return {HTMLElement} 
 */
function _(e) {

    return document.getElementById(e); 
}

/**
 * Function that handles the progress status of file uploads through the tool's geojson file upload form.
 * @param {XMLHttpRequest} e XMLHttpRequest object for file upload.
 */
async function progressHandler(e) {

    _('status').textContent = 'Uploading...please wait';
    _('uploadDataButton').disabled = true;
    _('closeUploadDataButton').disabled = true;
    _('closeButtonModal').disabled = true;

    await sleep(1000);

    let percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;
    progressBarFill.style.width = percent.toFixed(2) + '%';
    progressBarText.textContent = percent.toFixed(2) + '%';
    
}

/**
 * Function that handles the completion status of file uploads through the tool's geojson file upload form. 
 * Triggers changes on the interface once the process is finished.
 * @param {XMLHttpRequest} e XMLHttpRequest object for file upload.
 */
async function completeHandler(e) {
    await sleep(2000); 
    _('inputFileIV').value = '';  
    _('uploadDataButton').disabled = false;
    _('closeUploadDataButton').disabled = false;
    _('closeButtonModal').disabled = false;
    _('status').textContent = 'Upload complete';
    
    await sleep(1000);
    _('labelInputFileIV').innerText = 'Choose file';
    progressBarFill.style.width =   '0%';
    progressBarText.textContent =   '0%';
    _('status').textContent = '';
}

/**
 * Function that handles the state in the event that an error occurs when loading the files.
 * @param {XMLHttpRequest} e XMLHttpRequest object for file upload.
 */
function errorHandler(e) {

    _('status').textContent = 'Upload failed';
}

/**
 * Function that handles the state in case the operation of loading files through the form is canceled.
 * @param {XMLHttpRequest} e XMLHttpRequest object for file upload.
 */
function abortHandler(e) {
    
    _('status').textContent = 'Upload aborted';
}

/**
 * Function that handles the loading of geojson files and stores the file on the server. 
 * Allowed file types are json and geojson extension. For the first version, only the loading of files for choropleth maps is contemplated.
 */
function loadGEOFiles () {

    // validating file upload support for the browser used
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        
        loadFiles = true;
    } else {
        
        var loadFiles = false;
        alert('The File APIs are not fully supported in this browser.');
    }

    if (loadFiles) {

        // validating that only one file is loaded
        if (_('inputFileIV').files.length == 1) {
            
            fileData = _('inputFileIV').files[0];
            // validating the file extension
            if (fileData.type === 'application/json' || fileData.type === 'application/geo+json') {
                
                let statusValidate = validateGEOJSON(fileData).catch(err => console.log('check errors: ' + err));
                statusValidate.then(function (value) {
                    if (value) {

                        let typeOfile = _('typeOfFile').value;
                        // 1 choropleths by localities , 2  choropleths by upz, 3  choropleths by catastral zones
                        if(typeOfile != "" && (typeOfile == CHOROPLETH_FILE_LCL || typeOfile == CHOROPLETH_FILE_UPZ || typeOfile == CHOROPLETH_FILE_ZC)){                        
                            
                            formData = new FormData();
                            formData.append('inputFileIV', fileData);
                            formData.append('typeOfile',typeOfile);
                            xhrDataForm = new XMLHttpRequest();
                            xhrDataForm.upload.addEventListener('progress', progressHandler, false);
    
                            xhrDataForm.addEventListener('load', completeHandler, false);
                            xhrDataForm.addEventListener('error', errorHandler, false);
                            xhrDataForm.addEventListener('abort', abortHandler, false);
                            
                            xhrDataForm.open('POST', SERVER_RESOURCE_PATH);
                            xhrDataForm.send(formData);

                        } else {
                            createAlertElement('No select type of file');
                        }                    
                    } else {
                        createAlertElement('Fail to parse geojson or json file');
                    }
                });
            } else {
                createAlertElement('This file is not a geojson or json file');
            }
        } else {

            createAlertElement('You have not selected a file');
        }
    }
}

/**
 * Function for reading files in json or geojson formats. 
 * The function gets the content of the file that is in the specified url and converts it into a json object,
 * that can be manipulated in the application life cycle
 * @param {string} url path where the file is located
 * @return it resolves as true or rejects as false depending on whether the file can be obtained in the indicated directory
 */
function readGeoFiles (url) {

    
    return new Promise(function(resolve, reject) {

        xhrDataRead = new XMLHttpRequest();


        xhrDataRead.overrideMimeType('application/json');
        xhrDataRead.open("GET", url, true);
        xhrDataRead.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
        xhrDataRead.setRequestHeader('cache-control', 'max-age=0');
        xhrDataRead.setRequestHeader('expires', '0');
        xhrDataRead.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
        xhrDataRead.setRequestHeader('pragma', 'no-cache');

        xhrDataRead.onload = function(content) {

            if (xhrDataRead.readyState == 4 && xhrDataRead.status == 200) {

                var data = JSON.parse(xhrDataRead.responseText);
                console.log(data);
                console.log('success reading -> json file');
                resolve(data);

            } else {

                console.log('failed reading -> text file');
                return reject(xhrDataRead.status);
            }

        }
        xhrDataRead.send();
    });

}

/**
 * Function that allows listing the content of a specified directory.
 * If the directory is found, it returns the list of the files or folders it contains
 * @param {string} directory directory name
 * @return resolves as true or rejects as false depending on whether you can obtain the list of elements of the indicated directory
 */
function listDirectoryFiles (directory)  {
    console.log(directory);
    return new Promise(function(resolve, reject) {

        var serverData = new FormData();
        serverData.append('directory', directory);
        xhrFilesInDirectory = new XMLHttpRequest();
        xhrFilesInDirectory.open('POST', SERVER_FILE_PATH, true);

        xhrFilesInDirectory.onload = function(content) {

            if (xhrFilesInDirectory.readyState == 4 && xhrFilesInDirectory.status == 200) {

                var data = JSON.parse(xhrFilesInDirectory.responseText);
                var finalData = listOfFiles(data);
                
                console.log('success reading -> directory');
                resolve(finalData);

            } else {

                console.log('failed reading -> directory');
                return reject(xhrFilesInDirectory.status);
            }

        }
        xhrFilesInDirectory.send(serverData);
    }); 
}

/**
 * Function that validates the structure for json files.
 * @param {*} f file
 * @return Resolve as true or reject as false depending on the result of parsing the file content to json format.
 */
function validateGEOJSON (f) {
    
    return new Promise (function (resolve, reject){
        stateParseData = false;
        var reader = new FileReader();
        var dataFile;
        
        reader.readAsText(f, 'UTF-8');
        reader.onload = function (e) {
            
            dataFile = e.target.result;
            
            // validating that the file has already been read completely
            if (reader.readyState == 2) {

                dataFile = dataFile.toString();
                
                try {

                    JSON.parse(dataFile);
                    console.log('success parse file');
                    resolve(true);

                } catch (error) {

                    console.log('error on parse file');
                    reject(false);
                }           
            }
        }
    });
}
/**
 * Function that allows the creation of alerts on the file upload form in the event of any unexpected or procedural error by the user or the system.
 * @param {string} message text for the alert message
 */
function createAlertElement(message) {

    let alertExists = _('alertFormLoadData');
    if (alertExists === undefined || alertExists == null) {

        let alertElement = document.createElement('div');
        alertElement.setAttribute('class', 'alert alert-warning alert-dismissible fade show');
        alertElement.setAttribute('role', 'alert');
        alertElement.setAttribute('id', 'alertFormLoadData');
        alertElement.innerHTML = '<strong>Alert! </strong>' + message;
        
        let closeButton = document.createElement('button');
        closeButton.setAttribute('type', 'button');
        closeButton.setAttribute('class', 'close');
        closeButton.setAttribute('data-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
        alertElement.appendChild(closeButton);
        
        let divElement = document.getElementById('modalLoadData');
        divElement.insertBefore(alertElement, divElement.childNodes[0]); 
    }

}

/**
 * Function that filters the contents of a directory by json or geojson file format.
 * @param {Array} data list of items from reading a directory
 * @return list of files that are of json or geojson format
 */
function listOfFiles (data) {
    
    var listOfFiles = {};
    for (var i = 0; i < data.length; i++) {
        
        if (data[i].endsWith('.geojson') || data[i].endsWith('.json')) {
            listOfFiles[i] = data[i];
        }
    }
    return listOfFiles;
}

/**
 * Function that cleans the form of unnecessary alerts during the file upload process.
 */
function clearAlertOnChange () {

    let alertExists = _('alertFormLoadData');
    if (alertExists != undefined || alertExists != null) {
        alertExists.remove();
    }
}

/**
 * Function that generates a timeout for some asynchronous operations within the life cycle of the application.
 * @param {int} ms milliseconds
 * @return resolves as true or rejects as false for a configured timeout
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Function that gets the name of a certain file without its extension
 * @param {string} name original file name
 * @return file name whithout extension
 */
function getIdOfLayerByNameOfFile (name) {

    let lnName = name.length;
    let id = name.toLowerCase();
    
    if (id.endsWith('.geojson')) {
        
        id  = id.substring(0, lnName - 8);
    } else if (id.endsWith('.json')) {

        id = id.substring(0, lnName - 5);
    }
    return id;
}

/**
 * Function that changes the presentation of the file name in the html element that contains it
 */
$('#inputFileIV').on('change',function(){
    
    var fileName = $(this)[0].files[0].name;  
    $(this).next('.custom-file-label').html(fileName);
});
