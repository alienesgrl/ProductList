namespace RenartProjectWebApi.Services
{
    public interface IGoldPriceService
    {
        Task<decimal> GetCurrentGoldPriceAsync();

    }
}
