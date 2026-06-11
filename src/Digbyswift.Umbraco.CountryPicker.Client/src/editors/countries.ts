import type { Country } from './country.model';

const excludedRegionCodes = new Set([
    'AC', // Ascension Island
    'AN', // Curaçao
    'BU', // Myanmar (Burma)
    'CQ', // Sark
    'CS', // Serbia
    'CT', // Kiribati
    'DD', // Germany
    'DY', // Benin
    'EA', // Ceuta & Melilla
    'EU', // European Union
    'EZ', // Eurozone
    'FQ', // Antarctica
    'FX', // France
    'HV', // Burkina Faso
    'JT', // US Outlying Islands
    'MI', // US Outlying Islands
    'NH', // Vanuatu
    'NQ', // Antarctica
    'NT', // Saudi Arabia
    'PU', // US Outlying Islands
    'PZ', // Panama
    'QO', // Outlying Oceania
    'QU', // European Union
    'RH', // Zimbabwe
    'SU', // Russia
    'TA', // Tristan da Cunha
    'TP', // Timor-Leste
    'UK', // United Kingdom
    'UN', // United Nations
    'VD', // Vietnam
    'WK', // US Outlying Islands
    'XA', // Pseudo-Accents
    'XB', // Pseudo-Bidi
    'YD', // Yemen
    'YU', // Serbia
    'ZR', // Congo - Kinshasa
    'ZZ', // Unknown Region
]);

const countryName = new Intl.DisplayNames(['en'], { type: 'region' });

export const countries: Country[] = Array.from({ length: 26 * 26 }, (_, index) => {
    const firstCharacter = String.fromCharCode(65 + Math.floor(index / 26));
    const secondCharacter = String.fromCharCode(65 + index % 26);
    const code = `${firstCharacter}${secondCharacter}`;
    const name = countryName.of(code);

    return name && name !== code && !excludedRegionCodes.has(code)
        ? { code, name }
        : null;
})
    .filter((country): country is Country => country !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
