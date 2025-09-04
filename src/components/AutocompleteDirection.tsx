import { useEffect, useState } from 'react';
import { autocomplete } from '../api/AddresApi';
import { useUser } from '../context/UserContext';
import type { IStop } from '../interface/Stop';
import type { ISell } from '../interface/Sell';

interface AutoCompleteProps {
    handleSelect: (placeId: string) => Promise<void>;
    data: IStop | ISell | undefined | null;
    setData: React.Dispatch<React.SetStateAction<IStop | ISell | undefined | null>>;
    blockAutocomplete: boolean;
    setBlockAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    suggestions: Suggestion[];
    isEdit: boolean;
}
type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};

const AutocompleteDirection: React.FC<AutoCompleteProps> =
    ({ handleSelect, data, setData, blockAutocomplete,
        setBlockAutocomplete, setSuggestions, suggestions, isEdit }) => {
        const { token } = useUser();
        const [isEditingAddress, setIsEditingAddress] = useState(false);

        useEffect(() => {
            const fetchSuggestions = async () => {
                if (blockAutocomplete) {
                    setBlockAutocomplete(false);
                    return;
                }
                if (!isEditingAddress || !data?.addres || data.addres.length < 3) return; // evita llamadas innecesarias

                try {
                    if (data?.addres) {
                        const { data: dt } = await autocomplete(data.addres, token);
                        const suggestions = dt.data.suggestions;
                        if (!suggestions) {
                            setSuggestions([]);
                        } else {
                            setSuggestions(suggestions);
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener sugerencias:', error);
                }
            };
            fetchSuggestions();
        }, [data?.addres, isEditingAddress])

        return (
            <div >
                <input
                    type="text"
                    value={data?.addres}
                    readOnly={!isEdit}
                    onChange={(e) => {
                        setData({ ...data, addres: e.target.value })
                        setIsEditingAddress(true);
                    }}
                    placeholder="Buscar dirección..."
                    className='w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                {suggestions.length > 0 && (
                    <ul className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
                        {suggestions.map((s) => (
                            <li
                                key={s.placePrediction.placeId}
                                onClick={() => handleSelect(s.placePrediction.placeId)}
                                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-none"
                            >
                                {s.placePrediction.text.text}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }

export default AutocompleteDirection