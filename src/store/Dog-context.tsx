import React, { createContext, useState, useContext } from 'react';

interface Location {
    zip_code: string
    latitude: string
    longitude: string
    city: string
    state: string
    county: string
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

interface DogFilters {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    sort?: string,
    size?: number;
    geoBoundingBox?: GeoBoundingBox;
    from?: string;
}
interface GeoBoundingBox {
    lat?: number;
    lon?: number;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: {
        lat?: number;
        lon?: number;
    };
    top_right?: {
        lat?: number;
        lon?: number;
    };
    bottom_right?: {
        lat?: number;
        lon?: number;
    };
    top_left?: {
        lat?: number;
        lon?: number;
    };
}


interface DogSearchContextProps {
    breeds: string[],
    allDogs: Dog[],
    searchResults: SearchResult[];
    searchLocations: Location[];
    favoriteDogs: string[];
    fetchDogs: (filters?: DogFilters) => void;
    fetchBreeds: () => void;
    toggleFavorite: (dogId: string) => void;
    fetchLocations: () => void;
    fetchNext: (link: string) => void;

}

export const DogSearchContext = createContext<DogSearchContextProps>({
    breeds: [],
    allDogs: [],
    searchResults: [],
    searchLocations: [],
    favoriteDogs: [],
    fetchDogs: () => { },
    fetchBreeds: () => { },
    toggleFavorite: () => { },
    fetchLocations: () => { },
    fetchNext: (link: string) => { }

});

const baseURL = 'https://frontend-take-home-service.fetch.com';

export function DogSearchProvider({ children }) {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [searchLocations, setSearchLocations] = useState<Location[]>([]);
    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

    // Fetch dog breeds
    const fetchBreeds = async () => {
        try {
            const response = await fetch(`${baseURL}/dogs/breeds`, {
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
            let queryString = '';
            if (filters) {
                const { breeds, zipCodes, ageMin, ageMax, sort, size } = filters;
                const params = new URLSearchParams();
                if (breeds) params.append('breeds', breeds.join(','));
                if (zipCodes) params.append('zipCodes', zipCodes.join(','));
                if (ageMin) params.append('ageMin', ageMin.toString());
                if (ageMax) params.append('ageMax', ageMax.toString());
                if (sort) params.append('sort', sort.toString());
                if (size) params.append('size', size.toString());
                queryString = params.toString();
            }

            // Fetch dogs with filters
            const response = await fetch(`${baseURL}/dogs/search?${queryString}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data: SearchResult = await response.json();
                const dogIds = data.resultIds;
                setSearchResults(data);

                // Fetch dog details
                fetchDogDetails(dogIds)
            } else {
                console.error('Failed to fetch dogs');
            }
        } catch (error) {
            console.error('Failed to fetch dogs:', error);
        }

    };

    // fetch dogs details as per ids
    const fetchDogDetails = async (dogIds: any) => {
        try {
            const dogResponse = await fetch(`${baseURL}/dogs`, {
                method: 'POST',
                body: JSON.stringify(dogIds),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (dogResponse.ok) {
                const dogData: Dog[] = await dogResponse.json();
                const sortedData = dogData.sort();
                setAllDogs(sortedData);
            } else {
                console.error('Failed to fetch dog details');
            }
        } catch (error) {
            console.error('Failed to fetch dogs:', error);
        }
    }

    // fetch next and prev data
    const fetchNext = async (link: any) => {
        try {
            const response = await fetch(`${baseURL}${link}`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                const dogIds = data.resultIds
                fetchDogDetails(dogIds)
                setSearchResults(data)
            }
        } catch (error) {
            console.error('Failed to fetch dog breeds:', error);
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

    // fetch location
    const fetchLocations = async () => {
        const requestBody: { [key: string]: any } = {};
        try {
            const response = await fetch(`${baseURL}/locations/search`, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (response.ok) {
                const searchResultsData: { results: Location[]; total: number } = await response.json();
                setSearchLocations(searchResultsData.results);
            } else {
                console.error('Failed to search locations');
            }
        } catch (error) {
            console.error('Failed to search locations:', error);
        }
    };

    return (
        <DogSearchContext.Provider value={{ breeds, searchResults, favoriteDogs, fetchBreeds, fetchDogs, fetchLocations, searchLocations, toggleFavorite, allDogs, fetchNext }}>
            {children}
        </DogSearchContext.Provider>
    );
};