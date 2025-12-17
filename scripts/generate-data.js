import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POKEMON_NAMES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv";
const ALL_POKEMON_URL = "https://pokeapi.co/api/v2/pokemon?limit=10000";

// db json 파일 생성
async function generatePokemonData() {
  try {
    const { data: pokemonRes } = await axios.get(ALL_POKEMON_URL);
    const results = pokemonRes.results;

    const { data: csvData } = await axios.get(POKEMON_NAMES_CSV_URL);
    const rows = csvData.split('\n');

    const koNameMap = {};
    rows.forEach(row => {
      const cols = row.split(',');
      if (cols[1] === '3') {
        const id = cols[0];
        const name = cols[2];
        koNameMap[id] = name;
      }
    });

    const mergedData = results.map((pokemon) => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      return {
        id,
        enName: pokemon.name,
        koName: koNameMap[id] || pokemon.name,
        url: pokemon.url
      };
    });

    const outputPath = path.resolve(__dirname, '../src/assets/json/pokeDB.json');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf-8');
    console.log("데이터 생성 완료" + `\n${mergedData.length} 개의 포켓몬 도감 생성`);
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

generatePokemonData();
