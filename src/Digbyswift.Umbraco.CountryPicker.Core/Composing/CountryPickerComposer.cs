using Digbyswift.Umbraco.CountryPicker.Core.Configuration;
using Digbyswift.Umbraco.CountryPicker.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Digbyswift.Umbraco.CountryPicker.Core.Composing;

public sealed class CountryPickerComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.Configure<CountryPickerOptions>(
            builder.Config.GetSection(CountryPickerOptions.SectionName));

        builder.Services.AddSingleton<ICountryProvider, CountryProvider>();
    }
}
