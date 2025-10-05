using Microsoft.AspNetCore.Mvc;
using RenartProjectWebApi.Models;
using RenartProjectWebApi.Services;
using System.Net.NetworkInformation;

namespace RenartProjectWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;


        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Ring>>> GetRings()
        {
            var rings = await _productService.GetRingsAsync();
            return Ok(rings);
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<Ring>> GetRing(string name)
        {
            var ring = await _productService.GetRingByNameAsync(name);

            if (ring == null)
                return NotFound();

            return Ok(ring);
        }

        [HttpGet("popular")]
        public async Task<ActionResult<List<Ring>>> GetPopularRings([FromQuery] double minPopularity = 0.8)
        {
            var rings = await _productService.GetPopularRingsAsync(minPopularity);
            return Ok(rings);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<List<Ring>>> GetFilteredRings(
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] double? minPopularity = null,
            [FromQuery] double? maxPopularity = null)
        {
            var filter = new ProductFilter
            {
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                MinPopularity = minPopularity,
                MaxPopularity = maxPopularity
            };

            var rings = await _productService.GetFilteredRingsAsync(filter);
            return Ok(rings);
        }

        [HttpGet("sorted/popularity")]
        public async Task<ActionResult<List<Ring>>> GetRingsSortedByPopularity()
        {
            var rings = await _productService.GetRingsSortedByPopularityAsync();
            return Ok(rings);
        }

        [HttpGet("sorted/price")]
        public async Task<ActionResult<List<Ring>>> GetRingsSortedByPrice()
        {
            var rings = await _productService.GetRingsSortedByPriceAsync();
            return Ok(rings);
        }

        [HttpGet("gold-price")]
        public async Task<ActionResult<decimal>> GetCurrentGoldPrice()
        {
            var goldPriceService = HttpContext.RequestServices.GetRequiredService<IGoldPriceService>();
            var goldPrice = await goldPriceService.GetCurrentGoldPriceAsync();
            return Ok(goldPrice);
        }

    }
}

