'use client'
import {useState,useEffect} from 'react';


export default function Greeting({data}:{data:string}){
    const [gdata, setData] = useState(data);

    useEffect(() => {
      setData(data); // props가 바뀔 때마다 내부 상태도 갱신
    }, [data]);
  
    return <>{gdata}</>;

    // return <>{data}</>
}