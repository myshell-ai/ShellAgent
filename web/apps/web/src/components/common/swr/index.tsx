'use client';

import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';
// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'

type SwrInitorProps = {
  children: ReactNode;
};
export const SWRWrapper = ({ children }: SwrInitorProps) => {
  // const router = useRouter()
  // const searchParams = useSearchParams()
  // const consoleToken = searchParams.get('console_token')
  // const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')
  // const [init, setInit] = useState(false)

  // useEffect(() => {
  //   if (!(consoleToken || consoleTokenFromLocalStorage))
  //     router.replace('/signin')

  //   if (consoleToken) {
  //     localStorage?.setItem('console_token', consoleToken!)
  //     router.replace('/apps', { forceOptimisticNavigation: false } as any)
  //   }
  //   setInit(true)
  // }, [])

  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}>
      {children}
    </SWRConfig>
  );
};
