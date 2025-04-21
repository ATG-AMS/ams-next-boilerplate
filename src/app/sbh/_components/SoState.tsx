'use client'
import {Button,buttonVariants} from '@/components/atoms//Button';
import {Input} from '@/components/atoms//Input';
import {useState} from 'react';
import Greeting from '@/app/sbh/_components/Greeting';


// type A ={
//     a:Number;
// }

// type B ={
//     a:Number;
//     b:string;
// }

// type isAasB = B extends A ? true : false;
export default function SoStatePage(){
    // const test:B={
    //     a:1,
    //     b:"D"
    // }
    const [name, setName] = useState("소병학");
    const [age, setAge] = useState(26);

    

    return(
        <>

            <Input className="w-20"
                value={name}
                onChange={e=> setName(e.target.value)}

                placeholder='이름 입력'>
            </Input>
            
            <Input className="w-20"
                value={age}
                onChange={e=> {
                        const newAge = Number(e.target.value);
                        setAge(newAge);
                        if(newAge==1){
                            setName('응애')
                        }
                    }
                }
                placeholder='나이 입력'
                type="number">
            </Input>

            <div className="my-4 space-x-2">
                <Button onClick={() => setAge(prev=>prev+1)}>1살 추가</Button>
                <Button onClick={() => setAge(prev=>prev+3)}>3살 추가</Button>
                <Button onClick={() => setAge(prev=>prev+5)}>5살 추가</Button>
                <Button onClick={() => setAge(prev=>prev+10)}>10살 추가</Button>
            </div>
            <div className="my-4 space-x-2">
                <Button onClick={() => age>5 && setAge(prev=>prev-5)}>5살 젊어짐</Button>
            </div>
            <div>
                <h1><Greeting data={name}/>페이지입니다!</h1>
            </div>
            <p>Hi,{name}. You're {age}</p>
        </>
    )
}
