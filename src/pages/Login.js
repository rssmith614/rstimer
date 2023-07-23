import React, {useEffect, useState} from 'react';
import {  signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult  } from 'firebase/auth';
import { auth, provider } from '../services/auth';
import { NavLink, useNavigate } from 'react-router-dom'
 
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // getRedirectResult(auth)
    //   .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access Google APIs.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential.accessToken;

    //     // The signed-in user info.
    //     const user = result.user;
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     // const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //   });
  })
      
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      navigate("/")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // console.log(errorCode, errorMessage)
      alert(errorMessage);
    });
    
  }

  // const googleRedirect = () => signInWithRedirect(auth, provider);

  return(
    <>
      <main>        
        <section className='p-3 card position-absolute top-50 start-50 translate-middle bg-light-subtle'>
          <div>                                            
            <h1> RSTimer </h1>                       
                                            
            <form>                                              
              <div>
                <label htmlFor="email-address" className='form-label'>
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"                                    
                  required                                                                                
                  placeholder="Email address"
                  onChange={(e)=>setEmail(e.target.value)}
                  className='form-control text-light'
                />
              </div>

              <div>
                <label htmlFor="password" className='form-label'>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"                                    
                  required                                                                                
                  placeholder="Password"
                  onChange={(e)=>setPassword(e.target.value)}
                  className='form-control'
                />
              </div>
                                  
              <div>
                <button                                    
                  onClick={onLogin}     
                  className='btn btn-primary my-3'                                   
                >      
                  Login                                                                  
                </button>
                
              </div>                               
            </form>

            {/* <button
              onClick={googleRedirect}
              className='btn btn-primary my-3'
            >
              Google
            </button> */}
            
            <p>
              No account yet? {' '}
              <NavLink to="/signup">
                Sign up
              </NavLink>
            </p>
                                          
          </div>
        </section>
      </main>
    </>
  )
}
 
export default Login