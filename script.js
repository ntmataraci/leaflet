
let map
navigator.geolocation.getCurrentPosition(success)

function success(pos){
  
let latitude=pos.coords.latitude
let longitude=pos.coords.longitude


map = L.map('mapid').setView([latitude, longitude], 35);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([latitude,longitude]).addTo(map)
    .bindPopup("You're here")
    .openPopup();



gettingsMap()

    function gettingsMap(){   
    if (localStorage.getItem("leaflet")){
        let data=JSON.parse(localStorage.getItem("leaflet"))
        console.log(data)
        data.forEach(element => {
            L.marker([element.lat,element.lng]).addTo(map)
            .bindPopup(element.name)
            // document.querySelector(".leaflet-popup-content-wrapper").innerHTML="<button>DELETE</button>"
        });
    }
}

 



   map.on("click",addPlace)


/* adding */

function addPlace(e){
    let reference=prompt("please add name")
    let comment=prompt("please add comment")
    if (reference){
    L.marker([e.latlng.lat,e.latlng.lng]).addTo(map)
    .bindPopup(popupContent(e.latlng.lat,e.latlng.lng,reference,comment))
    .openPopup();
    }

    }
    


function popupContent(x,y,reference,comment) {
   
  
    if (localStorage.getItem("leaflet")){
    let oldData=localStorage.getItem("leaflet")
    oldData=oldData.replace("]","")
    oldData+=`,{"name":"${reference}","lat":${x},"lng":${y},"comment":"${comment}"}]`
    localStorage.setItem("leaflet",`${oldData}`)
    }else{
        localStorage.setItem("leaflet",`[{"name":"${reference}","lat":${x},"lng":${y},"comment":"${comment}"}]`)
    }
    addings(reference,x,y,comment)
    selectedRow()
    return reference
}
/* adding end */


}

newLand()

function newLand(){
let data=JSON.parse(localStorage.getItem("leaflet"))
if (data){
data.forEach(x=>{
    let name=x.name
    let lat=x.lat
    let lng=x.lng
    let cmnt=x.comment
   addings(name,lat,lng,cmnt)
})
}
}

function addings(name,lat,lng,comment){
    document.querySelector(".getData").innerHTML+=`<div class="row"><div class="content">Name:<i> ${name} </i>Adress: <i> ${lat+" "+lng}</i> Comment: <i> "${comment}"  </i>   </div><button class="delete"> DELETE </button><div><br>` 
}


document.querySelector(".getData").addEventListener("click",deletings)


function deletings(){
if (document.querySelector(".delete")){
let deleteVal=document.querySelectorAll(".delete")
deleteVal.forEach((x,idx)=>{
    x.addEventListener("click",(e)=>{
      e.target.parentElement.innerHTML=""
let selectedData=JSON.parse(localStorage.getItem("leaflet"))
selectedData.splice(idx,1)
if (!selectedData.length==0){
    localStorage.setItem("leaflet",JSON.stringify(selectedData))
}else{
    localStorage.removeItem("leaflet")
}
location.reload();
    })
})
}
}

selectedRow()
function selectedRow(){
let selectRow=document.querySelectorAll(".row")
selectRow.forEach((x,idx)=>{
    x.addEventListener("mouseenter",(e)=>{
      let autoZoomLat= JSON.parse(localStorage.getItem("leaflet"))[idx].lat
      let autoZoomLng=JSON.parse(localStorage.getItem("leaflet"))[idx].lng
      map.panTo(new L.LatLng(autoZoomLat,autoZoomLng))
      e.target.addEventListener("click",()=>{
        L.marker([autoZoomLat,autoZoomLng]).addTo(map)
        .bindPopup(JSON.parse(localStorage.getItem("leaflet"))[idx].name)
        .openPopup();
    
      })

        })
    })
}
