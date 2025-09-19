namespace AWSLogsApp.Api.Models
{
    public class EC2Instance
    {
        public string InstanceId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string InstanceType { get; set; } = string.Empty;
        public DateTime LaunchTime { get; set; }
        public string PrivateIpAddress { get; set; } = string.Empty;
        public string PublicIpAddress { get; set; } = string.Empty;
    }
}