(async()=>{

const camera = document.querySelector("#camera");
const resolution = document.querySelector("#resolution");
const mode = document.querySelector("#mode");
const focus = document.querySelector("#focus");
const video = document.querySelector("video");

requestCamera();

const devices = await getDevices();
devices.map(device=>{
    camera.appendChild(new Option(device.label, device.deviceId));
})

let stream = await getStream({
    video: {
        width: 640,
        height: 480,
    }
});
let track = stream.getVideoTracks()[0];
let capabilities = getStreamCapabilities(stream);

video.srcObject = stream;

setResolution(track, resolution);
setFocusMode(capabilities, track, mode);
setFocusDistance(capabilities, focus);


camera.addEventListener("change", async (ev)=>{
    
    endStream(stream);
    navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: ev.target.value,
            width: 640,
            height: 480,
        }, 
        audio: false
    })
    .then(async newStream=>{
        video.srcObject = newStream;

        track = newStream.getVideoTracks()[0];
        capabilities = getStreamCapabilities(newStream);
        
        await setResolution(track, resolution);
        setFocusMode(capabilities, track, mode);
        setFocusDistance(capabilities, focus);
        stream = newStream;
    })
});
    
mode.addEventListener("change", async (ev)=>{
    const dist = document.querySelector("#focus");
    if(ev.target.value === 'manual'){
        dist.value = 0;
        dist.disabled = false;
    }else{
        dist.disabled = true;
    }

    await track.applyConstraints({
        focusMode: ev.target.value,
        focusDistance: 0,
    });
})

resolution.addEventListener("change", async (ev)=>{
    const rWidth = parseInt(ev.target.value.split("x")[0]);
    const rHeight = parseInt(ev.target.value.split("x")[1]);

    await track.applyConstraints({
            width: rWidth,
            height: rHeight,
        });
})

focus.addEventListener("change", async (ev)=>{
    await track.applyConstraints({
        focusDistance: ev.target.value
    })
})

})()