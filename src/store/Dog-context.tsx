import React, { createContext, useState, useContext } from 'react';
import AuthContext from './Auth-context';


interface DogBreedsContextType {
    dogBreeds: string[];
    dogIds: number[];
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
    allDogs: Dog[],
    searchResults: Dog[];
    favoriteDogs: string[];
    fetchDogs: (filters?: DogFilters) => void;
    toggleFavorite: (dogId: string) => void;
}

export const DogSearchContext = createContext<DogSearchContextProps>({
    allDogs: [],
    searchResults: [],
    favoriteDogs: [],
    fetchDogs: () => { },
    toggleFavorite: () => { },
});


const baseURL = 'https://frontend-take-home-service.fetch.com';


// export function useDogBreeds() {
//     const context = useContext(DogBreedsContext);
//     if (!context) {
//         throw new Error('useDogBreeds must be used within a DogBreedsProvider');
//     }
//     return context;
// }

// export const DogSearchProvider: React.FC = ({ children }) => {
export function DogSearchProvider({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    const [searchResults, setSearchResults] = useState<Dog[]>([]);
    const [allDogs, setAllDogs] = useState<Dog[]>([]);

    const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [matchedDog, setMatchedDog] = useState<Match | null>(null);

    const fetchDogs = async (filters?: DogFilters) => {
        // Fetch dogs based on the provided filters
        try {
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




    return (
        <DogSearchContext.Provider value={{ searchResults, favoriteDogs, fetchDogs, toggleFavorite, allDogs }}>
            {children}
        </DogSearchContext.Provider>
    );
};