using System.Text.Json;

namespace RenartProjectWebApi.Services
{
        public class GoldPriceService : IGoldPriceService
        {
            private readonly HttpClient _httpClient;
            private readonly IConfiguration _configuration;

            public GoldPriceService(HttpClient httpClient, IConfiguration configuration)
            {
                _httpClient = httpClient;
                _configuration = configuration;

                _httpClient.BaseAddress = new Uri("https://api.metalpriceapi.com/v1/");
                _httpClient.DefaultRequestHeaders.Add("User-Agent", "ProductApp/1.0");
            }

            public async Task<decimal> GetCurrentGoldPriceAsync()
            {
                try
                {
                    var apiKey = _configuration["GoldPriceApi:ApiKey"] ?? "demo";
                    var url = $"latest?api_key={apiKey}&base=USD&currencies=XAU";

                    var response = await _httpClient.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        var goldData = JsonSerializer.Deserialize<GoldApiResponse>(content);

                        if (goldData?.Rates?.XAU != null)
                        {
                            decimal pricePerOunce = 1 / goldData.Rates.XAU;
                            decimal pricePerGram = pricePerOunce / 31.1035m;
                            return pricePerGram;
                        }
                    }

                    return 65.25m;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Gold price API error: {ex.Message}");
                    return 65.25m;
                }
            }

            private class GoldApiResponse
            {
                public bool Success { get; set; }
                public GoldRates Rates { get; set; } = new();
            }

            private class GoldRates
            {
                public decimal XAU { get; set; }
            }
        }
    }
