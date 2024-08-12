// import { Fragment, useState } from 'react';
// import {
//     ModalContent,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     Input,
// } from '@nextui-org/react';
// import { Listbox, Transition } from '@headlessui/react';

// import Button from '@components/Button/Button';
// import ConfirmButton from '@components/Button/ConfirmButton';
// import DisclosureButton from '@components/Button/DisclosureButton';
// import { ItemStatus } from '@coursefull';
// import { ReadableStatus } from '@lib/helpers';
// import { SessionProps } from '@coursefull';
// import { createCourse } from '@services/courseService';

// interface CourseModalProps extends SessionProps {
//     api_v1_semester_id: string;
// }

// export default function CreateCourseModal({
//     session,
//     api_v1_semester_id,
// }: CourseModalProps) {
//     const [title, setTitle] = useState('');
//     const [code, setCode] = useState('');
//     const [status, setStatus] = useState<ItemStatus>(ItemStatus.ACTIVE);

//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     async function handleCreateCourse(onClose: CallableFunction) {
//         setIsLoading(true);
//         const { response, success } = await createCourse(
//             {
//                 title,
//                 course_code: code,
//                 status,
//                 api_v1_semester_id,
//             },
//             session,
//             (error) => {
//                 alert(`Something went wrong: ${error}`);
//                 setIsLoading(false);
//             }
//         );
//         if (!success) {
//             return;
//         }
//         onClose();
//         location.reload();
//     }

//     return (
//         <ModalContent>
//             {(onClose) => (
//                 <Fragment>
//                     <ModalHeader className="flex flex-col gap-1">
//                         Create New Course
//                     </ModalHeader>
//                     <ModalBody>
//                         <Input
//                             type="text"
//                             label="Course Title"
//                             placeholder="Introduction to Psychology..."
//                             value={title}
//                             onValueChange={setTitle}
//                         />
//                         <Input
//                             type="text"
//                             label="Course Code"
//                             placeholder="PSYC 1001..."
//                             value={code}
//                             onValueChange={setCode}
//                         />
//                         <Listbox value={status} onChange={setStatus}>
//                             <Listbox.Button
//                                 as={DisclosureButton}
//                                 className="w-full my-2"
//                             >
//                                 Status: {ReadableStatus(status)}
//                             </Listbox.Button>
//                             <Transition
//                                 enter="transition ease-out duration-200"
//                                 enterFrom="opacity-0"
//                                 enterTo="opacity-100"
//                                 leave="transition ease-in duration-200"
//                                 leaveFrom="opacity-100"
//                                 leaveTo="opacity-0"
//                             >
//                                 <Listbox.Options className="w-full flex justify-center">
//                                     <div className="w-3/4">
//                                         {[
//                                             ItemStatus.ACTIVE,
//                                             ItemStatus.COMPLETE,
//                                         ].map((status) => {
//                                             return (
//                                                 <Listbox.Option
//                                                     as={Button}
//                                                     value={status}
//                                                     className="w-full my-2 mx-auto"
//                                                 >
//                                                     {ReadableStatus(status)}
//                                                 </Listbox.Option>
//                                             );
//                                         })}
//                                     </div>
//                                 </Listbox.Options>
//                             </Transition>
//                         </Listbox>
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button onPress={onClose}>Close</Button>
//                         <ConfirmButton
//                             onPress={() => {
//                                 handleCreateCourse(onClose);
//                             }}
//                             isLoading={isLoading}
//                         >
//                             Create!
//                         </ConfirmButton>
//                     </ModalFooter>
//                 </Fragment>
//             )}
//         </ModalContent>
//     );
// }
