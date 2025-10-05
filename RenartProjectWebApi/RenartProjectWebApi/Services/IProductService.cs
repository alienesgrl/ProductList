using RenartProjectWebApi.Models;
using System.Net.NetworkInformation;

namespace RenartProjectWebApi.Services
{
    public interface IProductService
    {
        Task<List<Ring>> GetRingsAsync();
        Task<Ring?> GetRingByNameAsync(string name);
        Task<List<Ring>> GetPopularRingsAsync(double minPopularity = 0.8);
        Task<List<Ring>> GetFilteredRingsAsync(ProductFilter filter);
        Task<List<Ring>> GetRingsSortedByPopularityAsync();
        Task<List<Ring>> GetRingsSortedByPriceAsync();
    }
}
