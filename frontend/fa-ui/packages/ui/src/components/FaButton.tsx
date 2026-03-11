import * as React from 'react';
import { FaUi } from '@ui/types';

const classA: FaUi.ClassA = { name: 'foo' };
// console.log('Button', 'classA', classA);

export default function FaButton(props: FaUi.Button) {
  console.log('Hello Button from @fa/ui', props);
  return (
    <div className="rounded-md " style={props.style}>
      <a target="_blank" href="https://turbo.build/repo/docs">
        <div className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white no-underline bg-black border border-transparent rounded-md hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 md:py-3 md:px-10 md:text-lg md:leading-6">
          <span>{props.title}</span>
          <span>{props.children}</span>
          Read the docs
          <span className="ml-2 text-transparent bg-gradient-to-r from-brandred to-brandblue bg-clip-text">→</span>
        </div>
      </a>
    </div>
  );
}
