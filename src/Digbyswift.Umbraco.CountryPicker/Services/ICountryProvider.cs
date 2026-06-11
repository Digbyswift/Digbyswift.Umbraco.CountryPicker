using Digbyswift.Umbraco.CountryPicker.Models;

namespace Digbyswift.Umbraco.CountryPicker.Services;

public interface ICountryProvider
{
    Country? GetByCode(string code);

    IReadOnlyCollection<Country> GetAll();
}
