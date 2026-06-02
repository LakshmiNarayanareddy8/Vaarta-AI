import {createContext,useState} from "react";

export const AuthContext =
 createContext();

export function AuthProvider({children}){

 const [token,setToken] =
 useState(localStorage.getItem("token"));

 const [role,setRole] =
 useState(localStorage.getItem("role"));


 const login=(token,role)=>{

  localStorage.setItem("token",token);
  localStorage.setItem("role",role);

  setToken(token);
  setRole(role);

 };


 const logout=()=>{

  localStorage.clear();

  setToken(null);
  setRole(null);

 };


 return(

<AuthContext.Provider
value={{
 token,
 role,
 login,
 logout
}}
>

{children}

</AuthContext.Provider>

 );

}