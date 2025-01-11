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

function setFocusInputs(capabilities, settings, modeEl, distanceEl){
    modeEl.innerHTML = '';
    distanceEl.value = 0;
    modeEl.disabled = true;
    distanceEl.disabled = true;

    if('focusMode' in capabilities){
        modeEl.disabled = false;
        capabilities.focusMode.map((mode)=>{
            if(mode === settings.focusMode){
                modeEl.appendChild(new Option(mode, mode, true, true));
            }else{
                modeEl.appendChild(new Option(mode, mode, false, false));
            }
        })

        if('focusDistance' in capabilities){
            distanceEl.disabled = false;
            distanceEl.min = capabilities.focusDistance.min;
            distanceEl.max = capabilities.focusDistance.max;
        }
    }
}
