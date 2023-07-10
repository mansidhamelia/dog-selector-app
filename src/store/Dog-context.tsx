import React, { createContext, useContext, useEffect, useState } from 'react';

const DogBreedsContext = createContext([]);

export function useDogBreeds() {
    return useContext(DogBreedsContext);
}

export function DogBreedsProvider({ children }) {
    const [dogBreeds, setDogBreeds] = useState([]);

    useEffect(() => {
        // Fetch dog breeds data from the API
        const fetchDogBreeds = async () => {
            try {
                const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'

                });
                const data = await response.json();
                setDogBreeds(data);
            } catch (error) {
                console.error('Error fetching dog breeds:', error);
            }
        };

        fetchDogBreeds();
    }, []);

    return (
        <DogBreedsContext.Provider value={dogBreeds}>
            {children}
        </DogBreedsContext.Provider>
    );
}

export default DogBreedsContext