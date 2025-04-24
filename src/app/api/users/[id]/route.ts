import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req : Request,
    {params} : {params:{id:string}}
) {
    try{
        const id = Number(params.id);
        if(isNaN(id)){
            return NextResponse.json({ message: '잘못된 ID입니다.' }, { status: 400 });
        }
        // Prisma로 삭제 처리
        await prisma.user.delete({
            where: { idx: id },
        });
        return NextResponse.json({ message: '삭제 완료' }, { status: 200 });
    }catch(error){
        console.log(error);
        return NextResponse.json({ message: '삭제 실패', error }, { status: 500 });
    }
}
