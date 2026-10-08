"use client";

import { useEffect, useState } from "react";

export default function DoctorsPage() {

 const [doctors, setDoctors] = useState([]);

 useEffect(() => {

  fetch("/api/doctors")

   .then((res) => res.json())

   .then((data) => setDoctors(data));

 }, []);

 return (

  <div>

   <h1>Doctors</h1>

   {doctors.map((doctor: any) => (

    <div key={doctor._id}>

      {doctor.name}

    </div>

   ))}

  </div>

 );

}