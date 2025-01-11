
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


async function setResolution(track, element){
    element.innerHTML = '';
    const list = ["3840x2160","1920x1080","1280x720","640x480"]
    const cWdith = track.getConstraints().width;
    const cHeight = track.getConstraints().height;

    for (const i of list){
        const rWidth = parseInt(i.split("x")[0]);
        const rHeight = parseInt(i.split("x")[1]);

        if(rWidth === cWdith && rHeight === cHeight){
            element.appendChild(new Option(i,i,false,true));
        }else{
            element.appendChild(new Option(i,i,false,false));
        }
        
    }
}

function setFocusMode(capabilities, track, element){
    element.innerHTML = '';

    if(!('focusMode' in capabilities)){
        console.log('focusMode not available');
        element.appendChild(new Option("None"))
        element.disabled = true;
    }else{
        capabilities.focusMode.map(i=>{
            if(i === track.getSettings().focusMode){
                element.appendChild(new Option(i,i,false,true));
            }else{
                element.appendChild(new Option(i,i,false,false));
            }
        })
    }
}

function setFocusDistance(capabilities, track, element){
    element.value = 0;
    
    if(!('focusDistance' in capabilities)){
        console.log('focusDistance not available');
        element.disabled = true;
    }else{
        element.value = track.getSettings().focusDistance;
        element.min = capabilities.focusDistance.min;
        element.max = capabilities.focusDistance.max;
        element.step = capabilities.focusDistance.step;
    }
}