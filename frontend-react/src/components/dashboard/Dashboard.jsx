import React, {use, useEffect, useState} from 'react'
import axiosInstance from '../../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const [ticker, setTicker] = useState('');
  const [error, setError]=useState('');
  const [loading, setLoading] = useState(false);
  const [plot, setPlot] = useState('');
  const [ma100, setMa100] = useState('');
  const [ma200, setMa200] = useState('');
  const [prediction, setPrediction] = useState('');
  const [mse, setMse] = useState('');
  const [rmse, setRmse] = useState('');
  const [r2, setR2] = useState('');
  const [total_percentage, setTotalPercentage] = useState('');
  const [longTerm, setLongTerm] = useState('');
  const [shortTerm, setShortTerm] = useState('');
  const [intraday, setIntraday] = useState('');
  const [price, setPrice] = useState('');
  const [mkrcap, setMkrcap] = useState('');
  const [name, setName] = useState('');
  
  

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

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)
      try{
        const response = await axiosInstance.post('/predict/', {
          ticker: ticker
        });
        //console.log(response.data);
        const backendRoot = import.meta.env.VITE_BACKEND_ROOT
        const plotUrl = `${backendRoot}${response.data.plot_image}`;
        const ma100Url = `${backendRoot}${response.data.plot_100_dma}`;
        const ma200Url = `${backendRoot}${response.data.plot_200_dma}`;
        const predictionUrl = `${backendRoot}${response.data.plot_prediction}`;

        setPlot(plotUrl);
        setMa100(ma100Url);
        setMa200(ma200Url);
        setPrediction(predictionUrl);
        setMse(response.data.mse);
        setRmse(response.data.rmse);
        setR2(response.data.r2);
        setTotalPercentage(response.data.total_percentage);
        setLongTerm(response.data.long_term_percentage);
        setShortTerm(response.data.short_term_percentage);
        setIntraday(response.data.intraday_percentage);
        setPrice(response.data.price);
        setMkrcap(response.data.marketcap);
        setName(response.data.name);
        setError('')// Clear any previous errors
        //set plots
        if(response.data.error){
          setError(response.data.error)
          setPrediction('');
        }

      }catch(error){
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
            <input type="text" className='form-control' placeholder='Enter Stock Ticker'
            onChange={(e) => setTicker(e.target.value)} required/>
            <small>{error && <div className='text-danger'>{error}</div> }</small>
            <button type='submit' className='btn btn-info mt-3 d-block  mx-auto'>
              {loading ? <span><FontAwesomeIcon icon={faSpinner} spin/>Please wait...</span>:' Predict'}
            </button>
          </form>
        </div>
        </div>
        {/* Print prediction plots */}
        {prediction && (
          
        
          <div className="prediction mt-5">
            <div className="container">
              <div className="card shadow-lg border-0 rounded-3">
                <div className="card text-center bg-dark text-light shadow-lg rounded-3 p-3">
                  <div className="card-body">
                    <h2 className="card-title fw-bold mb-3">{name}</h2>
                    <p className="fs-5">💰 Current Price: <strong>₹{price}</strong></p>
                    <p className="fs-5">🏢 Market Cap: <strong>{mkrcap} T</strong></p>
                  </div>
                </div>
              </div>
            </div>
          <div className="p-3">
            {plot && (
              <img src={plot} style={{ maxWidth:'100%'}}/>
            )}
          </div>
          <div className="p-3">
            {ma100 && (
              <img src={ma100} style={{ maxWidth:'100%'}}/>
            )}
          </div>
          <div className="p-3">
            {ma200 && (
              <img src={ma200} style={{ maxWidth:'100%'}}/>
            )}
          </div>
          <div className="p-3">
            {prediction && (
              <img src={prediction} style={{ maxWidth:'100%'}}/>
            )}
          </div>

          
          // Suggestion
          <div className="container my-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5 bg-dark text-light text-center">
                <h3 className="mb-4">📊 Stock Suggestions</h3>
                <p className="text-muted mb-5">This is on my Model based recommendations for different trading styles</p>

                <div className="row justify-content-center">
                  <div className="col-md-4 col-sm-6 mb-4">
                    <div className="p-4 bg-success text-light rounded-3 h-100 shadow-sm">
                      <h5 className="fw-bold">Long Term</h5>
                      <p className="display-6 fw-bold mb-0">{longTerm}</p>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6 mb-4">
                    <div className="p-4 bg-warning text-dark rounded-3 h-100 shadow-sm">
                      <h5 className="fw-bold">Short Term</h5>
                      <p className="display-6 fw-bold mb-0">{shortTerm}</p>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6 mb-4">
                    <div className="p-4 bg-info text-dark rounded-3 h-100 shadow-sm">
                      <h5 className="fw-bold">Intraday</h5>
                      <p className="display-6 fw-bold mb-0">{intraday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


            
            <div class="dropdown text-end">
              <button className="btn bg-light-dark dropdown-toggle mt-3 " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                <h6 className="text-light lead">Model Evaluation</h6>
              </button>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                <li><a class="dropdown-item ">Mean Squared Error (MSE):{mse}</a></li>
                <li><a class="dropdown-item" >Root Mean Squared Error(RMSE):{rmse}</a></li>
                <li><a class="dropdown-item" >R-Squared: {r2}</a></li>
                <li><hr class="dropdown-divider"></hr></li>
                <li><a class="dropdown-item" href="#">Go Up</a></li>
              </ul>
            </div>
          </div>
            
        

        )}
        
      </div>
    </div>
  )
}

export default Dashboard