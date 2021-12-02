import React, { useEffect } from 'react'
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, Container, Divider } from 'semantic-ui-react'

const Registration =()=>{
    let history = useHistory();
    const {handleSubmit,register,formState: { errors }} = useForm();

    useEffect(()=>{
        if(localStorage.getItem("user"))
        {
            history.push("/journey")
        }
    },[])
    
    const onSubmit= async (data)=>{
        if(data.password===data.confirmP){
            await fetch('http://localhost:5000/users',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    "email": data.email,
                    "phone": data.phone,
                    "password":data.password,
                })
            })
            .then(response =>{
                if(response.statusText==="Created" && response.status===201){
                    history.push("/");
                }
                else{
                    toast.error(response.statusText);
                }
            })
        }
        else{
            toast.error("password and confirm password are mismatch");
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
    <Container textAlign='justified' className="login-form">
    <h1>Register Here</h1>
    <Divider />
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
                <label className="inpt-label">Email</label>
                <input type="email" placeholder='Email'{...register("email", { required: true })}/>
            </Form.Field>
            {errors.email && <span style={{color:"red"}}>Email Required</span>}
            <Form.Field>
                <label>Phone</label>
                <input type="number" placeholder='Phone' {...register("phone", { required: true,minLength:10,maxLength:10, pattern:"[+ 0-9]{14}" })}/>
            </Form.Field>
            {errors.phone?.type==='required' && <span style={{color:"red"}}>Phone Required</span>}
            {errors.phone?.type=='minLength' && <span style={{color:"red"}}>10 characters only</span>}
            {errors.phone?.type=='maxLength' && <span style={{color:"red"}}>10 characters only</span>}
            {errors.phone?.type ==='pattern' && <span style={{color:"red"}}>Numbers only</span>}
            <Form.Field>
                <label>Password</label>
                <input type="password" placeholder='password' {...register("password", { required: true })}/>
            </Form.Field>
            {errors.password && <span style={{color:"red"}}>Password Required</span>}
            <Form.Field>
                <label>Confirm password</label>
                <input type="password" placeholder='Confirm password' {...register("confirmP", { required: true })}/>
            </Form.Field>
            {errors.confirmP && <span style={{color:"red"}}>Confirm your password</span>}
            <div>
            <Button type='submit' primary>Submit</Button>
            </div>
        </Form>
        <div className="link">
        <Link onClick={()=>{history.push("/")}} className="link-reg">Login Here</Link>
        </div>
    </Container> 
    </>)
}

export default Registration