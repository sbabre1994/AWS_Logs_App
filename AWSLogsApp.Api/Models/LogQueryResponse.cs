namespace AWSLogsApp.Api.Models
{
    public class LogQueryResponse
    {
        public List<LogEntry> Logs { get; set; } = new();
        public string? NextToken { get; set; }
        public bool HasMoreData { get; set; }
        public int TotalCount { get; set; }
        public string? ErrorMessage { get; set; }
    }
}