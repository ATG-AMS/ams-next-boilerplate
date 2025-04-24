import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils'; 

type Props = {
  className?: string;
};

export const UserSearchBar = ({ className }: Props) => {
  return (
    <div className={cn("flex items-center justify-between gap-8 flex-wrap", className)}>
      {/* 검색 필드 섹션 */}
      <div className="flex gap-6 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name" placeholder="이름 입력" className="w-[150px] rounded-lg bg-gray-100 border-gray-300" />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" placeholder="이메일 입력" className="w-[260px] rounded-lg bg-gray-100 border-gray-300" />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="age">나이</Label>
          <Input id="age" type="number" placeholder="나이 입력" className="w-[100px] rounded-lg bg-gray-100 border-gray-300" />
        </div>
      </div>

      {/* 버튼 섹션 */} 
      {/* TODO : css 다듬기 */}
      <div className="flex gap-3">
        <Button  className="rounded-lg">검색</Button>
        <Button  className="rounded-lg">검색 초기화</Button>
      </div>
    </div>
  );
};