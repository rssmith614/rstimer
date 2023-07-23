import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../services/auth';
 
const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault()
    
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        navigate("/login")
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode, errorMessage);
        alert(errorMessage);
      });

  
  }
 
  return (
    <main >        
      <section>
        <div>
          <div className='p-3 card position-absolute top-50 start-50 translate-middle bg-light-subtle'>                  
            <h1> RSTimer </h1>                                                                            
            <form>                                                                                            
              <div>
                <label htmlFor="email-address" className='form-label'>
                  Email address
                </label>
                <input
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  
                  required                                    
                  placeholder="Email address"   
                  className='form-control'                             
                />
              </div>

              <div>
                <label htmlFor="password" className='form-label'>
                  Password
                </label>
                <input
                  type="password"
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required                                 
                  placeholder="Password"    
                  className='form-control'          
                />
              </div>                                             
              
              <button
                type="submit" 
                onClick={onSubmit}  
                className='btn btn-primary my-3'                      
              >  
                Sign up                                
              </button>
                                                              
            </form>
            
            <p>
              Already have an account?{' '}
              <NavLink to="/login" >
                Sign in
              </NavLink>
            </p>                   
          </div>
        </div>
      </section>
    </main>
  )
}
 
export default Signup