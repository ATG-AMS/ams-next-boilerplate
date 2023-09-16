"use client";

import React, { useEffect } from "react";
import { RxPencil1 } from "react-icons/rx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/atoms/Dialog";
import { Button, buttonVariants } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import { Input } from "@/components/atoms/Input";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { fetchC } from "@/lib/utils";
import { useRecoilValue } from "recoil";
import { sampleTableState } from "../SampleTableState";

type Props = {
  user: User;
};

export default function ModifyDialog({ user }: Props) {
  const { refetch } = useRecoilValue(sampleTableState);
  const { idx, name, email, age, visits, progress, status } = user;
  const { register, handleSubmit } = useForm();
  const { mutate } = useMutation(fetchC, {
    onSuccess: () => {
      refetch();
      closeRef.current?.click();
    },
  });
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const onSubmit = (data: any) => {
    data.idx = idx;
    data.status = status;
    data.name = name;

    mutate({
      endpoint: `users`,
      method: "PUT",
      body: data,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="">
        <RxPencil1
          className={"cursor-pointer transition-all hover:ease-in-out"}
          size={20}
        />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
        </DialogHeader>
        <form>
          <DialogDescription className="flex flex-col gap-2">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                type="text"
                name="name"
                id="name"
                className="border"
                defaultValue={name}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                {...register("email")}
                type="text"
                name="email"
                id="email"
                className="border"
                defaultValue={email}
              />
            </div>
            <div>
              <Label htmlFor="age">나이</Label>
              <Input
                {...register("age")}
                type="text"
                name="age"
                id="age"
                className="border"
                defaultValue={age}
              />
            </div>
            <div>
              <Label htmlFor="visits">방문횟수</Label>
              <Input
                {...register("visits")}
                type="text"
                name="visits"
                id="visits"
                className="border"
                defaultValue={visits}
              />
            </div>
            <div>
              <Label htmlFor="progress">진행률</Label>
              <Input
                {...register("progress")}
                type="text"
                name="progress"
                id="progress"
                className="border"
                defaultValue={progress}
              />
            </div>
            <div>
              <Label htmlFor="status">상태</Label>
              <Input
                type="text"
                name="status"
                id="status"
                className="border"
                defaultValue={status}
                disabled
              />
            </div>
          </DialogDescription>
          <DialogFooter className="mt-2">
            <Button
              className="hover:bg-green-100"
              onClick={handleSubmit(onSubmit)}
            >
              저장
            </Button>
            <DialogClose className="hover:bg-green-100" ref={closeRef}>
              취소
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
