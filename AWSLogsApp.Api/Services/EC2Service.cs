using Amazon.EC2;
using Amazon.EC2.Model;
using AWSLogsApp.Api.Models;

namespace AWSLogsApp.Api.Services
{
    public interface IEC2Service
    {
        Task<List<EC2Instance>> GetInstancesAsync();
        Task<EC2Instance?> GetInstanceAsync(string instanceId);
    }

    public class EC2Service : IEC2Service
    {
        private readonly IAmazonEC2 _ec2Client;
        private readonly ILogger<EC2Service> _logger;

        public EC2Service(IAmazonEC2 ec2Client, ILogger<EC2Service> logger)
        {
            _ec2Client = ec2Client;
            _logger = logger;
        }

        public async Task<List<EC2Instance>> GetInstancesAsync()
        {
            try
            {
                var request = new DescribeInstancesRequest();
                var response = await _ec2Client.DescribeInstancesAsync(request);

                var instances = new List<EC2Instance>();

                foreach (var reservation in response.Reservations)
                {
                    foreach (var instance in reservation.Instances)
                    {
                        var nameTag = instance.Tags?.FirstOrDefault(t => t.Key == "Name");
                        
                        instances.Add(new EC2Instance
                        {
                            InstanceId = instance.InstanceId,
                            Name = nameTag?.Value ?? instance.InstanceId,
                            State = instance.State.Name,
                            InstanceType = instance.InstanceType,
                            LaunchTime = instance.LaunchTime ?? DateTime.MinValue,
                            PrivateIpAddress = instance.PrivateIpAddress ?? string.Empty,
                            PublicIpAddress = instance.PublicIpAddress ?? string.Empty
                        });
                    }
                }

                return instances;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving EC2 instances");
                throw;
            }
        }

        public async Task<EC2Instance?> GetInstanceAsync(string instanceId)
        {
            try
            {
                var request = new DescribeInstancesRequest
                {
                    InstanceIds = new List<string> { instanceId }
                };

                var response = await _ec2Client.DescribeInstancesAsync(request);
                var instance = response.Reservations.FirstOrDefault()?.Instances.FirstOrDefault();

                if (instance == null)
                    return null;

                var nameTag = instance.Tags?.FirstOrDefault(t => t.Key == "Name");

                return new EC2Instance
                {
                    InstanceId = instance.InstanceId,
                    Name = nameTag?.Value ?? instance.InstanceId,
                    State = instance.State.Name,
                    InstanceType = instance.InstanceType,
                    LaunchTime = instance.LaunchTime ?? DateTime.MinValue,
                    PrivateIpAddress = instance.PrivateIpAddress ?? string.Empty,
                    PublicIpAddress = instance.PublicIpAddress ?? string.Empty
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving EC2 instance {InstanceId}", instanceId);
                throw;
            }
        }
    }
}