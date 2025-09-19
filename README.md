# AWS CloudWatch Log Management Application

A full-stack web application for managing and monitoring AWS CloudWatch logs from EC2 instances, built with ASP.NET Core backend and React frontend with Chakra UI.

## Features

### Backend (ASP.NET Core Web API)
- **EC2 Instance Discovery**: Automatically discover and list EC2 instances
- **CloudWatch Logs Integration**: Retrieve logs from CloudWatch log groups
- **Log Filtering**: Filter logs by date range, log level, and keywords
- **Export Functionality**: Export logs in CSV, JSON, and TXT formats
- **Error Handling**: Comprehensive error handling for AWS connectivity issues
- **CORS Support**: Configured for React frontend communication

### Frontend (React with Chakra UI)
- **Modern UI**: Responsive design using Chakra UI components
- **Instance Selection**: Dropdown to select EC2 instances with status indicators
- **Log Controls**: 
  - Date/time range filtering
  - Log level filtering
  - Keyword search
  - Manual and auto-refresh modes
  - Configurable page size
- **Log Display**: 
  - Card view with expandable details
  - Table view for compact display
  - Syntax highlighting for log messages
  - Color-coded log levels with emoji indicators
- **Export Options**: Download logs in multiple formats
- **Real-time Updates**: Live mode for continuous log monitoring

## Project Structure

```
AWS_Logs_App/
├── AWSLogsApp.Api/                 # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── InstancesController.cs  # EC2 instance endpoints
│   │   └── LogsController.cs       # Log management endpoints
│   ├── Models/                     # Data models
│   ├── Services/                   # Business logic services
│   │   ├── EC2Service.cs          # EC2 instance discovery
│   │   └── CloudWatchLogsService.cs # Log retrieval and processing
│   └── Program.cs                  # Application configuration
├── frontend/                       # React application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── AWSLogsApp.tsx     # Main application component
│   │   │   ├── InstanceSelector.tsx # EC2 instance selection
│   │   │   ├── LogControls.tsx    # Log filtering and controls
│   │   │   └── LogDisplay.tsx     # Log visualization
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API service layer
│   │   └── types/                 # TypeScript type definitions
│   └── public/                    # Static assets
└── README.md                      # This file
```

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- AWS CLI configured with appropriate credentials
- AWS IAM permissions for:
  - EC2:DescribeInstances
  - CloudWatch Logs:DescribeLogGroups
  - CloudWatch Logs:FilterLogEvents

## Setup and Installation

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd AWSLogsApp.Api
   ```

2. Restore packages:
   ```bash
   dotnet restore
   ```

3. Configure AWS settings in `appsettings.json`:
   ```json
   {
     "AWS": {
       "Region": "us-east-1",
       "Profile": "default"
     }
   }
   ```

4. Build and run the API:
   ```bash
   dotnet build
   dotnet run
   ```

The API will be available at `https://localhost:5001` or `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000`.

## AWS Configuration

### Required IAM Permissions

Create an IAM policy with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogGroups",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
```

### AWS Credentials

Configure AWS credentials using one of these methods:

1. **AWS CLI**: Run `aws configure`
2. **Environment variables**: Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
3. **IAM Roles**: Use IAM roles if running on EC2
4. **AWS Profiles**: Configure profiles in `~/.aws/credentials`

## Usage

1. **Select Instance**: Choose an EC2 instance from the dropdown
2. **Configure Filters**: Set date ranges, log levels, and search terms
3. **View Logs**: Browse logs in card or table view
4. **Export Data**: Download logs in your preferred format
5. **Live Monitoring**: Enable auto-refresh for real-time log monitoring

## API Endpoints

### Instances
- `GET /api/instances` - List all EC2 instances
- `GET /api/instances/{id}` - Get specific instance details

### Logs
- `POST /api/logs/query` - Query logs with filters
- `GET /api/logs/groups/{instanceId}` - Get log groups for instance
- `POST /api/logs/export` - Export logs in specified format

## Development

### Building for Production

**Backend:**
```bash
cd AWSLogsApp.Api
dotnet publish -c Release
```

**Frontend:**
```bash
cd frontend
npm run build
```

### Testing

**Backend:**
```bash
cd AWSLogsApp.Api
dotnet test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Troubleshooting

### Common Issues

1. **AWS Credentials**: Ensure AWS credentials are properly configured
2. **CORS Errors**: Verify the backend CORS policy includes the frontend URL
3. **No Instances Found**: Check IAM permissions for EC2 access
4. **No Logs**: Verify CloudWatch Logs permissions and log group names

### Error Messages

- **"Failed to load instances"**: Check AWS credentials and EC2 permissions
- **"No logs found"**: Adjust filters or verify log groups exist
- **"Export failed"**: Check network connectivity and backend status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review AWS CloudWatch and EC2 documentation
3. Create an issue in the repository