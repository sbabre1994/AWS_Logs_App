namespace AWSLogsApp.Api.Models
{
    public class LogQueryRequest
    {
        public string InstanceId { get; set; } = string.Empty;
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? LogLevel { get; set; }
        public string? SearchKeyword { get; set; }
        public int PageSize { get; set; } = 100;
        public string? NextToken { get; set; }
        public bool IsLiveMode { get; set; } = false;
    }
}