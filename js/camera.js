
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



