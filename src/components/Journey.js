import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Button } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import DropDown from './Dropdown'
import { Title } from './PageTitle';
import 'react-day-picker/lib/style.css';

const Journey =()=>{
    const history=useHistory()
    const {UpdateTitle} =useContext(Title)
    const[state,setState]=useState({
        cities:[],
        source:'',
        destination:'',
        date:''
    })

    useEffect(()=>{
        UpdateTitle("Plan Journey")
        if(localStorage.getItem("user") === null){
            history.push("/") 
        }
    },[])

    useEffect(()=>{
        async function fetchData() {
            await fetch(`http://localhost:5000/states`,{
            method: 'GET',
            })
            .then(response =>response.json())
            .then(data=>setState({...state,cities:data}))
          }
          fetchData();
    },[])

    const selectDate=(day)=>{
        const date=moment(day).format('YYYY-MM-DD')
        setState({...state,date:date})
    }

    const CreateReservation=async(e)=>{
        if(state.source === ''){
            toast.error("Source city can't be null")
        }
        else if(state.destination === ''){
            toast.error("Destination city can't be null")
        }
        else if(state.date === ''){
            toast.error("Select date of journey")
        }
        else if(state.destination === state.source){
            toast.error("Source and Destination can't be same")
        }
        else{
            await fetch('http://localhost:5000/reservation',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                "source": state.source,
                "destination": state.destination,
                "date":state.date,
                "user":localStorage.getItem("user")
            })
        }).then(res=>{
            if(res.statusText==="Created" && res.status===201){
                setState({...state,source:'',destination:'',date:''})
                history.push("/dashboard")
            }
            else{
                toast.error("error occure")
            }
        })
        }
    }

    return(<>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false} 
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
        />
        <div className="select-div">
            
        <DropDown 
            cities={state.cities} 
            placeholder="select source city" 
            value={state.source}
            getSource={(e)=> setState({...state,source:e.target.textContent})}
        />
        <DropDown 
            cities={state.cities} 
            placeholder="select destination city"
            value={state.destination} 
            getSource={(e)=> setState({...state,destination:e.target.textContent})}
        />  
        </div> 
        <div className="day-picker-div">
        <DayPickerInput 
            className="pickers"
            value={state.date}
            onDayChange={(day)=>selectDate(day)}
        />
        <div className="reserv-btn">
        <Button primary onClick={(e)=>CreateReservation(e)}>Reserv</Button>
        </div>
        </div>
    </>)
}

export default Journey