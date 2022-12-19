import * as React from 'react';
import FaUi from '@/types';

const classA: FaUi.ClassA = { name: 'foo' };
console.log('Button', 'classA', classA);

export default function Button(props: FaUi.Button) {
  console.log('Hello Button from @fa/ui', props);
  return (
    <div className="rounded-md ">
      <a href="https://turbo.build/repo/docs">
        <div className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white no-underline hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 md:py-3 md:px-10 md:text-lg md:leading-6">
          <span>{props.title}</span>
          <span>{props.children}</span>
          Read the docs
          <span className="ml-2 bg-gradient-to-r from-brandred to-brandblue bg-clip-text text-transparent">→</span>
        </div>
      </a>
    </div>
  );
}
