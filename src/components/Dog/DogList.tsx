import React, { useState, Fragment, useContext } from "react"
import { MagnifyingGlassIcon, ChevronUpDownIcon, FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import axios from 'axios';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import DogInfo from "./DogInfoTable";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/Auth-context";
// import { useDogBreeds } from "../../store/Dog-context";

interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}



const filters = [
    {
        id: 'breed',
        name: 'Breed',
        options: [
            { value: 'american-bully', label: 'American Bully', checked: false },
            { value: 'blue-lacy', label: 'Blue Lacy', checked: false },
            { value: 'canaan-dog', label: 'Canaan Dog', checked: true },
            { value: 'bulldog', label: 'English Bulldog', checked: false },
            { value: 'shepherd', label: 'English Shepherd', checked: false },
            { value: 'feist', label: 'Feist', checked: false },
        ],
    },
    {
        id: 'age',
        name: 'Age',
        options: [
            { value: 'new-arrivals', label: 'Puppy', checked: false },
            { value: 'sale', label: 'Young', checked: false },
            { value: 'travel', label: 'Adult', checked: true },
            { value: 'organization', label: 'Senior', checked: false },
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            { value: '2l', label: 'Small (0-25 lbs)', checked: false },
            { value: '6l', label: 'Medium (26-60 lbs)', checked: false },
            { value: '12l', label: 'Large (61-100 lbs)', checked: false },
            { value: '18l', label: 'Extra Large (101 lbs or more)', checked: false },

        ],
    },
]

const DogList = () => {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext)
    // const dogBreeds = useDogBreeds();


    const [dogs, setDogs] = useState<Dog[]>([]);
    const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
    const [breedFilter, setBreedFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
    const dogsPerPage = 10;
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const pageChangeHandler = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // const [sortOrder, setSortOrder] = useState('asc');

    // const handleSort = (order) => {
    //     setSortOrder(order);
    // };

    const logoutHandler = (event) => {
        event.preventDefault()
        authCtx.onLogout()
    }





    return (
        <div className="relative  min-h-full justify-center  md:px-12 lg:px-0 w-full">
            {/* search bar */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 justify-between items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">

                <div className="flex flex-1 text-white">
                    <span>LOGO</span>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-gray-50 hover:text-gray-900"
                    onClick={logoutHandler}
                >
                    Sign Out
                </button>
            </div>

            {/* Mobile filter dialog */}
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                    <button
                                        type="button"
                                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Filters */}
                                <form className="mt-4 border-t border-gray-200">
                                    {filters.map((section) => (
                                        <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root">
                                                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                            <span className="font-medium text-gray-900">{section.name}</span>
                                                            <span className="ml-6 flex items-center">
                                                                {open ? (
                                                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                                ) : (
                                                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                )}
                                                            </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                            {section.options.map((option, optionIdx) => (
                                                                <div key={option.value} className="flex items-center">
                                                                    <input
                                                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                        name={`${section.id}[]`}
                                                                        defaultValue={option.value}
                                                                        type="checkbox"
                                                                        defaultChecked={option.checked}
                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                                                    >
                                                                        {option.label}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* filters */}
            <section>
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    <form className="hidden lg:block">
                        {filters.map((section) => (
                            <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6 pl-4">
                                {({ open }) => (
                                    <>
                                        <h3 className="-my-3 flow-root">
                                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                <span className="font-medium text-gray-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    {open ? (
                                                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                    ) : (
                                                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </h3>
                                        <Disclosure.Panel className="pt-6">
                                            <div className="space-y-4">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            id={`filter-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            defaultValue={option.value}
                                                            type="checkbox"
                                                            defaultChecked={option.checked}
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label
                                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                                            className="ml-3 text-sm text-gray-600"
                                                        >
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </form>

                    <div className="lg:col-span-3">
                        {/*Dog Data table */}
                        <DogInfo page={currentPage} count={totalPages} onPageChange={pageChangeHandler} />
                    </div>
                </div>
            </section>
        </div >
    )
}

export default DogList

