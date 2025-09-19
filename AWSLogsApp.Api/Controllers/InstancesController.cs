using Microsoft.AspNetCore.Mvc;
using AWSLogsApp.Api.Services;
using AWSLogsApp.Api.Models;

namespace AWSLogsApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstancesController : ControllerBase
    {
        private readonly IEC2Service _ec2Service;
        private readonly ILogger<InstancesController> _logger;

        public InstancesController(IEC2Service ec2Service, ILogger<InstancesController> logger)
        {
            _ec2Service = ec2Service;
            _logger = logger;
        }

        /// <summary>
        /// Get all EC2 instances
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<EC2Instance>>> GetInstances()
        {
            try
            {
                var instances = await _ec2Service.GetInstancesAsync();
                return Ok(instances);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving instances");
                return StatusCode(500, new { message = "Error retrieving instances", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific EC2 instance by ID
        /// </summary>
        [HttpGet("{instanceId}")]
        public async Task<ActionResult<EC2Instance>> GetInstance(string instanceId)
        {
            try
            {
                var instance = await _ec2Service.GetInstanceAsync(instanceId);
                if (instance == null)
                {
                    return NotFound(new { message = $"Instance {instanceId} not found" });
                }
                return Ok(instance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving instance {InstanceId}", instanceId);
                return StatusCode(500, new { message = "Error retrieving instance", error = ex.Message });
            }
        }
    }
}