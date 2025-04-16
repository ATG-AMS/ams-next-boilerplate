import { SampleTable } from '@/components/ui/SampleTable';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import SoAppRouteButton from '@/components/atoms/SBH/SoAppRouteButton';



const Home = async () => {
  
  const sampleTableData = await prisma.user
    .findMany({
      skip: 0,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then(async (users) => {
      const count = await prisma.user.count();
      return { rows: users, count };
    });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200  lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
       
        <SoAppRouteButton/>
        <Image
          priority
          alt="ATG Logo"
          height={37}
          src="/ATG.svg"
          // className="dark:invert"
          width={180}
        />
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:size-auto lg:bg-none dark:from-black dark:via-black">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            With&nbsp;{' '}
            <Image
              priority
              alt="Next.js Logo"
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              height={37}
              src="/next.svg"
              width={150}
            />
          </a>
        </div>
      </div>
      <div className="relative flex w-full place-items-center before:absolute before:h-[310px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40">
        <div className="w-full">
          <SampleTable initialData={sampleTableData} />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Next.js{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Next.js 기능 및 API에 대한 자세한 정보를 확인하세요.
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          href="https://tanstack.com/query/v5/docs/react/overview"
          rel="noopener noreferrer"
          target="_blank"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            React Query{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            비동기 데이터를 가져오고 캐시하는 데 사용할 수 있는 React Hooks
            라이브러리입니다.
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          href="https://recoiljs.org/docs/introduction/motivation"
          rel="noopener noreferrer"
          target="_blank"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Recoil{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            React 앱을 위한 상태 관리 라이브러리입니다.
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          href="https://www.prisma.io/docs"
          rel="noopener noreferrer"
          target="_blank"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Prisma{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            데이터베이스를 위한 모던한 Node.js ORM입니다.
          </p>
        </a>

        {/* <Button asChild variant="outline"> */}
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          href="/so"
          rel="noopener noreferrer"
          target="_blank"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            SBH{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            소병학의 테스트 페이지입니다.
          </p>
        </a>
        {/* </Button> */}
        

      </div>
    </main>
  );
};

export default Home;
