import React, { createContext, useState } from 'react';

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
    from?: number;
}

interface DogSearchContextProps {
    breeds: string[],
    allDogs: Dog[],
    searchResults: SearchResult;
    searchLocations: Location[];
    favoriteDogs: string[];
    fetchDogs: (filters?: DogFilters) => void;
    fetchBreeds: () => void;
    toggleFavorite: (dogId: string) => void;
    fetchLocations: () => void;
    fetchNextAndPrev: (link: string) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    fetchZipCode: (lat: string, lon: string) => void;
}

export const DogSearchContext = createContext<DogSearchContextProps>({
    breeds: [],
    allDogs: [],
    searchResults: { resultIds: [], total: 0 },
    searchLocations: [],
    favoriteDogs: [],
    fetchDogs: () => { },
    fetchBreeds: () => { },
    toggleFavorite: () => { },
    fetchLocations: () => { },
    fetchNextAndPrev: (link: string) => { },
    currentPage: 1,
    setCurrentPage: () => { },
    fetchZipCode: () => { }
});

const baseURL = 'https://frontend-take-home-service.fetch.com';

export function DogSearchProvider({ children }) {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [searchLocations, setSearchLocations] = useState<Location[]>([]);
    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

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

    // Fetch dogs based on the provided filters
    const fetchDogs = async (filters?: DogFilters) => {
        try {
            let queryString = '';
            if (filters) {
                const { breeds, zipCodes, ageMin, ageMax, sort, size, from } = filters;
                const params = new URLSearchParams();
                if (breeds) params.append('breeds', breeds.join(','));
                if (zipCodes) params.append('zipCodes', zipCodes.join(','));
                if (ageMin) params.append('ageMin', ageMin.toString());
                if (ageMax) params.append('ageMax', ageMax.toString());
                if (sort) params.append('sort', sort.toString());
                if (size) params.append('size', size.toString());
                if (from) params.append('from', from.toString())
                queryString = params.toString();
            }

            const response = await fetch(`${baseURL}/dogs/search?${queryString}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data: SearchResult = await response.json();
                const dogIds = data.resultIds;
                setSearchResults(Object.assign([], data));

                // Fetch dog details based on Ids
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
    const fetchNextAndPrev = async (link: any) => {
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

    // Fetch zip code based on latitude and longitude
    const fetchZipCode = async (latitude: string, longitude: string) => {
        try {
            const response = await fetch(`${baseURL}/locations/search`, {
                method: 'POST',
                body: JSON.stringify({
                    top: { lat: latitude, lon: longitude },
                    bottom: { lat: latitude, lon: longitude },
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data: { results: Location[]; total: number } = await response.json();
                if (data.total > 0) {

                    const filteredZipCodes = data.results.filter(
                        (location) => parseFloat(location.latitude) === parseFloat(latitude) && parseFloat(location.longitude) === parseFloat(longitude)
                    )
                    if (filteredZipCodes.length > 0) {
                        const zipCode = filteredZipCodes[0].zip_code;
                        const filters: DogFilters = {
                            zipCodes: zipCode ? [zipCode] : undefined,
                        };
                        fetchDogs(filters);

                    } else {
                        console.error('No zip codes found with similar latitude and longitude');
                    }
                } else {
                    console.error('No location found for the given latitude and longitude');
                }
            } else {
                console.error('Failed to fetch zip code');
            }
        } catch (error) {
            console.error('Failed to fetch zip code:', error);
        }
    };


    const contextValue = {
        breeds,
        searchResults,
        favoriteDogs,
        fetchBreeds,
        fetchDogs,
        fetchLocations,
        searchLocations,
        toggleFavorite,
        allDogs,
        fetchNextAndPrev,
        currentPage,
        setCurrentPage,
        fetchZipCode: (lat: string, lon: string) => fetchZipCode(lat, lon),
    };

    return (
        <DogSearchContext.Provider value={contextValue}>
            {children}
        </DogSearchContext.Provider >
    );
};