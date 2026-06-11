using Digbyswift.Umbraco.CountryPicker.Configuration;
using Digbyswift.Umbraco.CountryPicker.Services;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Infrastructure.Manifest;

namespace Digbyswift.Umbraco.CountryPicker.Composing;

public sealed class CountryPickerComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.Configure<CountryPickerOptions>(
            builder.Config.GetSection(CountryPickerOptions.SectionName));

        builder.Services
            .AddSingleton<ICountryProvider, CountryProvider>()
            .AddSingleton<IPackageManifestReader, PackageManifestReader>();
    }
}
