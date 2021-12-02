import React, { useState, useEffect } from 'react'
import { useHistory,Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, Container, Divider } from 'semantic-ui-react'

const Login =()=>{
    let history = useHistory();
    const {handleSubmit,register,formState: { errors }} = useForm();
    const [user,setUsers]=useState({
        id:'',
        email:'',
        phone:''
    })

    useEffect(()=>{
        if(localStorage.getItem("user"))
        {
            history.push("/journey")
        }
        else if(localStorage.getItem("admin")){
            history.push("/dashboard")
        }
    },[])

    const onSubmit= async (body)=>{
        await fetch(`http://localhost:5000/users`,{
        method: 'GET',
        })
        .then(response =>response.json())
        .then(data => {
            data.map(data=>{
                if(data.email===body.email && data.password===body.password){
                    if(data.email==="admin@fake.com"){
                        setUsers({...user,email:data.email})
                        localStorage.setItem("admin",data.email)
                        history.push("/dashboard")
                    }
                    else{
                        setUsers({...user, id:data.id,email:data.email,phone:data.phone})
                        localStorage.setItem("user",data.email)
                        history.push("/journey")
                    }
                }
            })
            toast("wrong credentials")
        })
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
    <Container textAlign='justified' className="login-form">
    <h1>Login</h1>
    <Divider />
        
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
                <label>Email</label>
                <input type="text" placeholder='Email'{...register("email", { required: true,pattern:  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}/>
            </Form.Field>
            {errors.email?.type === 'required' && <span style={{color:"red"}}>Email Required </span>}
            {errors.email?.type === 'pattern' && <span style={{color:"red"}}>email only</span>}
            <Form.Field>
                <label>Password</label>
                <input type="password" placeholder='password' {...register("password", { required: true,min: 2 })}/>
            </Form.Field>
            {errors.password?.type === 'required' && <span style={{color:"red"}}>password required</span>}
            {errors.password?.type === 'min' && <span style={{color:"red"}}>minimum 2 char</span>}
            <div>
            <Button primary type='submit' >Submit</Button>
            </div>
        </Form>
        <div className="link">
            <Link onClick={()=>{history.push("/registration")}} className="link-reg">
                Register Here
            </Link>
            <Link onClick={()=>{history.push("/registration")}} className="link-forget">
                Forget Password
            </Link>
        </div>
    </Container>
    </>)
}

export default Login