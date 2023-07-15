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
    from?: string;
    geoBoundingBox?: {
        top?: {
            lat: number;
            lon: number;
        };
        bottom?: {
            lat: number;
            lon: number;
        };
        bottom_left?: {
            lat: number;
            lon: number;
        };
        top_right?: {
            lat: number;
            lon: number;
        };
        bottom_right?: {
            lat: number;
            lon: number;
        };
        top_left?: {
            lat: number;
            lon: number;
        };
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
    endIndex: number;
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
    fetchNext: (link: string) => { },
    endIndex: 25
});

const baseURL = 'https://frontend-take-home-service.fetch.com';

export function DogSearchProvider({ children }) {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [searchLocations, setSearchLocations] = useState<Location[]>([]);
    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
    const [endIndex, setEndIndex] = useState(25)

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

    // Fetch dogs search results
    const fetchDogs = async (filters?: DogFilters) => {
        // Fetch dogs based on the provided filters
        try {

            // Find the zip code based on latitude and longitude
            // const zipCode = await fetchZipCode(latitude, longitude);

            let queryString = '';
            if (filters) {
                const { breeds, zipCodes, ageMin, ageMax, sort, size, geoBoundingBox } = filters;
                const params = new URLSearchParams();
                if (breeds) params.append('breeds', breeds.join(','));
                if (zipCodes) params.append('zipCodes', zipCodes.join(','));
                if (ageMin) params.append('ageMin', ageMin.toString());
                if (ageMax) params.append('ageMax', ageMax.toString());
                if (sort) params.append('sort', sort.toString());
                if (size) params.append('size', size.toString());
                if (geoBoundingBox) {
                    params.append('geoBoundingBox', JSON.stringify(geoBoundingBox));
                }
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
                console.log(data, 'da');

                // code for pagination
                const nextPage = data.next;
                const nextFromValue = nextPage ? nextPage.match(/from=(\d+)/)[1] : null;
                setEndIndex(nextFromValue)

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

                const nextPage = data.next;
                const nextFromValue = nextPage ? nextPage.match(/from=(\d+)/)[1] : null;

                setEndIndex(nextFromValue)
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
                console.log(searchResults, 'locationsearch result');

            } else {
                console.error('Failed to search locations');
            }
        } catch (error) {
            console.error('Failed to search locations:', error);
        }
    };

    // Fetch zip code based on latitude and longitude
    const fetchZipCode = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(`${baseURL}/locations/search`, {
                method: 'POST',
                body: JSON.stringify({
                    geoBoundingBox: {
                        top: { lat: latitude, lon: longitude },
                        bottom: { lat: latitude, lon: longitude },
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data: { results: Location[]; total: number } = await response.json();
                if (data.total > 0) {
                    const zipCode = data.results[0].zip_code;
                    // Use the zip code for further processing
                    console.log(zipCode, 'zipcode');

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

    return (
        <DogSearchContext.Provider value={{ breeds, searchResults, favoriteDogs, fetchBreeds, fetchDogs, fetchLocations, searchLocations, toggleFavorite, allDogs, fetchNext, endIndex }}>
            {children}
        </DogSearchContext.Provider>
    );
};