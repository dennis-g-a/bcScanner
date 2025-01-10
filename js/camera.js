
function endStream(stream){
    if(stream){
        const tracks = stream.getTracks();
        tracks.forEach((track)=>{
            track.stop();
        })
    }
}

function requestCamera(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream=>{
        endStream(stream);
    })
    .catch(err=>{
        throw new Error(err.message);
    })
}

async function getDevices(){
    const devices = await navigator.mediaDevices.enumerateDevices();

    let deviceList = []
    devices.map(device=>{
        if(device.kind === "videoinput"){
            deviceList.push(device);
        }
    });

    return deviceList;
}

async function getStream(constraint = null){
    const constraints = constraint ? constraint : {video: true, audio: false}
    return await navigator.mediaDevices.getUserMedia(constraints);
}

function getStreamCapabilities(stream){
    const tracks = stream.getTracks()
    return tracks[0].getCapabilities();
}


function setResolution(capabilities, track, element){
    element.innerHTML = '';
    
    for (const i of [1.0, 0.75, 0.50]){
        const streamWidth = capabilities.width.max;
        const aspectRatio =  track.getSettings().aspectRatio;

        const label = `${Math.floor(streamWidth * i)}X${Math.floor((streamWidth * i) / aspectRatio)}`;

        element.appendChild(new Option(label,label));
    }
}

function setFocusMode(capabilities, element){
    element.innerHTML = '';

    if(!('focusMode' in capabilities)){
        console.log('focusMode not available');
        element.appendChild(new Option("None"))
        element.disabled = true;
    }else{
        capabilities.focusMode.map(i=>{
            element.appendChild(new Option(i,i));
        })
    }
}

function setFocusDistance(capabilities, track, element){
    element.innerHTML = '';
    
    if(!('focusDistance' in capabilities)){
        console.log('focusDistance not available');
        element.disabled = true;
    }else{
        element.min = capabilities.focusDistance.min;
        element.max = capabilities.focusDistance.max;
        element.step = capabilities.focusDistance.step;
        element.value = track.getSettings().focusDistance;
    }
}