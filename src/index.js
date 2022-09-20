import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputSearch.addEventListener(
  'input',

  debounce(e => {
    let searchingLetters = inputSearch.value.trim();

    if (searchingLetters.length === 0) {
      clearCountries(countryInfoEl, countryListEl);
      return;
    }

    fetchCountries(searchingLetters)
      .then(data => {
        if (data.length === 1) {
          Notiflix.Notify.info(`We found entered country! ${searchingLetters}`);
          clearCountries(countryInfoEl, countryListEl);
          makeCountryInfo(data);
        } else if (data.length > 1 && data.length <= 9) {
          Notiflix.Notify.info('We found too much countries!');
          clearCountries(countryInfoEl, countryListEl);
          makeCountryList(data);
        } else {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          clearCountries(countryInfoEl, countryListEl);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearCountries(countryInfoEl, countryListEl);
      });
  }, DEBOUNCE_DELAY)
);

// Очистка полей стран
function clearCountries(x, y) {
  x.innerHTML = '';
  y.innerHTML = '';
}

// Создание разметки
function makeCountryInfo(countries) {
  const country = countries[0];
  const aboutCountry = `<div alt="flag">
            <img src=${country.flags.svg} width="100">
            <span>${country.name.official}</span>
            </div>
            <p><span>Capital:</span> ${country.capital}</p>
            <p><span>Population:</span> ${country.population}</p>
            <p><span>Languages:</span> ${Object.values(country.languages).join(
              ', '
            )}</p>`;

  countryInfoEl.insertAdjacentHTML('beforeend', aboutCountry);
  console.log('загружена информация о стране');
}

// Создание разметки
function makeCountryList(countries) {
  const countryList = countries.map(country => {
    return `<li class="country-list__item">
            <img src=${country.flags.png} width="80" alt="flag">
            <span>${country.name.official}</span>
        </li>`;
  });
  countryList.forEach(markupCountry => {
    countryListEl.insertAdjacentHTML('beforeend', markupCountry);
    console.log('загружена информация о странах');
  });
}
