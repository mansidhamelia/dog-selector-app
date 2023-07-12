import React, { useState, Fragment, useEffect, useContext } from "react"
import { Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon, ChevronUpDownIcon, FunnelIcon, CheckIcon } from '@heroicons/react/20/solid'
import { DogSearchContext } from "../../store/Dog-context"
import ComboBox from "../BaseComboBox"
import { Combobox } from '@headlessui/react'

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

interface DogFilters {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    sort?: string;
}
const DogInfo = (props) => {
    const { searchResults, favoriteDogs, fetchDogs, fetchBreeds, toggleFavorite, allDogs, breeds } = useContext(DogSearchContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [matchedDog, setMatchedDog] = useState<Match | null>(null);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [location, setLocation] = useState('');
    const [sort, setSort] = useState<'asc' | 'desc'>('asc');
    const [isSortAscending, setIsSortAscending] = useState(true);
    // const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);

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

    useEffect(() => {
        fetchDogs()
        fetchBreeds();
    }, [])

    const [query, setQuery] = useState('');

    const filteredBreed =
        query === ''
            ? breeds
            : breeds.filter((breed) => {
                return breed.toLowerCase().includes(query.toLowerCase())
            })


    const searchHandler = () => {

        const filters: DogFilters = {};

        if (breeds) {
            filters.breeds = [selectedBreeds];
        }

        if (ageMin) {
            filters.ageMin = Number(ageMin);
        }

        if (ageMax) {
            filters.ageMax = Number(ageMax);
        }

        if (location) {
            filters.zipCodes = [location];
        }

        if (sort) {
            filters.sort = `breed:${sort}`;
            // setSort(prevSort => (prevSort === 'asc' ? 'desc' : 'asc'));

        }

        fetchDogs(filters);
    };

    const handleSort = () => {
        console.log('sorting');
        setSort(prevSort => (prevSort === 'asc' ? 'desc' : 'asc'));
    };

    // const handleSelect = (selectedValue: string) => {
    //     setBreed(selectedValue);
    // };

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
                const matchId = matchData.match
                setMatchedDog(matchData);

                // Fetch dog details
                // const dogResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                //     method: 'POST',
                //     body: JSON.stringify(matchId),
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     credentials: 'include',
                // });

                // if (dogResponse.ok) {
                //     const dogData: Dog[] = await dogResponse.json();
                //     // setAllDogs(dogData);
                //     // setMatchedDog(dogData)

                // } else {
                //     console.error('Failed to fetch dog details');
                // }


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
                        <form className="flex flex-1 items-center gap-x-1" action="#" method="GET">
                            <div className="relative w-full">
                                {/* <input
                                    id="search-field"
                                    className="block w-full rounded-md border-0 bg-white py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                    placeholder=" Breed "
                                    type="search"
                                    name="search"
                                    value={breed} onChange={e => setBreed(e.target.value)}
                                /> */}


                                <Combobox as="div" value={selectedBreeds} onChange={setSelectedBreeds}>
                                    <div className="relative mt-2">
                                        <Combobox.Input
                                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </Combobox.Button>

                                        {filteredBreed.length > 0 && (
                                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {filteredBreed.map((person) => (
                                                    <Combobox.Option
                                                        key={person}
                                                        value={person}
                                                        className={({ active }) =>
                                                            classNames(
                                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                            )
                                                        }
                                                    >
                                                        {({ active, selected }) => (
                                                            <>
                                                                <span className={classNames('block truncate', selected && 'font-semibold')}>{person}</span>

                                                                {selected && (
                                                                    <span
                                                                        className={classNames(
                                                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                            active ? 'text-white' : 'text-indigo-600'
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
                                </Combobox>

                            </div>
                            <div className="relative  ">

                                <input
                                    id="search-field"
                                    className="block w-full rounded-md border-0 bg-white py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                    placeholder="Min Age"
                                    name="search"
                                    type="search" value={ageMin} onChange={e => setAgeMin(e.target.value)}
                                />
                            </div>
                            {/* <div className="relative  ">

                                <input
                                    id="search-field"
                                    className="block w-full rounded-md border-0 bg-white py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                    placeholder=" Max Age"
                                    name="search"
                                    type="search" value={ageMax} onChange={e => setAgeMin(e.target.value)}
                                />
                            </div> */}
                            <div className="relative w-full">

                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full rounded-md border-0 bg-white py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                    placeholder="Location"
                                    type="search"

                                    value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                        </form>
                    </div>

                    {/* onClick={handleMatch}
                        onClick={() => fetchDogs()}
                        disabled={favoriteDogs.length === 0} */}

                    <button
                        type="button"
                        className="relative inline-flex items-center gap-x-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        onClick={searchHandler}
                    >
                        <MagnifyingGlassIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                        />
                        Search
                    </button>

                    {/* <button
                        type="button"
                        className="-m-2 ml-0.5 p-2 text-gray-400 hover:text-gray-500 sm:ml-2 lg:hidden"
                        onClick={() => setMobileFiltersOpen(true)}
                    >
                        <span className="sr-only">Filters</span>
                        <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                    </button> */}
                </div>

                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto text-left mt-4">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Dogs</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the dogs in your account including their image, name, age, Zip code and breed.
                        </p>
                        {/* <button onClick={() => fetchDogs()} className="bg-slate-200">Fetch Dogs</button>, */}
                        <button onClick={handleMatch} disabled={favoriteDogs.length === 0}>
                            Generate Match
                        </button>
                    </div>
                </div>


                {matchedDog ? (
                    <div>
                        <h2>Matched Dog:</h2>
                        <p>{matchedDog.match}</p>
                    </div>
                ) : (
                    < div className="mt-8 flow-root ">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Breed
                                                    <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" onClick={handleSort} />
                                                    </span>
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                Age
                                            </th>
                                            <th scope="col" className="px-3 py-3.5  text-sm font-semibold text-gray-900">
                                                Zip code
                                            </th>
                                            {/* Please enter a valid zip / postal or city, state (2 letter state). */}
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
                                                    <span className="inline-flex items-center cursor-pointer rounded-full bg-gray-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-600/20"
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
                    {/* <button
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
                    </button> */}

                    {/* {searchResults.prev && <button onClick={() => fetchDogs(searchResults.prev)}>Prev</button>}
                    {searchResults.next && <button onClick={() => fetchDogs(searchResults.next)}>Next</button>} */}

                </div>
            </nav>
        </>
    )
}

export default DogInfo