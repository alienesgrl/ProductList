using RenartProjectWebApi.Models;
using System.Net.NetworkInformation;
using System.Text.Json;

namespace RenartProjectWebApi.Services
{
    public class ProductService : IProductService
    {
        private readonly IGoldPriceService _goldPriceService;

        public ProductService(IGoldPriceService goldPriceService)
        {
            _goldPriceService = goldPriceService;
        }

        public async Task<List<Ring>> GetRingsAsync()
        {
            var rings = await LoadRingsFromJsonAsync();
            await CalculatePricesAsync(rings);
            return rings;
        }

        public async Task<Ring?> GetRingByNameAsync(string name)
        {
            var rings = await GetRingsAsync();
            return rings.FirstOrDefault(r => r.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<List<Ring>> GetPopularRingsAsync(double minPopularity = 0.8)
        {
            var rings = await GetRingsAsync();
            return rings.Where(r => r.PopularityScore >= minPopularity).ToList();
        }

        public async Task<List<Ring>> GetFilteredRingsAsync(ProductFilter filter)
        {
            var rings = await GetRingsAsync();
            var filteredRings = rings.AsQueryable();

            if (filter.MinPrice.HasValue)
                filteredRings = filteredRings.Where(r => (decimal)r.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                filteredRings = filteredRings.Where(r => (decimal)r.Price <= filter.MaxPrice.Value);

            if (filter.MinPopularity.HasValue)
                filteredRings = filteredRings.Where(r => r.PopularityScore >= filter.MinPopularity.Value);

            if (filter.MaxPopularity.HasValue)
                filteredRings = filteredRings.Where(r => r.PopularityScore <= filter.MaxPopularity.Value);

            return filteredRings.ToList();
        }

        public async Task<List<Ring>> GetRingsSortedByPopularityAsync()
        {
            var rings = await GetRingsAsync();
            return rings.OrderByDescending(r => r.PopularityScore).ToList();
        }

        public async Task<List<Ring>> GetRingsSortedByPriceAsync()
        {
            var rings = await GetRingsAsync();
            return rings.OrderBy(r => r.Price).ToList();
        }

        private async Task<List<Ring>> LoadRingsFromJsonAsync()
        {
            try
            {
                string filePath;

                filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "products.json");

                Console.WriteLine($"Aranan dosya yolu: {filePath}");

                if (!File.Exists(filePath))
                {
                    Console.WriteLine("Dosya bulunamadı.");
                    return new List<Ring>();
                }

                var json = await File.ReadAllTextAsync(filePath);
                var rings = JsonSerializer.Deserialize<List<Ring>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return rings ?? new List<Ring>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata oluştu: {ex.Message}");
                return new List<Ring>();
            }
        }

        private async Task CalculatePricesAsync(List<Ring> rings)
        {
            var goldPrice = await _goldPriceService.GetCurrentGoldPriceAsync();

            foreach (var ring in rings)
            {
                // Price = (popularityScore + 1) * weight * goldPrice
                ring.Price = (ring.PopularityScore + 1) * ring.Weight * (double)goldPrice;

                // Popülerlik skorunu 5 üzerinden hesapla
                ring.PopularityScoreOutOf5 = Math.Round(ring.PopularityScore * 5, 1);
            }
        }
    }

}
