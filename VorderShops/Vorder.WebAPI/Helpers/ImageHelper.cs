using Vorder.Domain.Constants;

namespace Vorder.WebAPI.Helpers
{
    public class ImageHelper
    {

        public static async Task<string> SaveImageAsync(IFormFile? img)
        {
            if(img == null || img.Length == 0)
                return string.Empty;

            if (!IsImage(img))
                throw new InvalidDataException("Invalid image file.");

            var uploadsFolder = Path.Combine(PictureConstants.DefaultShopPath);
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(img.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await img.CopyToAsync(stream);
            }

            return fileName;
        }

        public static void DeleteImage(string? fileName)
        {
            if(string.IsNullOrWhiteSpace(fileName))
                return;
            var uploadsFolder = Path.Combine(PictureConstants.DefaultShopPath);
            var filePath = Path.Combine(uploadsFolder, fileName);
            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        private static bool IsImage(IFormFile file)
        {
            byte[] header = new byte[8];
            using (var stream = file.OpenReadStream())
            {
                int totalRead = 0;
                while (totalRead < header.Length)
                {
                    int bytesRead = stream.Read(header, totalRead, header.Length - totalRead);
                    if (bytesRead == 0)
                        break;
                    totalRead += bytesRead;
                }
            }

            // JPEG: FF D8
            if (header[0] == 0xFF && header[1] == 0xD8)
                return true;

            // PNG: 89 50 4E 47 0D 0A 1A 0A
            if (header[0] == 0x89 && header[1] == 0x50 &&
                header[2] == 0x4E && header[3] == 0x47)
                return true;

            // GIF: 47 49 46 38
            if (header[0] == 0x47 && header[1] == 0x49 &&
                header[2] == 0x46 && header[3] == 0x38)
                return true;

            // BMP: 42 4D
            if (header[0] == 0x42 && header[1] == 0x4D)
                return true;

            return false;
        }
    }
}
