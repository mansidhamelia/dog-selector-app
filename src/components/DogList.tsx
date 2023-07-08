import React, { useState, Fragment } from "react"
import { MagnifyingGlassIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { json } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Menu, Transition } from '@headlessui/react'


interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]

const baseURL = 'https://frontend-take-home-service.fetch.com';


const DogList = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
    const [breedFilter, setBreedFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

    // Handle generating dog match
    const handleGenerateMatch = async () => {
        try {
            const matchData = await getDogs();
            console.log('Generated match:', matchData); // Replace with your desired display logic for the match
        } catch (error) {
            console.error('Error generating dog match:', error);
        }
    };


    return (
        <div className="w-full">
            {/* search bar */}
            {/* <div className="flex flex-1 justify-center px-2 lg:ml-6 ">
                <div className="w-full max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="search"
                            name="search"
                            className="block w-full rounded-md border-0 bg-gray-50 border-gray-200 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Search"
                            type="search"
                        />
                    </div>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Search
                    </button>
                </div>
            </div> */}

            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form className="flex flex-1" action="#" method="GET">
                        <label htmlFor="search-field" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <MagnifyingGlassIcon
                                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                                aria-hidden="true"
                            />
                            <input
                                id="search-field"
                                className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0  text-white focus:ring-0 sm:text-sm"
                                placeholder="Search..."
                                type="search"
                                name="search"
                            />
                        </div>
                    </form>
                </div>
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-x-1 text-sm font-medium leading-6 text-white">
                        Sort by
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-50' : '',
                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                        )}
                                    >
                                        Ascending
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-50' : '',
                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                        )}
                                    >
                                        Descending
                                    </a>
                                )}
                            </Menu.Item>

                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>


            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto text-left mt-4">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Dogs</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the dogs in your account including their image, name, age, Zip code and breed.
                        </p>
                    </div>

                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                            Image
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Age
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Zip code
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Breed
                                        </th>
                                        {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Edit</span>
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {people.map((person) => (
                                        <tr key={person.email}>
                                            <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                Image
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                {person.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                                            {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                    Edit<span className="sr-only">, {person.name}</span>
                                                </a>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <nav
                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
            >
                <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">20</span> results
                    </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end">
                    <a
                        href="#"
                        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                    >
                        Previous
                    </a>
                    <a
                        href="#"
                        className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                    >
                        Next
                    </a>
                </div>
            </nav>
        </div>
    )
}

export default DogList


async function loadDogs() {
    const response = await fetch('http://localhost:8080/events');

    if (!response.ok) {
        // return { isError: true, message: 'Could not fetch events.' };
        // throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
        //   status: 500,
        // });
        throw json(
            { message: 'Could not fetch events.' },
            {
                status: 500,
            }
        );
    } else {
        const resData = await response.json();
        return resData.events;
    }
}


export const getDogs = async (): Promise<Dog[]> => {
    try {
        const response = await axios.get(`${baseURL}/dogs/search`);
        console.log(response)
        return response.data.resultIds.map((id: string) => ({
            id,
            img: '', // Replace with the actual image URL from the API response
            name: '', // Replace with the actual name from the API response
            age: 0, // Replace with the actual age from the API response
            zip_code: '', // Replace with the actual zip code from the API response
            breed: '', // Replace with the actual breed from the API response
        }));
    } catch (error) {
        throw new Error('Failed to fetch dog list');
    }
};
