"use client";

import { Button } from "@/components/atoms/Button";
import { cn, fetchC } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { makeData, Person } from "@/lib/makeData";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { sampleTableState } from "../SampleTableState";

export function FunctionToolbar({ className }: { className?: string }) {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { refetch } = tableState;
  const goToFrontPage = () => {
    setTableState((prev) => ({ ...prev, pageIndex: 0 }));
  };
  const resetPageSize = () => {
    setTableState((prev) => ({ ...prev, pageIndex: 0, pageSize: 10 }));
  };
  return (
    <div className={cn("flex justify-end", className)}>
      <GenerateData
        className="border-r border-gray-400"
        refetch={refetch}
        syncState={goToFrontPage}
      />
      <ResetButton
        refetch={refetch}
        syncState={goToFrontPage}
        resetSize={resetPageSize}
      />
    </div>
  );
}

type Props = {
  className?: string;
  refetch: () => void;
  syncState: () => void;
  resetSize?: () => void;
};

export function GenerateData({ className, refetch, syncState }: Props) {
  const { register, handleSubmit } = useForm();
  const { mutate, status } = useMutation(fetchC);

  const handleGenerateData = (inputValue: Record<string, unknown>) => {
    const { rows } = inputValue;
    const dummyData: Person[] = makeData(rows as number);
    dummyData.forEach((person) => {
      mutate({
        endpoint: "users", // http://localhost:3000/api/users
        method: "POST",
        body: person,
      });
    });
  };
  useEffect(() => {
    if (status === "success") {
      syncState();
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <form className={cn("flex items-center ", className)}>
      <Label className="items-start" htmlFor="rows">
        생성할 데이터의 수 : &nbsp;
      </Label>
      <Input
        className="w-24 bg-gray-200 shadow-2xl dark:bg-transparent"
        type="number"
        placeholder="1,000"
        {...register("rows", { required: true, min: 1, max: 1000 })}
        min={1}
        max={1000}
        required
      />
      <Button
        className="text-lg shadow-none"
        onClick={handleSubmit(handleGenerateData)}
      >
        생성
      </Button>
    </form>
  );
}

export function ResetButton({
  className,
  refetch,
  syncState,
  resetSize,
}: Props) {
  const { mutate, status, isSuccess } = useMutation(fetchC, {
    onSuccess: () => {
      if (resetSize) {
        syncState();
        refetch();
      }
    },
  });

  const handleResetData = () => {
    mutate({
      endpoint: "users", // http://localhost:3000/api/users
      method: "DELETE",
      body: { idx: "reset-data" },
    });
  };

  return (
    <Button
      className={cn("text-lg shadow-none", className)}
      onClick={handleResetData}
    >
      초기화
    </Button>
  );
}
