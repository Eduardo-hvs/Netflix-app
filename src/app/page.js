'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); 

      try {
        const response = await fetch('https://api.tvmaze.com/show');
        const data = await response.json();

        
        if (data.length) { 
          setShows(data);
        } else if (data.hasOwnProperty('show')) { 
          setShows([data.show]);
        } else {
          throw new Error('Formato de resposta de API inesperado');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Falha ao carregar programas. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredShows = shows.filter((show) =>
    show.name && show.name.toLowerCase().includes(searchTerm)
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black ">
      {isLoading && <p className="text-white">Carregando Filmes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Procurar"
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        value={searchTerm}
        onChange={handleSearchChange}/>
      <div className="flex flex-row flex-wrap justify-around gap-10 py-8">
        {filteredShows.map((show) => (
          <div key={show.id} className="flex flex-col gap-y-4 ">
            <h2 className="py-5  text-white font-bold text-xl rounded-xl text-center">
              {show.name}
            </h2>
            <img src={show.image && show.image.original} alt={show.name}style={{ width: '300px', height: '450px' }} className="rounded-lg" />
            <p className="text-white text-center font-bold text-base">
              {show.genres && show.genres.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
