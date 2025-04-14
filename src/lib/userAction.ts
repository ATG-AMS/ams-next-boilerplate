'use server';
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

// interface

export const createUserAction = async (person)=>{
// export const createUserAction = async (person)=>{

    try{
        const user = await prisma.user.create({ data: person });

    }
    catch(e){
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return { error: "User with email already exists" };
            }
        }
        return { error: e.message };
    }
}