import React, { useState } from "react";
import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const BaseCombobox = ({ options, placeholder, onChange, onInputChange, onKeyPress, isLocation }) => {


    const [selectedOption, setSelectedOption] = useState(null);

    const handleInputChange = (value) => {
        console.log(value, 'val');

        setSelectedOption(null);
        onChange(value);
    };

    const handleSelectOption = (option) => {
        console.log(option, 'opt');

        // if (typeof option === 'object' && option.hasOwnProperty('city')) {
        //     // If it's a location object, extract the display value
        //     option = `${option.zip_code}`;
        // }

        if (selectedOption === option) {
            setSelectedOption(null);
        } else {
            setSelectedOption(option);
        }
        onChange(option);
    };

    return (
        <Combobox as="div" onChange={handleSelectOption} value={selectedOption}>
            <div className="relative">
                <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    onChange={(event) => {
                        onInputChange(event.target.value);
                        handleInputChange(event.target.value);
                    }}
                    placeholder={placeholder}
                    autoComplete="off"
                    onKeyPress={event => {
                        onKeyPress(event);
                    }}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
                {options.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map(option => (
                            <Combobox.Option
                                key={option.id}
                                value={isLocation ? `${option.city}` : option}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-gray-600 text-white' : 'text-gray-900'
                                    )}
                            >
                                {({ active, selected }) => (
                                    <>
                                        {!isLocation && <span className={classNames('block truncate', selected && 'font-semibold')}>{option}</span>}
                                        {isLocation &&
                                            <span className={classNames('block truncate', selected && 'font-semibold')}>{option.city}, {option.state}</span>
                                        }
                                        {selected && (
                                            <span
                                                className={classNames(
                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                    active ? 'text-white' : 'text-gray-600'
                                                )}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox >
    )
}

export default BaseCombobox;
