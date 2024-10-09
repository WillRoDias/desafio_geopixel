<template>
  <div class="sidebar">
    <div class="sidebar__search">
      <form
        v-on:submit.prevent="onSubmit"
        class="sidebar__search-form"
      >
        <input
          v-model="city"
          class="sidebar__search-form__input"
          name="city"
          placeholder="Digite cidade"
          type="text">
        <button class="sidebar__search-form__button">Consultar</button>
      </form>

      <select
        v-model="city"
        @change="onSubmit()"
        class="sidebar__search-city-list"
      >
        <option
          disabled
          selected
          value=""
        >
          Histórico de busca
        </option>
        <option v-for="city in citiesArray">{{ city }}</option>
      </select>

      <p>{{ errors }}</p>
    </div>

    <div
      v-if="weatherData.city_name && !errors"
      class="weather"
    >
      <div class="weather__date">
        <p>{{ useStoreData.cityName }}</p>
        <p>{{ weatherData.date }}</p>
      </div>

      <div class="weather__main-info">
        <img
          class="weather__icon"
          :src="`https://assets.hgbrasil.com/weather/icons/conditions/${weatherData.condition_slug}.svg`"
        />
        <div>
          <p>{{ weatherData.temp }}°C - {{ weatherData.description }}</p>
          <p>Máxima de {{ weatherData.forecast[0].max }}°C</p>
          <p>Mínima de {{ weatherData.forecast[0].min }}°C</p>
          <p>Probabilidade de chuva: {{ weatherData.forecast[0].rain_probability }}%</p>
        </div>
      </div>

      <div class="weather__moon">
        <img
          class="weather__icon-mini"
          :src="`https://assets.hgbrasil.com/weather/icons/moon/${weatherData.moon_phase}.png`"
        />
          {{ translate(weatherData.moon_phase) }}
      </div>
    </div>

    <div v-if="weatherData.city_name && !errors">
      <h2>Próximos 3 dias</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Máxima</th>
            <th>Mínima</th>
            <th>Clima</th>
            <th></th>
            <th>Precipitação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="forecast in weatherData.forecast.slice(1)">
            <td>{{ forecast.date }}</td>
            <td>{{ forecast.max }}°C</td>
            <td>{{ forecast.min }}°C</td>
            <td>{{ forecast.description }}</td>
            <td>
              <img
                class="weather__icon-mini"
                :src="`https://assets.hgbrasil.com/weather/icons/conditions/${weatherData.condition_slug}.svg`"
              />
            </td>
            <td>{{ forecast.rain_probability }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useStoreData } from '../stores/storedata.ts'
  import translations from '../assets/translations.json'

  interface weatherForecast {
    date: string;
    description: string;
    max: number;
    min: number;
    rain_probability: number;
  }

  interface weatherData {
    city_name: string;
    date: string;
    temp: number;
    forecast: weatherForecast[];
    description: string;
    moon_phase: string;
    condition_slug: string;
  }

  const translate = (key: string) => {
    return translations[key as keyof typeof translations] || key;
  };

  const openweathermap_api_key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

  const city = ref<string>('');
  const errors = ref<string>('');
  const weatherData = ref<weatherData>({
    city_name: '',
    date: '',
    temp: 0,
    forecast: [],
    description: '',
    moon_phase: '',
    condition_slug: ''
  });

  const citiesArray = ref(JSON.parse(localStorage.getItem('citiesArray') || '[]'))

  async function onSubmit() {
  errors.value = '';

  await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${openweathermap_api_key}`)
      .then((response) => {
        if (!response.ok) {
          errors.value = 'Erro ao buscar dados, verifique a cidade buscada';
          throw new Error('Erro ao buscar dados, verifique a cidade buscada');
        }
        return response.json();
      })
      .then((data) => {
        const coordArray = Object.values(data.coord) as number[];
        const cityName = data.name as string;

        useStoreData.cityName = cityName;
        useStoreData.cityCoord = coordArray;

        if (!citiesArray.value.includes(cityName)) {
          citiesArray.value.push(cityName);
        }

        localStorage.setItem('citiesArray', JSON.stringify(citiesArray.value));
      }),

    fetch(`https://api.hgbrasil.com/weather?format=json-cors&array_limit=4&fields=only_results,description,temp,condition_slug,city_name,moon_phase,forecast,max,min,date,rain_probability&key=SUA-CHAVE&city_name=${city.value}`)
      .then((response) => {
        if (!response.ok) {
          errors.value = 'Erro ao buscar dados, verifique a cidade buscada';
          throw new Error('Erro ao buscar dados, verifique a cidade buscada');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        weatherData.value = data;
      })
  ]);
}

</script>

<style scoped lang="scss">
  .sidebar {
    background-color: white;
    border: 1px solid darkgray;
    border-radius: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 40px 60px;
    padding: 20px;
    row-gap: 20px;
    width: 490px;

    @media (max-width: 600px) {
      border: none;
      border-radius: 0;
      margin: 0;
      margin-top: 90px;
      row-gap: 0;
      width: 100vw;
    }
  }

  .sidebar__search {
    display: flex;
    flex-direction: column;
    row-gap: 20px;

    @media (max-width: 600px) {
      row-gap: 10px;
    }
  }

  .sidebar__search-form {
    column-gap: 20px;
    display: flex;
    height: 40px;
    justify-content: space-between;
  }

  .sidebar__search-form__input {
    border: 1px solid lightblue;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
  }

  .sidebar__search-form__button {
    background-color: lightblue;
    border: 1px solid lightblue;
    border-radius: 5px;
  }

  .sidebar__search-form__button:hover {
    background-color: white;
    cursor: pointer;
  }


  .sidebar__search-city-list {
    background-color: white;
    border: 1px solid lightblue;
    border-radius: 5px;
    height: 40px;
  }

  td, th, tr {
    justify-content: center;
    padding: 5px;
    text-align: center;

    @media (max-width: 600px) {
      padding: 0;
    }
  }

  .weather {
    display: grid;
  }

  .weather__date {
    display: flex;
    justify-content: space-between;
  }

  .weather__main-info {
    align-items: center;
    display: flex;
  }

  .weather__icon {
    height: 100px;
  }

  .weather__moon {
    align-items: center;
    display: flex;
  }

  .weather__icon-mini {
    height: 30px;
  }
</style>
