using Digbyswift.Umbraco.CountryPicker.Core.Models;

namespace Digbyswift.Umbraco.CountryPicker.Core.Services;

public interface ICountryProvider
{
    Country? GetByCode(string code);

    IReadOnlyCollection<Country> GetAll();
}
