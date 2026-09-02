namespace Vorder.Application.DTOs.ReviewDtos
{
    public class CreateReviewDto
    {
        public Guid ProductId { get; set; }
        public string? CustomerReview { get; set; }
        public int Rating { get; set; }
    }

    public class ResponseReviewDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string? CustomerReview { get; set; }
        public int Rating { get; set; }
        public string UserFullName { get; set; }
    }
}
