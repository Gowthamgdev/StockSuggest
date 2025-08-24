from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer, StockReturnsSerializer
from rest_framework.response import Response
from rest_framework import status
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score

# Create your views here.

class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']

            # Fetch stock data from Yahoo Finance
            now= datetime.now()
            start= datetime(now.year-10, now.month, now.day)
            end= now
            df= yf.download(ticker, start, end)
            
            if df.empty:
                return Response({"error": "No data found for the given ticker",
                                 'status': status.HTTP_404_NOT_FOUND})
            df= df.reset_index()
            # print(df)

            # Generate Basic Plot
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close, label='Close Price')
            plt.title(f'Closing price of {ticker}')
            plt.xlabel('Days') 
            plt.ylabel('Close price')
            plt.legend()
            # Save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            plot_image = save_plot(plot_img_path)
            
            # 100 Days Moving Average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close, label='Close Price')
            plt.plot(ma100, 'r', label='100 Days Moving Average')
            plt.title(f'100 Days Moving Average of {ticker}')
            plt.xlabel('Days') 
            plt.ylabel('Price')
            plt.legend()
            plot_img_path = f'{ticker}_100_dma.png'
            plot_100_dma = save_plot(plot_img_path)


             # 100 Days Moving Average
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close, label='Close Price')
            plt.plot(ma100, 'r', label='100 Days Moving Average')
            plt.plot(ma200, 'g', label='200 Days Moving Average')
            plt.title(f'200 Days Moving Average of {ticker}')
            plt.xlabel('Days') 
            plt.ylabel('Price')
            plt.legend()
            plot_img_path = f'{ticker}_200_dma.png'
            plot_200_dma = save_plot(plot_img_path)


            # splitting data into Training and Testing datasets
            data_training= pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7): int(len(df))])

            # scaling down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))

            #Load ML model
            model = load_model('stock_prediction_model.keras')

            # Preparing the test data
            past_100_days = data_training.tail(100)
            final_df= pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)

            x_test = []
            y_test = []
            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i,0])
            
            x_test, y_test =np.array(x_test), np.array(y_test)

            #Making predictions
            y_predicted=model.predict(x_test)


            # Revert the scaled prices to original prices
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()


            # Plotting the predictions
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(y_test,'b', label='Original Price')
            plt.plot(y_predicted, 'r', label='Predicted Price')
            plt.title(f'Prediaction by model of {ticker}')
            plt.xlabel('Days') 
            plt.ylabel('Price')
            plt.legend()
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_prediction = save_plot(plot_img_path)

            # Model Evaluation
            #Mean Squared error(MSE)
            mse = mean_squared_error(y_test, y_predicted)
            #Root Mean Squared Error(RMSE)
            rmse = np.sqrt(mse)
            #R-squared (R2) score
            r2= r2_score(y_test, y_predicted)

            # Sggestion
            def prepare_data(data, n_steps=100):
                X = []
                for i in range(n_steps, len(data)):
                    X.append(data[i-n_steps:i, 0])
                X = np.array(X)
                X = np.reshape(X, (X.shape[0], X.shape[1], 1))
                return X
            def generate_suggestions(df, model, n_steps=100):
                close_prices = df['Close'].values
                close_prices = close_prices.reshape(-1, 1)
                X_test = prepare_data(close_prices, n_steps)

                predicted_prices = model.predict(X_test)
                last_known_prices = close_prices[n_steps:]
                pct_changes = ((predicted_prices.flatten() - last_known_prices.flatten()) / last_known_prices.flatten()) * 100

                total_suggestion = np.mean(pct_changes)
                long_term_window = 60
                short_term_window = 20
                intraday_window = 1

                suggestions = {
                    'total_percentage': total_suggestion,
                    'long_term_percentage': np.mean(pct_changes[-long_term_window:]),
                    'short_term_percentage': np.mean(pct_changes[-short_term_window:]),
                    'intraday_percentage': pct_changes[-intraday_window]
                }
                return suggestions
            raw = generate_suggestions(df, model, n_steps=100)
            def format_suggestions1(raw):
                # Convert np.float64 -> float
                total = float(raw['total_percentage'])
                long_term = float(raw['long_term_percentage'])
                short_term = float(raw['short_term_percentage'])
                intraday = float(raw['intraday_percentage'])

                # 1) Make all values positive (absolute values)
                # total = abs(total)
                long_term = abs(long_term)
                short_term = abs(short_term)
                intraday = abs(intraday)
                total=(long_term+short_term+intraday)/3.0

                # 2) Apply your manipulations (subtract 10 from short_term, 20 from intraday)
                short_term = short_term - 40.19
                intraday = intraday - 77.57

                # 3) Optional: clamp to a minimum of 0 so you don't get negative after adjustments
                short_term = max(short_term, 0.0)
                intraday = max(intraday, 0.0)

                # 4) Format as percent strings
                return {
                    "total_percentage": f"{total:.2f}%",
                    "long_term_percentage": f"{long_term:.2f}%",
                    "short_term_percentage": f"{short_term:.2f}%",
                    "intraday_percentage": f"{intraday:.2f}%"
                }
            
            format_suggestions1(raw)

            symbol= ticker
            stock = yf.Ticker(symbol)
            data = stock.info

            price= data['currentPrice']
            marketcap=data['marketCap']
            stock_info = yf.Ticker(ticker).info
            stock_name = stock_info.get("longName", ticker)
            if marketcap:
                marketcap = round(marketcap / 1_000_000_000_000, 5)  # Trillions


            return Response({
                'status':'success',
                'plot_image': plot_image,
                'plot_100_dma': plot_100_dma,
                'plot_200_dma': plot_200_dma,
                'plot_prediction': plot_prediction,
                'mse': mse,
                'rmse': rmse,
                'r2': r2,
                'total_percentage': format_suggestions1(raw)['total_percentage'],
                'long_term_percentage': format_suggestions1(raw)['long_term_percentage'],
                'short_term_percentage': format_suggestions1(raw)['short_term_percentage'],
                'intraday_percentage': format_suggestions1(raw)['intraday_percentage'],
                'price':price,
                'marketcap':marketcap,
                'name': stock_name
                

                
                })


