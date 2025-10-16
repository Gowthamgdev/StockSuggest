import React, { useState } from 'react'
import axiosInstance from '../../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

const Dashboard1 = () => {
    const [ticker1, setTicker1]= useState('')
    const [year, setYear]= useState('')
    const [loading, setLoading]= useState();
    const [error, setError] = useState('');
    const [returns, setReturns]= useState('');
    const [risk, setRisk]= useState('');
    const [plotreturn, setPlotreturn]=useState('');
    const [summary, setSummary]=useState('');



    useEffect(()=>{
    const fetchProtectedData = async () =>{
        try{
            const response = await axiosInstance.get('/protected-view/');
        }catch(error){
            console.error('Error fetching protected data:', error);
        }
    }
    fetchProtectedData();
   },[])


   const handleSubmit= async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
        const response= await axiosInstance.post('/returns/',{
            ticker1:ticker1,
            year:year
            });

        const backendRoot = import.meta.env.VITE_BACKEND_ROOT
        const plotreturnUrl = `${backendRoot}${response.data.plot_return}` 

        console.log(response.data);
        setReturns(response.data.returns)
        setRisk(response.data.risk)
        setSummary(response.data.summary)
        setPlotreturn(plotreturnUrl)
        console.log(returns)
        setError('')
        if(response.data.error){
            setError(response.data.error)
            //console.log('there is a error here gowtham')
            setReturns('');
            setSummary('');
        }

    } catch (error) {
        console.error('There was an error with the prediction request:', error)
        
    }finally{
        setLoading(false);
    }
   }

  return (
    <div className="container">
        <div className="row">
            <div className="card text-center bg-dark text-light shadow-lg rounded-3 p-3">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input 
                            type="text" className="form-control" placeholder="Enter Stock Ticker (e.g., INFY.NS, AAPL)" value={ticker1} onChange={(e) => setTicker1(e.target.value)} required
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                            type="number" className="form-control" placeholder="Enter Number of Years (e.g., 5)" value={year}min="1"onChange={(e) => setYear(e.target.value)} required
                            />
                        </div>
                        <small>{error && <div className='text-danger'>{error}</div> }</small>
                        <button type="submit" className="btn btn-info d-block btn-sm mx-auto mt-3 w-50 fw-bold">
                            {loading ? (
                            <span>
                                <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                            </span>
                            ) : (
                            "Returns"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            {returns &&(
                <>
                    <div className="card text-center bg-dark text-light shadow-lg rounded-3 p-4">
                        <h2 className="mb-3 text-xl font-semibold">
                            Stock Analysis - {ticker1} of {year} year
                        </h2>
                        <p className="mb-1">
                            <strong>Returns:</strong> {returns}
                        </p>
                        <p>
                            <strong>Volatility:</strong> {risk}
                        </p>
                        <div className="p-3">
                        {plotreturn && (
                        <img src={plotreturn} style={{ maxWidth:'100%'}}/>
                        )}
                        </div>
                        <div className="card text-center bg-dark text-light shadow-lg rounded-3 p-4">
                            <h5 className="mb-3">AI Stock Insights</h5>
                            {summary &&  (<div
                                className="card text-center bg-dark text-light shadow-lg rounded-3 p-4"
                                dangerouslySetInnerHTML={{ __html: summary }}
                                />)}
                        </div>

                    </div>
                    
                </>
            )}

        </div>
    </div>//container1
  )
}

export default Dashboard1