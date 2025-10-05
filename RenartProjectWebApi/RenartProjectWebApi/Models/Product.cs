namespace RenartProjectWebApi.Models
{
    public class Ring
    {
        public string Name { get; set; } = string.Empty;
        public double PopularityScore { get; set; }
        public double Weight { get; set; }
        public RingImages Images { get; set; } = new();
        public double Price { get; set; } 
        public double PopularityScoreOutOf5 { get; set; }
    }

    public class RingImages
    {
        public string Yellow { get; set; } = string.Empty;
        public string Rose { get; set; } = string.Empty;
        public string White { get; set; } = string.Empty;
    }

    public class GoldPriceResponse
    {
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }

    public class ProductFilter
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public double? MinPopularity { get; set; }
        public double? MaxPopularity { get; set; }
    }
}
