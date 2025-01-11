function stopStream(stream){
    if(stream){
        const tracks = stream.getTracks();
        tracks.forEach((track)=>{
            track.stop();
        })
    }
}

function videoDevices(devices){
    let deviceList = []
    devices.map(device=>{
        if(device.kind === "videoinput"){
            deviceList.push(device);
        }
    });

    return deviceList;
}

function getActiveTrack(stream){
    const tracks = stream.getVideoTracks();
    return tracks[0];
}

async function initCamera(){
    let camera;
    try {
        camera = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
    } catch (error) {
        throw new Error(error.message);
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    .finally(()=>{
        stopStream(camera);
    });
        
    return videoDevices(devices);
}

async function startStream(constraints){
    return await navigator.mediaDevices.getUserMedia(constraints);
}

function setDeviceInput(devices, settings, element){
    element.innerHTML = '';

    if(devices.length > 0){
        devices.map((device)=>{
            if(device.deviceId === settings.deviceId){
                element.appendChild(new Option(device.label, device.deviceId, true, true));
            }else{
                element.appendChild(new Option(device.label, device.deviceId, false, false));
            }
        })
    }else{
        element.appendChild(new Option('None', 'None'));
    }
}

function setResolutionInput(capabilities, settings, element){
    element.innerHTML = '';

    const maxWidth = capabilities.width.max;
    const maxHeight = capabilities.height.max;
    const constWidth = settings.width;
    const constHeight = settings.height;

    const resolutions = ["3840x2160","1920x1080","1280x720","640x480"];

    resolutions.map((res)=>{
        const width = parseInt(res.split('x')[0]);
        const height = parseInt(res.split('x')[1]);

        if(width <= maxWidth && height <= maxHeight){
            if(width === constWidth && height === constHeight){
                element.appendChild(new Option(res, res, true, true));
            }else{
                element.appendChild(new Option(res, res, false, false));
            }
        }
    })
    
}

function setFocusInputs(capabilities, settings, modeEl, distanceEl){
    modeEl.innerHTML = '';
    distanceEl.value = 0;
    modeEl.disabled = true;
    distanceEl.disabled = true;

    if('focusMode' in capabilities){

        capabilities.focusMode.map((mode)=>{
            if(mode === settings.focusMode){
                element.appendChild(new Option(mode, mode, true, true));
            }else{
                element.appendChild(new Option(mode, mode, false, false));
            }
        })

        if('focusDistance' in capabilities){
            modeEl.disabled = false;
        }
    }
}