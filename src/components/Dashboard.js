import React,{useContext, useEffect, useState} from 'react'
import { useHistory, Link } from "react-router-dom";
import { Table, Input,Pagination,Button, Form,Container} from 'semantic-ui-react'
import { useForm } from "react-hook-form";
import { Title } from './PageTitle';
import {Icon} from 'semantic-ui-react'
import { toast, ToastContainer } from 'react-toastify';

const Dashboard =()=>{
    const history=useHistory()
    const {UpdateTitle} =useContext(Title)
    const {handleSubmit,register,formState: { errors }} = useForm();
    const [reservation,setReservation]=useState({
        reserv:[],
        search:[],
        loading:false,
        totalPage:0,
        activePage:1,
        pagedata:[],
        station:false
    })
    useEffect(()=>{
        UpdateTitle('Dashboard')
    },[])

    useEffect(()=>{
        fetchReservation();
    },[])

    useEffect(()=>{
        if(reservation.reserv.length > 0){
            getPaginationGroup()
        }
    },[reservation.activePage, reservation.reserv])

    const fetchReservation=async()=>{
        await fetch(`http://localhost:5000/reservation`,{
        method: 'GET',
        })
        .then(response =>response.json())
        .then(data=>{
            if(localStorage.getItem("user")){
                const result=data.filter(data=>
                {
                    return data.user===localStorage.getItem("user")
                })
                SortedDate(result)
            }
            else{
                SortedDate(data)
            }
            
        })
      }

    const SortedDate=(data)=>{
        let sortDate=data.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
          });
        setReservation({...reservation, 
                    reserv:sortDate, 
                    search:sortDate,
                    totalPage:sortDate.length/6})
    }

    const DeleteReservation=async (index)=>{
        await fetch(`http://localhost:5000/reservation/${index}`,{
            method: 'DELETE',
        })
        .then(response=>{
            if(response.ok===false){
                toast.error(response.statusText)
            }
            else{
                fetchReservation()
                toast.success("Deleted Successfully")
            }
        })
    }

    const searchSource=(event)=>{
        event.preventDefault();
        setReservation({...reservation,loading:true})
		const list=reservation.search.filter(
            (e)=>e.source.toLowerCase().includes(event.target.value.toLowerCase()))
        setReservation({...reservation,pagedata:list,loading:false})
    }

    const getPaginationGroup = () => {
        const data=[]
        let start =reservation.activePage * 5 - 5;
        const endIndex = start + 5;
        for(var i=start;i<=endIndex;i++){
            if(reservation.search[i] !== undefined){
                data.push(reservation.search[i])
            }
        }
        setReservation({...reservation,pagedata:data})
      };

    const getPage=(e)=>{
        setReservation({...reservation,activePage:e.target.innerText})
    }

    const onSubmit= async (body)=>{
        await fetch('http://localhost:5000/states',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    "key":body.stationName,
                    "value": body.stationName,
                    "flag": body.stationName,
                    "text": body.stationName
                })
            })
            .then(res=>{
                if(res.status===201){
                    toast.success("Station Addedd Successfully")
                    setReservation({...reservation,stationName:''})
                }
                if(res.status===500){
                    toast.error(res.statusText)
                }
            })
    }

    const goBack=()=>{
        setReservation({...reservation,station:false,stationName:''})
        history.push("/dashboard")
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
    <div>
        <div className={localStorage.getItem("user") ? "tables" : "table-admin"}>
        <div className={localStorage.getItem("user") ? "search-div" : "search-admin"}>
        {
            localStorage.getItem("admin") && !reservation.station &&
            <Button 
                color='purple' 
                className="admin-btn"
                onClick={()=>setReservation({...reservation, station:true})}
            >
            Add Station
            </Button>
        }
        {!reservation.station &&
        <Input 
            className={localStorage.getItem("user") ? "search" :"admin-search"}
            loading={reservation.loading}
            icon='search' 
            iconPosition='left' 
            placeholder='Search...'
            onChange={(e)=>searchSource(e)}
        />
        }
        </div>
        {
        !reservation.station ?

        <Table color="violet">
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='4' className="table-heading">My Journy</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className="table-head">Source</Table.HeaderCell>
                <Table.HeaderCell className="table-head">Destination</Table.HeaderCell>
                <Table.HeaderCell className="table-head">Date</Table.HeaderCell>
                <Table.HeaderCell className="table-head">Action</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {reservation.pagedata && reservation.pagedata.length>0 ? reservation.pagedata.map((data, index)=>{
                return(
                    <>
                    <Table.Row key={index}>
                        <Table.Cell className="table-cell">{data.source}</Table.Cell>
                        <Table.Cell className="table-cell">{data.destination}</Table.Cell>
                        <Table.Cell className="table-cell">{data.date}</Table.Cell>
                        <Table.Cell>
                        <Icon name='remove circle' onClick={()=>DeleteReservation(data.id)}/>
                        </Table.Cell>
                    </Table.Row>
                </> 
                )
                })
                :
                <Table.Row>
                    <Table.Cell colSpan='4'>No Journey</Table.Cell>
                </Table.Row>
            }
            </Table.Body>
        </Table>
        :
        <>
        {
        localStorage.getItem("admin") && reservation.station &&
        <Container textAlign='justified' className="login-form">
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
                <label>New Station</label>
                <input 
                    type="text" 
                    placeholder='Enter Station'
                    value={reservation.stationName}
                    {...register("stationName", { required: true})}
                    onChange={(e)=>setReservation({...reservation,stationName:e.target.value})}
                    />
            </Form.Field>
            {errors.stationName?.type === 'required' && <span className="station-btn">Enter Station Name</span>}
            <Button 
                type="submit"
                primary
                className="admin-station"
            >
            Add Station
            </Button>
        </Form>
        <div className="link">
            <Link onClick={()=>goBack()} className="link-forget">Go to Dashboard</Link>
        </div>
        </Container>
        }
        </>
        }
        {reservation.totalPage > 1 && !reservation.station &&
        <Pagination
            boundaryRange={0}
            defaultActivePage={reservation.activePage}
            firstItem={null}
            lastItem={null}
            totalPages={reservation.totalPage}
            onClick={(e)=>getPage(e)}
        />
        }
        </div>
    </div>
    </>)
}

export default Dashboard