class StockReturnsAPIView(APIView):
    def post(self, request):
        serializer = StockReturnsSerializer(data=request.data)
        if serializer.is_valid():
            ticker1 = serializer.validated_data['ticker1']
            year = serializer.validated_data['year']

            end_date = datetime.today()
            start_date = end_date - timedelta(days=year*365)

            # Download stock data (auto_adjust=True is default now, so no warning)
            data = yf.download(ticker1, start=start_date, end=end_date, auto_adjust=True)

            if data.empty:
                return Response({"error": f"No data found for the given ticker {ticker1} in last {year} years",
                                 'status': status.HTTP_404_NOT_FOUND})

            start_price = data['Close'].iloc[0].item()
            end_price = data['Close'].iloc[-1].item()

            percentage_return = ((end_price - start_price) / start_price) * 100.

            data['Daily Return'] = data['Close'].pct_change()
            volatility = data['Daily Return'].std() * np.sqrt(252) * 100 

            #plot
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,6))

            # Stock price trend
            plt.subplot(2,1,1)
            plt.plot(data['Close'], label=f"{ticker1} Price")
            plt.title(f"{ticker1} Stock Price over {year} Year(s)")
            plt.xlabel("Date")
            plt.ylabel("Price")
            plt.legend()
            
            # Daily returns histogram
            plt.subplot(2,1,2)
            plt.hist(data['Daily Return'].dropna(), bins=50, alpha=0.7)
            plt.title(f"{ticker1} Daily Returns Distribution")
            plt.xlabel("Daily Return")
            plt.ylabel("Frequency")
            
            plt.tight_layout()
            plot_img_path = f'{ticker1}_returnsof{year}.png'
            plot_returns_year = save_plot(plot_img_path)
            return Response({
                'returns': f"{percentage_return:.2f}%",
                'risk':f"{volatility:.2f}",
                'plot_return':plot_returns_year
            })
        return Response(serializer.errors, status=400)

