namespace Vorder.Domain.Constants
{
    public static class PictureConstants
    {
        public static string DefaultShopPath =>
            Path.Combine(AppContext.BaseDirectory, "ShopImages");

        public const string DefaultRequestPath = "/shop-images";
    }
}