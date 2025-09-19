namespace AWSLogsApp.Api.Models
{
    public class ExportRequest
    {
        public string InstanceId { get; set; } = string.Empty;
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? LogLevel { get; set; }
        public string? SearchKeyword { get; set; }
        public ExportFormat Format { get; set; } = ExportFormat.CSV;
    }

    public enum ExportFormat
    {
        CSV,
        TXT,
        JSON
    }
}