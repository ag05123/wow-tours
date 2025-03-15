

export const displayMap=(locations)=>{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWcwNTEyIiwiYSI6ImNtODRqNnZ0cjF5aHQybG9raHhmeGVtazcifQ.vm41g4NwHn7t4IOAdFl9og';
    var map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      scrollZoom : false
     
    });
    
    
    const bounds =new mapboxgl.LngLatBounds();
    
    locations.forEach( loc =>{
        const el =document.createElement('div');
        el.className='marker';
    
        new mapboxgl.Marker({
            element : el,
            anchor : 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
         
         new mapboxgl.Popup({
            offset :30
         }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description} <p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    
    map.fitBounds(bounds ,{
        padding :{
            top:200,
            bottom : 150,
            left : 100,
            right : 100
        }
    
    });
    
    
}
