import React, { useState, useEffect, useContext } from "react"
import { MagnifyingGlassIcon, ChevronUpDownIcon, CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid'
import { DogSearchContext } from "../../store/Dog-context"
import { Combobox } from '@headlessui/react'
import MatchedDogModal from "./MatchedDog"
import BaseCombobox from "../Base/BaseCombobox"
import DogTable from "./DogTableData"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
interface Match {
    match: string;
}

interface DogFilters {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    sort?: string;
    size?: number;
    from?: number;
}

const size = [10, 25, 50]

const DogInfo = () => {
    const { searchResults, favoriteDogs, fetchDogs, fetchBreeds, fetchLocations, searchLocations, toggleFavorite, allDogs, breeds, fetchNextAndPrev, currentPage, setCurrentPage } = useContext(DogSearchContext);
    const [matchedDog, setMatchedDog] = useState<undefined>(undefined)
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [sort, setSort] = useState<'name:asc' | 'name:desc' | 'breed:asc' | 'breed:desc' | 'age:asc' | 'age:desc' | 'zipCodes:asc' | 'zipCodes:desc'>('breed:asc');
    const [sizeValue, setSizeValue] = useState(25)
    const [selectedLocation, setSelectedLocation] = useState('');
    const [query, setQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('')

    const startIndex = (currentPage - 1) * sizeValue + 1;
    const endIndex = isNaN(searchResults.total) ? 0 : Math.min(startIndex + sizeValue - 1, searchResults.total);
    const totalPages = isNaN(searchResults.total) ? 0 : Math.ceil(searchResults.total / sizeValue);

    const filteredBreed =
        query === ''
            ? breeds
            : breeds.filter((breed) => {
                return breed.toLowerCase().includes(query.toLowerCase())
            })

    const filteredLocation =
        locationQuery === ''
            ? searchLocations
            : searchLocations.filter((location) => {
                return (
                    location.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
                    location.zip_code === locationQuery ||
                    location.state.toLowerCase().includes(locationQuery.toLowerCase())
                )
            })
    const searchHandler = () => {
        setCurrentPage(1)
        const filters: DogFilters = {
            breeds: selectedBreeds?.length > 0 ? [selectedBreeds] : undefined,
            ageMin: ageMin ? Number(ageMin) : undefined,
            ageMax: ageMax ? Number(ageMax) : undefined,
            zipCodes: selectedLocation ? [selectedLocation.zip_code] : locationQuery ? [locationQuery] : undefined,
            sort: sort,
            size: sizeValue ? Number(sizeValue) : undefined,
        };
        fetchDogs(filters);
    };

    const handleSelectedBreedsChange = (value) => {
        setSelectedBreeds((prevSelected) => (prevSelected === value ? null : value));
    };
    const handleSelectedLocationChange = (value) => {
        setSelectedLocation((prevSelected) => (prevSelected === value ? null : value));
    };
    const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setCurrentPage(1)
            searchHandler()
        }
    };

    // Pagination Logic
    const goToPage = (pageNumber) => {
        const fromValue = (pageNumber - 1) * sizeValue;
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
        const filters: DogFilters = {
            breeds: selectedBreeds?.length > 0 ? [selectedBreeds] : undefined,
            sort: sort,
            size: sizeValue,
            from: fromValue ? Number(fromValue) : undefined,
        };
        fetchDogs(filters);
    };
    const goToFirstPageHandler = () => {
        setCurrentPage(1);
        const pageNumber = 1
        const fromValue = (pageNumber - 1) * sizeValue;
        const filters: DogFilters = {
            breeds: selectedBreeds?.length > 0 ? [selectedBreeds] : undefined,
            sort: sort,
            size: sizeValue,
            from: fromValue ? Number(fromValue) : undefined,
        };
        fetchDogs(filters);
    };

    const goToLastPageHandler = () => {
        setCurrentPage(totalPages);
        const fromValue = (totalPages - 1) * sizeValue;
        const filters: DogFilters = {
            breeds: selectedBreeds?.length > 0 ? [selectedBreeds] : undefined,
            sort: sort,
            size: sizeValue,
            from: fromValue ? Number(fromValue) : undefined,
        };
        fetchDogs(filters);
    };
    const getPageRange = () => {
        const pageRange = [];
        const maxPageNumbersToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

        if (endPage - startPage + 1 < maxPageNumbersToShow) {
            startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
        }
        for (let page = startPage; page <= endPage; page++) {
            pageRange.push(page);
        }
        return pageRange;
    };
    const previousPageHandler = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
        fetchNextAndPrev(searchResults.prev || '')
    }
    const nextPageHandler = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(searchResults.total / sizeValue)))
        fetchNextAndPrev(searchResults.next || '');
    }

    useEffect(() => {
        fetchBreeds();
        fetchLocations();
    }, [])
    useEffect(() => {
        searchHandler()
    }, [sizeValue, sort])
    const handleSort = (option: typeof sort) => {
        setSort(option);
    };

    // Fetch a match
    const handleMatch = async () => {
        try {
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
                if (matchId) {
                    const res = allDogs.find((dog) => dog.id === matchId);
                    setMatchedDog(res)
                }
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
                {!matchedDog &&
                    <div className=" top-0 py-2 flex shrink-0 items-center gap-x-6 border-b border-black/10 shadow-sm">
                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
                            <form className="flex flex-1 flex-col items-center gap-y-2 " action="#" method="GET">
                                <div className="flex justify-between w-full gap-x-2">
                                    {/* Breed */}
                                    <div className="relative w-1/2">
                                        <BaseCombobox
                                            value={selectedBreeds}
                                            onChange={handleSelectedBreedsChange}
                                            options={filteredBreed}
                                            placeholder="Breeds"
                                            inputValue={query}
                                            onInputChange={setQuery}
                                            onKeyPress={keyPressHandler}
                                        />
                                    </div>
                                    {/* Age */}
                                    <div className="relative">
                                        <input
                                            id="search-field"
                                            className="block w-full rounded-md border-0 bg-white py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                                            name="search"
                                            placeholder="Min Age"
                                            onKeyPress={keyPressHandler}
                                            type="search" value={ageMin} onChange={e => setAgeMin(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="search-field"
                                            className="block w-full rounded-md border-0 bg-white py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  text-sm"
                                            placeholder="Max Age"
                                            name="search"
                                            onKeyPress={keyPressHandler}
                                            type="search" value={ageMax} onChange={e => setAgeMax(e.target.value)}
                                        />
                                    </div>
                                    {/* Location */}
                                    <div className="relative w-1/2">
                                        <Combobox as="div" value={selectedLocation} onChange={handleSelectedLocationChange} >
                                            <div className="relative">
                                                <Combobox.Input
                                                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                                    onChange={(event) => setLocationQuery(event.target.value)}
                                                    displayValue={(location) => location?.city}
                                                    placeholder="Location(i.e. Los Angeles, CA or 90210)"
                                                    onKeyPress={keyPressHandler}
                                                    autoComplete="off"
                                                />

                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </Combobox.Button>
                                                {filteredLocation.length > 0 && (
                                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {filteredLocation.map((location) => (
                                                            <Combobox.Option
                                                                key={location.zip_code}
                                                                value={location}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                        active ? 'bg-gray-600 text-white' : 'text-gray-900'
                                                                    )}
                                                            >
                                                                {({ active, selected }) => (
                                                                    <>
                                                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{location.city}, {location.state}</span>
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
                                        </Combobox>
                                    </div>
                                </div>
                            </form>
                        </div>
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
                    </div>
                }
                {/* Table description, Generate Match and Size */}
                <div className="sm:flex sm:items-center">
                    {!matchedDog && <div className="sm:flex-auto text-left mt-4 flex justify-between">
                        <div>
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Dogs</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the dogs in your account including their image, name, age, Zip code and breed.
                            </p>
                        </div>
                    </div>}
                    <div className="mt-4 flex gap-x-2">
                        <button
                            type="button"
                            className={`items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${favoriteDogs.length === 0 ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            onClick={handleMatch} disabled={favoriteDogs.length === 0}                    >
                            Generate Match
                        </button>
                        {!matchedDog &&
                            <BaseCombobox
                                value={sizeValue}
                                onChange={setSizeValue}
                                options={size}
                                placeholder="Size"
                                onKeyPress={keyPressHandler}
                                isSize
                            />
                        }
                    </div>
                </div>

                {/* Dogs detail table and matched dog details */}
                {matchedDog ? (
                    <div>
                        <MatchedDogModal dog={matchedDog} />
                    </div>
                ) : (
                    < div className="mt-8 flow-root ">
                        <DogTable
                            dogs={allDogs}
                            sort={sort}
                            handleSort={handleSort}
                        />

                        {/* Pagination */}
                        <nav className="flex-row items-center  border-t border-gray-200 px-4 py-3 sm:px-0">
                            <div className="flex items-center justify-center">
                                <div className="hidden md:-mt-px md:flex">
                                    {searchResults.prev && (
                                        <div className="">
                                            <a
                                                href="#"
                                                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                onClick={goToFirstPageHandler}
                                            >
                                                <ChevronDoubleLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </a>
                                            <a
                                                href="#"
                                                className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                onClick={previousPageHandler}
                                            >
                                                Previous
                                            </a>
                                        </div>)}
                                    {getPageRange().map((pageNumber) => (
                                        <a
                                            key={pageNumber}
                                            href="#"
                                            className={`inline-flex items-center ${pageNumber === currentPage
                                                ? 'border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600'
                                                : 'border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            onClick={() => goToPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </a>
                                    ))}
                                    {currentPage !== totalPages && searchResults.total > sizeValue && (

                                        <div className="">
                                            <a
                                                href="#"
                                                className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                onClick={nextPageHandler} >
                                                Next
                                            </a>
                                            <a
                                                href="#"
                                                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                onClick={goToLastPageHandler}>
                                                <ChevronDoubleRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </a>
                                        </div>)}
                                </div>
                            </div>
                            <div className="hidden sm:block mt-2">
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{searchResults.total >= 1 ? startIndex : 0}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                                    <span className="font-medium">{searchResults.total}</span> results
                                </p>
                            </div>
                        </nav>
                    </div >)}
            </div >
        </>
    )
}

export default DogInfo