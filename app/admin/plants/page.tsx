"use client"

import { useEffect,useState }

from "react";

export default function Plants(){

 const [plants,setPlants]=useState([]);

 useEffect(()=>{

 fetch("/api/plants")

 .then(res=>res.json())

 .then(data=>setPlants(data))

 },[])

 return(

  <div>

   {plants.map((plant:any)=>(

    <div key={plant._id}>

      {plant.name}

    </div>

   ))}

  </div>

 )

}