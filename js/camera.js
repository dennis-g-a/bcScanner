const supported = navigator.mediaDevices.getSupportedConstraints();


async function requestCamera(constraints = null){
    const Constraints = constraints ? constraints : {video: true, audio: false}
    return await navigator.mediaDevices.getUserMedia(Constraints);
}


function endStream(stream){
    if(stream){
        const tracks = stream.getTracks();
        tracks.forEach((track)=>{
            track.stop();
        })
    }
}


async function getVideoInputs(){
    let vidList = [];
    const stream = await requestCamera();
    const devices = await navigator.mediaDevices.enumerateDevices();

    if(devices){
        devices.map((device)=>{
            if(device.kind === "videoinput"){
                let obj = {
                    device: device,
                    capabilities: device.getCapabilities()
                }
                vidList.push(obj);
            }
        });
    }else{
        throw new Error(err.message);
    }
    
    endStream(stream);
    return vidList;
}



