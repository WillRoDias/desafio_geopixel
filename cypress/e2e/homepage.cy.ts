describe('Weather App Tests', () => {
  const cityName = 'Taubaté';
  const encodedCityName = encodeURIComponent(cityName);
  const urlWeather = `https://api.hgbrasil.com/weather?format=json-cors&array_limit=4&fields=only_results,description,temp,condition_slug,city_name,moon_phase,forecast,max,min,date,rain_probability&key=SUA-CHAVE&city_name=${encodedCityName}`

  const mockWeatherData = {
    city_name: cityName,
    date: '09/10/2024',
    temp: 25,
    description: 'Ensolarado',
    condition_slug: 'clear_day',
    moon_phase: 'full',
    forecast: [
      { date: '10/09', max: 32, min: 18, description: 'Ensolarado', rain_probability: 10 },
      { date: '10/10', max: 30, min: 20, description: 'Ensolarado', rain_probability: 10 },
      { date: '10/11', max: 28, min: 19, description: 'Parcialmente nublado', rain_probability: 20 },
      { date: '10/12', max: 27, min: 18, description: 'Nublado', rain_probability: 30 },
    ],
  };

  const expectedCityAndDate = [
    cityName,
    mockWeatherData.date,
  ]

  const expectedCurrentWeatherData = [
    `${mockWeatherData.temp}°C - ${mockWeatherData.description}`,
    `Máxima de ${mockWeatherData.forecast[0].max}°C`,
    `Mínima de ${mockWeatherData.forecast[0].min}°C`,
    `Probabilidade de chuva: ${mockWeatherData.forecast[0].rain_probability}%`,
  ];

  beforeEach(() => {
    cy.intercept('GET', urlWeather, {
      statusCode: 200,
      body: mockWeatherData,
    }).as('getWeather');

    cy.visit('http://localhost:5173/');
  });

  describe('Test error in the search', () => {
    it('Throw a error message when no city is searched', () => {
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('Erro ao buscar dados')) {
          return false;
        }
        return true;
      });

      cy.get('form').contains('Consultar').click();
      cy.get('p').contains('Erro ao buscar dados, verifique a cidade buscada');
    });
  })

  describe('Search city correctly', () => {
    it('Search for a city and displays weather data', () => {
      cy.get('input[name="city"]').type(cityName);
      cy.get('form').contains('Consultar').click();
      cy.wait('@getWeather');

      const cityAndDate = cy.get('.weather__date p')
      const currentWeatherData = cy.get('.weather__main-info p');

      cityAndDate.each(($p, index) => {
        cy.wrap($p).should('contain', expectedCityAndDate[index]);
      });

      currentWeatherData.each(($p, index) => {
        cy.wrap($p).should('contain', expectedCurrentWeatherData[index]);
      });

      cy.get('table tbody tr').should('have.length', mockWeatherData.forecast.length - 1);
      cy.get('table tbody tr').each(($el, index) => {
        const forecast = mockWeatherData.forecast[index + 1];

        const expectedTableValues = [
          forecast.date,
          `${forecast.max}°C`,
          `${forecast.min}°C`,
          forecast.description,
          '',
          `${forecast.rain_probability}%`,
        ];

        cy.wrap($el).find('td').each(($td, tdIndex) => {
          if (tdIndex !== 4) {
            cy.wrap($td).should('contain', expectedTableValues[tdIndex]);
          }
        });
      });
    });
  })
  describe('Search city by local cache', () => {
    const cities = ['São Paulo', 'Taubaté', 'Jacareí'];

    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('citiesArray', JSON.stringify(cities));
      });

      cy.wait(1000)

      cy.visit('http://localhost:5173/');
    });

    it('Select a city by city history', () => {
      cy.get('select').select('Jacareí');
      cy.get('select').should('have.value', 'Jacareí');
    })
  })
});
