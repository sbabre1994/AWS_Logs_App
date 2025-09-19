namespace AWSLogsApp.Api.Models
{
    public class LogEntry
    {
        public string EventId { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Message { get; set; } = string.Empty;
        public string LogLevel { get; set; } = string.Empty;
        public string LogGroup { get; set; } = string.Empty;
        public string LogStream { get; set; } = string.Empty;
        public long IngestionTime { get; set; }
        public Dictionary<string, object> AdditionalData { get; set; } = new();
    }
}