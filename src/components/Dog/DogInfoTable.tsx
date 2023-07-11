import React, { useState, Fragment, useEffect, useContext } from "react"
import { Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon, ChevronUpDownIcon, FunnelIcon } from '@heroicons/react/20/solid'
import { DogSearchContext } from "../../store/Dog-context"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
interface Match {
    match: string;
}
interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

const DogInfo = (props) => {
    const { searchResults, favoriteDogs, fetchDogs, toggleFavorite, allDogs } = useContext(DogSearchContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [matchedDog, setMatchedDog] = useState<Match | null>(null);

    const dogsPerPage = 10;
    const totalPages = Math.ceil(allDogs.length / dogsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };
    // Calculate startIndex and endIndex based on currentPage
    const startIndex = (currentPage - 1) * dogsPerPage;
    const endIndex = startIndex + dogsPerPage;
    const dogsToShow = allDogs.slice(startIndex, endIndex);

    const handleSort = (order) => {
        setSortOrder(order);
    };


    const handleMatch = async () => {
        try {
            // Call match endpoint with favorite dogs
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
                method: 'POST',
                body: JSON.stringify(favoriteDogs),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const matchData: Match = await response.json();
                setMatchedDog(matchData);
            } else {
                console.error('Failed to fetch match');
            }
        } catch (error) {
            console.error('Failed to fetch match:', error);
        }
    };

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 ">

                {/* search bar */}
                <div className="sticky top-0  flex h-16 shrink-0 items-center gap-x-6 border-b border-black/10 shadow-sm">

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
                        <form className="flex flex-1" action="#" method="GET">
                            <label htmlFor="search-field" className="sr-only">
                                Search
                            </label>
                            <div className="relative w-full border-0">
                                <MagnifyingGlassIcon
                                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                                    aria-hidden="true"
                                />
                                <input
                                    id="search-field"
                                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    placeholder="Search By Breed name"
                                    type="search"
                                    name="search"
                                // value={searchQuery}
                                // onChange={handleSearch}
                                />
                            </div>
                        </form>
                    </div>
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-x-1 text-sm font-medium leading-6 text-gray-900">
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
                                            onClick={() => handleSort('asc')}

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
                                            onClick={() => handleSort('desc')}

                                        >
                                            Descending
                                        </a>
                                    )}
                                </Menu.Item>

                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <button
                        type="button"
                        className="-m-2 ml-0.5 p-2 text-gray-400 hover:text-gray-500 sm:ml-2 lg:hidden"
                        onClick={() => setMobileFiltersOpen(true)}
                    >
                        <span className="sr-only">Filters</span>
                        <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto text-left mt-4">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Dogs</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the dogs in your account including their image, name, age, Zip code and breed.
                        </p>
                        <button onClick={() => fetchDogs()} className="bg-slate-200">Fetch Dogs</button>,
                        <button onClick={handleMatch} disabled={favoriteDogs.length === 0} className="bg-slate-200">
                            Search
                        </button>
                    </div>
                </div>


                {matchedDog ? (
                    <div>
                        <h2>Matched Dog:</h2>
                        <p>{matchedDog.match}</p>
                    </div>
                ) : (
                    < div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                Breed
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                Age
                                            </th>
                                            <th scope="col" className="px-3 py-3.5  text-sm font-semibold text-gray-900">
                                                Zip code
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {dogsToShow.map((dog) => (
                                            < tr key={dog.id} >
                                                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                    <div className="flex items-center">
                                                        <div className="h-11 w-11 flex-shrink-0">
                                                            <img className="h-11 w-11 rounded-full" src={dog.img} alt={dog.name} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{dog.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap  px-3 py-4 text-sm text-gray-500">{dog.breed}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dog.age}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dog.zip_code}</td>
                                                < td onClick={() => toggleFavorite(dog.id)}>
                                                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-600/20"
                                                    >
                                                        {favoriteDogs.includes(dog.id) ? 'Remove' : 'Add +'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div >
                )}
            </div >
            <nav
                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
            >
                <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, allDogs.length)}</span> of{' '}
                        <span className="font-medium">{allDogs.length}</span> results
                    </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end">
                    <button
                        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                        disabled={endIndex >= allDogs.length}
                        onClick={handleNextPage}
                    >
                        Next
                    </button>
                </div>
            </nav>
        </>
    )
}

export default DogInfo