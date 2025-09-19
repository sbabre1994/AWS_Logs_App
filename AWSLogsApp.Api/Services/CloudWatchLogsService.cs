using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;
using AWSLogsApp.Api.Models;
using System.Text.Json;

namespace AWSLogsApp.Api.Services
{
    public interface ICloudWatchLogsService
    {
        Task<LogQueryResponse> GetLogsAsync(LogQueryRequest request);
        Task<List<string>> GetLogGroupsAsync(string instanceId);
        Task<byte[]> ExportLogsAsync(ExportRequest request);
    }

    public class CloudWatchLogsService : ICloudWatchLogsService
    {
        private readonly IAmazonCloudWatchLogs _cloudWatchClient;
        private readonly ILogger<CloudWatchLogsService> _logger;

        public CloudWatchLogsService(IAmazonCloudWatchLogs cloudWatchClient, ILogger<CloudWatchLogsService> logger)
        {
            _cloudWatchClient = cloudWatchClient;
            _logger = logger;
        }

        public async Task<LogQueryResponse> GetLogsAsync(LogQueryRequest request)
        {
            try
            {
                var logGroups = await GetLogGroupsAsync(request.InstanceId);
                var allLogs = new List<LogEntry>();
                string? nextToken = request.NextToken;

                foreach (var logGroup in logGroups.Take(5)) // Limit to avoid rate limits
                {
                    var filterRequest = new FilterLogEventsRequest
                    {
                        LogGroupName = logGroup,
                        StartTime = request.StartTime.HasValue ? request.StartTime.Value.ToUniversalTime().Ticks / TimeSpan.TicksPerMillisecond : null,
                        EndTime = request.EndTime.HasValue ? request.EndTime.Value.ToUniversalTime().Ticks / TimeSpan.TicksPerMillisecond : null,
                        FilterPattern = request.SearchKeyword,
                        Limit = request.PageSize,
                        NextToken = nextToken
                    };

                    var response = await _cloudWatchClient.FilterLogEventsAsync(filterRequest);
                    
                    foreach (var logEvent in response.Events)
                    {
                        var logEntry = new LogEntry
                        {
                            EventId = logEvent.EventId,
                            Timestamp = DateTimeOffset.FromUnixTimeMilliseconds(logEvent.Timestamp ?? 0).DateTime,
                            Message = logEvent.Message,
                            LogGroup = logGroup,
                            LogStream = logEvent.LogStreamName,
                            IngestionTime = logEvent.IngestionTime ?? 0,
                            LogLevel = ExtractLogLevel(logEvent.Message)
                        };

                        // Filter by log level if specified
                        if (string.IsNullOrEmpty(request.LogLevel) || 
                            logEntry.LogLevel.Equals(request.LogLevel, StringComparison.OrdinalIgnoreCase))
                        {
                            allLogs.Add(logEntry);
                        }
                    }

                    nextToken = response.NextToken;
                }

                // Sort by timestamp descending
                allLogs = allLogs.OrderByDescending(l => l.Timestamp).Take(request.PageSize).ToList();

                return new LogQueryResponse
                {
                    Logs = allLogs,
                    NextToken = nextToken,
                    HasMoreData = !string.IsNullOrEmpty(nextToken),
                    TotalCount = allLogs.Count
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving logs for instance {InstanceId}", request.InstanceId);
                return new LogQueryResponse
                {
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<List<string>> GetLogGroupsAsync(string instanceId)
        {
            try
            {
                var logGroups = new List<string>();
                string? nextToken = null;

                do
                {
                    var request = new DescribeLogGroupsRequest
                    {
                        LogGroupNamePrefix = "/aws/ec2/",
                        Limit = 50,
                        NextToken = nextToken
                    };

                    var response = await _cloudWatchClient.DescribeLogGroupsAsync(request);
                    
                    // Filter log groups that might be related to the instance
                    var instanceLogGroups = response.LogGroups
                        .Where(lg => lg.LogGroupName.Contains(instanceId, StringComparison.OrdinalIgnoreCase) ||
                                   lg.LogGroupName.Contains("/aws/ec2/") ||
                                   lg.LogGroupName.Contains("/var/log/"))
                        .Select(lg => lg.LogGroupName)
                        .ToList();

                    logGroups.AddRange(instanceLogGroups);
                    nextToken = response.NextToken;

                } while (!string.IsNullOrEmpty(nextToken));

                // If no specific instance log groups found, return common EC2 log groups
                if (!logGroups.Any())
                {
                    logGroups.AddRange(new[]
                    {
                        "/aws/ec2/messages",
                        "/aws/ec2/secure",
                        "/aws/ec2/boot.log",
                        "/aws/ec2/cloud-init.log",
                        "/aws/ec2/cloud-init-output.log"
                    });
                }

                return logGroups;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving log groups for instance {InstanceId}", instanceId);
                return new List<string>();
            }
        }

        public async Task<byte[]> ExportLogsAsync(ExportRequest request)
        {
            try
            {
                var logQueryRequest = new LogQueryRequest
                {
                    InstanceId = request.InstanceId,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime,
                    LogLevel = request.LogLevel,
                    SearchKeyword = request.SearchKeyword,
                    PageSize = 1000 // Get more logs for export
                };

                var logResponse = await GetLogsAsync(logQueryRequest);

                return request.Format switch
                {
                    ExportFormat.CSV => ExportToCsv(logResponse.Logs),
                    ExportFormat.JSON => ExportToJson(logResponse.Logs),
                    ExportFormat.TXT => ExportToText(logResponse.Logs),
                    _ => throw new ArgumentException("Invalid export format")
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting logs for instance {InstanceId}", request.InstanceId);
                throw;
            }
        }

        private string ExtractLogLevel(string message)
        {
            if (string.IsNullOrEmpty(message))
                return "INFO";

            var upperMessage = message.ToUpper();
            
            if (upperMessage.Contains("ERROR") || upperMessage.Contains("ERR"))
                return "ERROR";
            if (upperMessage.Contains("WARN") || upperMessage.Contains("WARNING"))
                return "WARN";
            if (upperMessage.Contains("DEBUG"))
                return "DEBUG";
            if (upperMessage.Contains("TRACE"))
                return "TRACE";
            if (upperMessage.Contains("FATAL"))
                return "FATAL";
            
            return "INFO";
        }

        private byte[] ExportToCsv(List<LogEntry> logs)
        {
            var csv = "Timestamp,LogLevel,LogGroup,LogStream,Message\n";
            foreach (var log in logs)
            {
                csv += $"\"{log.Timestamp:yyyy-MM-dd HH:mm:ss}\",\"{log.LogLevel}\",\"{log.LogGroup}\",\"{log.LogStream}\",\"{log.Message.Replace("\"", "\"\"")}\"\n";
            }
            return System.Text.Encoding.UTF8.GetBytes(csv);
        }

        private byte[] ExportToJson(List<LogEntry> logs)
        {
            var json = JsonSerializer.Serialize(logs, new JsonSerializerOptions { WriteIndented = true });
            return System.Text.Encoding.UTF8.GetBytes(json);
        }

        private byte[] ExportToText(List<LogEntry> logs)
        {
            var text = string.Join("\n", logs.Select(log => 
                $"[{log.Timestamp:yyyy-MM-dd HH:mm:ss}] [{log.LogLevel}] {log.LogGroup}/{log.LogStream}: {log.Message}"));
            return System.Text.Encoding.UTF8.GetBytes(text);
        }
    }
}