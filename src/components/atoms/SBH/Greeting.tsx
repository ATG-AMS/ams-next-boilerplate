'use client'
import {useState,useEffect} from 'react';


export default function Greeting({data}:{data:string}){
    const [gdata,setData] = useState(data);
    
    // useEffect(() => {
    //     setMyname(name); // name이 바뀔 때만 실행됨
    //   }, [name]);

    return gdata
}