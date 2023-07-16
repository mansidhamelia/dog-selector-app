
import React from 'react';

const MatchedDogModal = ({ dog }) => {
    return (
        <div className="flex flex-1 flex-col p-8">
            <h1 className='font-bold mb-2'>         Congratulations! You've got a match!
            </h1>
            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={dog.img} alt={dog.name} />
            <h3 className="mt-6 text-sm font-medium text-gray-900">NAME: {dog.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dd className="text-sm text-gray-500">BREED: {dog.breed}</dd>
                <dd className="text-sm text-gray-500">AGE: {dog.age}</dd>
            </dl>
        </div>

    )
}

export default MatchedDogModal