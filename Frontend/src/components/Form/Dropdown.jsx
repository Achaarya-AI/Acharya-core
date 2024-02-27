import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAppState } from '../../AppStateContext';

const Dropdown = ({ items, label, type, disabled, themeColors }) => {
    const { input, setInput } = useAppState();
    const [selectedItem, setSelectedItem] = useState(input[type]);

    const handleSelectItem = (item) => {
        setSelectedItem(item);

        if (type === "class") {
            setInput((prev) => (
                { ...prev, class: item }
            ));
        } else if (type === "subject") {
            setInput((prev) => (
                { ...prev, subject: item }
            ));
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className={`inline-flex w-full justify-between items-center gap-x-1.5 rounded-md ${themeColors.bg} ${themeColors.txt} border-2 border-solid border-secondary px-4 h-[40px] focus:outline-none focus:border-secondary`}>
                    {input[type] || label}
                    <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={`absolute right-0 z-10 mt-2 w-full 
                    max-h-56 overflow-y-auto origin-top-right 
                    rounded-lg ${themeColors.bg2} shadow-lg ring-1 
                    ring-black ring-opacity-5 focus:outline-none`}
                >
                    <div className="py-1">
                        {items.map((item) => (
                            <Menu.Item key={item} data-item={item}>
                                {({ active }) => (
                                    <div
                                        className={`block px-4 py-2 text-sm cursor-pointer 
                      ${input[type] === item ? `bg-secondary ${themeColors.txt}` : `${themeColors.txt}`} 
                    `}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        {item}
                                    </div>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Dropdown;
