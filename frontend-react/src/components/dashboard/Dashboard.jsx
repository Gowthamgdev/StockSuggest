import React, {use, useEffect} from 'react'
import axiosInstance from '../../axiosinstance';


const Dashboard = () => {
   useEffect(()=>{
    const fetchProtectedData = async () =>{
        try{
            const response = await axiosInstance.get('/protected-view/');
            console.log('sucess', response.data)
        }catch(error){
            console.error('Error fetching protected data:', error);
        }
    }
    fetchProtectedData();
   },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard