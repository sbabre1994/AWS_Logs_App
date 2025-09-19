using Microsoft.AspNetCore.Mvc;
using AWSLogsApp.Api.Services;
using AWSLogsApp.Api.Models;

namespace AWSLogsApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly ICloudWatchLogsService _logsService;
        private readonly ILogger<LogsController> _logger;

        public LogsController(ICloudWatchLogsService logsService, ILogger<LogsController> logger)
        {
            _logsService = logsService;
            _logger = logger;
        }

        /// <summary>
        /// Get logs for a specific instance
        /// </summary>
        [HttpPost("query")]
        public async Task<ActionResult<LogQueryResponse>> GetLogs([FromBody] LogQueryRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.InstanceId))
                {
                    return BadRequest(new { message = "InstanceId is required" });
                }

                var response = await _logsService.GetLogsAsync(request);
                
                if (!string.IsNullOrEmpty(response.ErrorMessage))
                {
                    return StatusCode(500, response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error querying logs for instance {InstanceId}", request.InstanceId);
                return StatusCode(500, new { message = "Error querying logs", error = ex.Message });
            }
        }

        /// <summary>
        /// Get log groups for a specific instance
        /// </summary>
        [HttpGet("groups/{instanceId}")]
        public async Task<ActionResult<List<string>>> GetLogGroups(string instanceId)
        {
            try
            {
                var logGroups = await _logsService.GetLogGroupsAsync(instanceId);
                return Ok(logGroups);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving log groups for instance {InstanceId}", instanceId);
                return StatusCode(500, new { message = "Error retrieving log groups", error = ex.Message });
            }
        }

        /// <summary>
        /// Export logs in the specified format
        /// </summary>
        [HttpPost("export")]
        public async Task<ActionResult> ExportLogs([FromBody] ExportRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.InstanceId))
                {
                    return BadRequest(new { message = "InstanceId is required" });
                }

                var data = await _logsService.ExportLogsAsync(request);
                
                var contentType = request.Format switch
                {
                    ExportFormat.CSV => "text/csv",
                    ExportFormat.JSON => "application/json",
                    ExportFormat.TXT => "text/plain",
                    _ => "application/octet-stream"
                };

                var fileName = $"logs_{request.InstanceId}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.{request.Format.ToString().ToLower()}";
                
                return File(data, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting logs for instance {InstanceId}", request.InstanceId);
                return StatusCode(500, new { message = "Error exporting logs", error = ex.Message });
            }
        }
    }
}