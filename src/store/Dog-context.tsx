import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthContext from './Auth-context';


interface DogBreedsContextType {
    dogBreeds: string[];
    dogIds: number[];
}

interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
}
interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

interface SearchResult {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
}
interface Match {
    match: string;
}

interface DogFilters {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
}

interface DogSearchContextProps {
    breeds: string[],
    allDogs: Dog[],
    searchResults: SearchResult[];
    favoriteDogs: string[];
    fetchDogs: (filters?: DogFilters) => void;
    fetchBreeds: () => void;
    toggleFavorite: (dogId: string) => void;
}

export const DogSearchContext = createContext<DogSearchContextProps>({
    breeds: [],
    allDogs: [],
    searchResults: [],
    favoriteDogs: [],
    fetchDogs: () => { },
    fetchBreeds: () => { },

    toggleFavorite: () => { },
});


const baseURL = 'https://frontend-take-home-service.fetch.com';


export function DogSearchProvider({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);

    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [matchedDog, setMatchedDog] = useState<Match | null>(null);

    const [loading, setLoading] = useState(false);



    // Fetch dog breeds
    const fetchBreeds = async () => {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();

                setBreeds(data);
            }
        } catch (error) {
            console.error('Failed to fetch dog breeds:', error);
        }
    };


    // Fetch search results
    const fetchDogs = async (filters?: DogFilters) => {
        // Fetch dogs based on the provided filters
        try {
            setLoading(true);
            // Build the query string for filters
            let queryString = '';
            if (filters) {
                const { breeds, zipCodes, ageMin, ageMax } = filters;
                const params = new URLSearchParams();
                if (breeds) params.append('breeds', breeds.join(','));
                if (zipCodes) params.append('zipCodes', zipCodes.join(','));
                if (ageMin) params.append('ageMin', ageMin.toString());
                if (ageMax) params.append('ageMax', ageMax.toString());
                queryString = params.toString();
            }

            // Fetch dogs with filters
            const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryString}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data: SearchResult = await response.json();
                const dogIds = data.resultIds;
                setSearchResults(data);

                // Fetch dog details
                const dogResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                    method: 'POST',
                    body: JSON.stringify(dogIds),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (dogResponse.ok) {
                    const dogData: Dog[] = await dogResponse.json();
                    setAllDogs(dogData);
                } else {
                    console.error('Failed to fetch dog details');
                }
            } else {
                console.error('Failed to fetch dogs');
            }
        } catch (error) {
            console.error('Failed to fetch dogs:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (dogId: string) => {
        // Add or remove the dog from favorites based on the current state

        setFavoriteDogs(prevState => {
            if (prevState.includes(dogId)) {
                return prevState.filter(id => id !== dogId);
            } else {
                return [...prevState, dogId];
            }
        });
    };

    // Fetch a match
    const fetchMatch = async () => {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
                method: 'POST',
                body: JSON.stringify(dogs.map((dog) => dog.id)),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (response.ok) {
                const data: Match = await response.json();
                console.log('Match:', data.match);
            }
        } catch (error) {
            console.error('Failed to fetch match:', error);
        }
    };



    return (
        <DogSearchContext.Provider value={{ breeds, searchResults, favoriteDogs, fetchBreeds, fetchDogs, toggleFavorite, allDogs }}>
            {children}
        </DogSearchContext.Provider>
    );
};