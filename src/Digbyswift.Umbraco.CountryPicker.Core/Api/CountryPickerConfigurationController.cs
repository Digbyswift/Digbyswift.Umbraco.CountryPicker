using Digbyswift.Umbraco.CountryPicker.Core.Api.Models;
using Digbyswift.Umbraco.CountryPicker.Core.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Api.Management.Controllers;

namespace Digbyswift.Umbraco.CountryPicker.Core.Api;

[ApiController]
[Route("umbraco/management/api/v1/digbyswift/country-picker")]
public sealed class CountryPickerConfigurationController : ManagementApiControllerBase
{
    private readonly CountryPickerOptions _options;

    public CountryPickerConfigurationController(IOptions<CountryPickerOptions> options)
    {
        _options = options.Value;
    }

    [HttpGet("configuration")]
    [ProducesResponseType(typeof(CountryPickerConfigurationResponse), StatusCodes.Status200OK)]
    public IActionResult GetConfiguration()
    {
        return Ok(new CountryPickerConfigurationResponse
        {
            FlagBasePath = _options.FlagBasePath.TrimEnd('/')
        });
    }
}
