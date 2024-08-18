// import { forwardRef, Fragment } from 'react';
// import { Disclosure } from '@headlessui/react';
// import Button, { ButtonProps } from '@components/Button/Button';
// import { ChevronRightIcon } from '@heroicons/react/20/solid';

// export interface DisclosureButtonProps extends ButtonProps {}

// export default forwardRef<HTMLButtonElement, DisclosureButtonProps>(function (
//     { children, ...props },
//     ref
// ) {
//     let { className, ...remainingProps } = props;
//     return (
//         <Button className={className} {...remainingProps} ref={ref}>
//             <div className="flex justify-between">
//                 {children}
//                 <ChevronRightIcon className="ui-open:translate-y-1 ui-open:-rotate-90 ui-not-open:rotate-90 ui-not-open:translate-y-0.5 h-4 w-4 translate-y" />
//             </div>
//         </Button>
//     );
// });
