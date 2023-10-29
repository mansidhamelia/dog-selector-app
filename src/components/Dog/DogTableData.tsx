import React from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

const DogTable = ({ dogs, favoriteDogs, toggleFavorite, sort, handleSort }) => {
    return (
        <table className="min-w-full divide-y divide-gray-300">
            {/* Table Header */}
            <thead>
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        <a href="#" className="group inline-flex" onClick={() => handleSort(sort === 'name:asc' ? 'name:desc' : 'name:asc')}>
                            Name
                            <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </span>
                        </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex" onClick={() => handleSort(sort === 'breed:asc' ? 'breed:desc' : 'breed:asc')}>
                            Breed
                            <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </span>
                        </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex" onClick={() => handleSort(sort === 'age:asc' ? 'age:desc' : 'age:asc')}>
                            Age
                            <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </span>
                        </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5  text-sm font-semibold text-gray-900">
                        Zip Code
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
                {dogs.map((dog) => (
                    <tr key={dog.id}>
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
                            <span className="inline-flex items-center cursor-pointer rounded-full bg-gray-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-600/20">
                                {favoriteDogs.includes(dog.id) ? 'Remove' : 'Add +'}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DogTable;
