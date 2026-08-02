import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface AtlasCleanStackProps extends StackProps {
  stage: string;
  domainName?: string;
  certificateArn?: string;
}

export class AtlasCleanStack extends Stack {
  constructor(scope: Construct, id: string, props: AtlasCleanStackProps) {
    super(scope, id, props);

    const isProduction = props.stage === 'production';

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: isProduction ? 2 : 1,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'data',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      containerInsightsV2: ecs.ContainerInsights.ENABLED,
      enableFargateCapacityProviders: true,
    });

    const backendRepository = new ecr.Repository(this, 'BackendRepository', {
      repositoryName: `atlasclean-backend-${props.stage}`,
      imageScanOnPush: true,
      encryption: ecr.RepositoryEncryption.AES_256,
      lifecycleRules: [{ maxImageCount: 30 }],
      removalPolicy: isProduction ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    const jwtSecret = new secretsmanager.Secret(this, 'JwtSecret', {
      secretName: `atlasclean/${props.stage}/jwt-secret`,
      generateSecretString: {
        excludePunctuation: true,
      },
    });

    const jwtRefreshSecret = new secretsmanager.Secret(this, 'JwtRefreshSecret', {
      secretName: `atlasclean/${props.stage}/jwt-refresh-secret`,
      generateSecretString: {
        excludePunctuation: true,
      },
    });

    const dbCredentials = new rds.DatabaseSecret(this, 'DatabaseCredentials', {
      username: 'atlasclean',
      secretName: `atlasclean/${props.stage}/database`,
    });

    const backendLogGroup = new logs.LogGroup(this, 'BackendLogGroup', {
      logGroupName: `/atlasclean/${props.stage}/backend`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: isProduction ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    const databaseSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc,
      description: 'PostgreSQL access for AtlasClean services',
      allowAllOutbound: true,
    });

    const cacheSecurityGroup = new ec2.SecurityGroup(this, 'CacheSecurityGroup', {
      vpc,
      description: 'Redis access for AtlasClean services',
      allowAllOutbound: true,
    });

    const serviceSecurityGroup = new ec2.SecurityGroup(this, 'ServiceSecurityGroup', {
      vpc,
      description: 'Application service access',
      allowAllOutbound: true,
    });

    databaseSecurityGroup.addIngressRule(serviceSecurityGroup, ec2.Port.tcp(5432), 'Allow ECS service to PostgreSQL');
    cacheSecurityGroup.addIngressRule(serviceSecurityGroup, ec2.Port.tcp(6379), 'Allow ECS service to Redis');

    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_5 }),
      credentials: rds.Credentials.fromSecret(dbCredentials),
      databaseName: 'atlasclean',
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [databaseSecurityGroup],
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
      allocatedStorage: 100,
      maxAllocatedStorage: 500,
      storageEncrypted: true,
      backupRetention: Duration.days(isProduction ? 14 : 3),
      deletionProtection: isProduction,
      multiAz: isProduction,
      autoMinorVersionUpgrade: true,
      removalPolicy: isProduction ? RemovalPolicy.SNAPSHOT : RemovalPolicy.DESTROY,
      cloudwatchLogsExports: ['postgresql'],
      monitoringInterval: Duration.seconds(60),
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
      publiclyAccessible: false,
    });

    const cacheSubnetGroup = new elasticache.CfnSubnetGroup(this, 'CacheSubnetGroup', {
      description: 'AtlasClean cache subnet group',
      subnetIds: vpc.isolatedSubnets.map((subnet) => subnet.subnetId),
      cacheSubnetGroupName: `atlasclean-${props.stage}-cache-subnets`,
    });

    const cache = new elasticache.CfnReplicationGroup(this, 'Cache', {
      replicationGroupDescription: `AtlasClean Redis (${props.stage})`,
      replicationGroupId: `atlasclean-${props.stage}-redis`,
      engine: 'redis',
      engineVersion: '7.1',
      cacheNodeType: isProduction ? 'cache.t4g.small' : 'cache.t4g.micro',
      transitEncryptionEnabled: true,
      atRestEncryptionEnabled: true,
      automaticFailoverEnabled: isProduction,
      multiAzEnabled: isProduction,
      numCacheClusters: isProduction ? 2 : 1,
      cacheSubnetGroupName: cacheSubnetGroup.cacheSubnetGroupName,
      securityGroupIds: [cacheSecurityGroup.securityGroupId],
      port: 6379,
    });
    cache.addDependency(cacheSubnetGroup);

    const taskExecutionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
    });
    jwtSecret.grantRead(taskExecutionRole);
    jwtRefreshSecret.grantRead(taskExecutionRole);
    dbCredentials.grantRead(taskExecutionRole);

    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    jwtSecret.grantRead(taskRole);
    jwtRefreshSecret.grantRead(taskRole);
    dbCredentials.grantRead(taskRole);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      cpu: isProduction ? 1024 : 512,
      memoryLimitMiB: isProduction ? 2048 : 1024,
      executionRole: taskExecutionRole,
      taskRole,
    });

    taskDefinition.addContainer('BackendContainer', {
      image: ecs.ContainerImage.fromEcrRepository(backendRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ logGroup: backendLogGroup, streamPrefix: 'backend' }),
      portMappings: [{ containerPort: 3000 }],
      healthCheck: {
        command: ['CMD-SHELL', 'wget -qO- http://localhost:3000/health || exit 1'],
        interval: Duration.seconds(30),
        timeout: Duration.seconds(5),
        retries: 3,
        startPeriod: Duration.seconds(45),
      },
      environment: {
        NODE_ENV: props.stage,
        PORT: '3000',
        DB_HOST: database.instanceEndpoint.hostname,
        DB_PORT: database.instanceEndpoint.port.toString(),
        DB_NAME: 'atlasclean',
        REDIS_URL: `redis://${cache.attrPrimaryEndPointAddress}:6379`,
      },
      secrets: {
        DB_USER: ecs.Secret.fromSecretsManager(dbCredentials, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbCredentials, 'password'),
        JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
        JWT_REFRESH_SECRET: ecs.Secret.fromSecretsManager(jwtRefreshSecret),
      },
    });

    let certificate;
    if (props.certificateArn) {
      certificate = certificatemanager.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn);
    }

    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      taskDefinition,
      publicLoadBalancer: true,
      desiredCount: isProduction ? 2 : 1,
      assignPublicIp: false,
      listenerPort: certificate ? 443 : 80,
      certificate,
      redirectHTTP: Boolean(certificate),
      securityGroups: [serviceSecurityGroup],
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      healthCheckGracePeriod: Duration.seconds(90),
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    fargateService.targetGroup.configureHealthCheck({
      path: '/health',
      healthyHttpCodes: '200',
      interval: Duration.seconds(30),
      timeout: Duration.seconds(5),
    });

    const scaling = fargateService.service.autoScaleTaskCount({
      minCapacity: isProduction ? 2 : 1,
      maxCapacity: isProduction ? 8 : 3,
    });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 60,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60),
    });

    if (props.domainName) {
      const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: props.domainName,
      });

      new route53.ARecord(this, 'AliasRecord', {
        zone,
        recordName: props.stage === 'production' ? undefined : props.stage,
        target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(fargateService.loadBalancer)),
      });
    }

    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
    new cdk.CfnOutput(this, 'ClusterName', { value: cluster.clusterName });
    new cdk.CfnOutput(this, 'BackendRepositoryUri', { value: backendRepository.repositoryUri });
    new cdk.CfnOutput(this, 'DatabaseEndpoint', { value: database.instanceEndpoint.hostname });
    new cdk.CfnOutput(this, 'RedisEndpoint', { value: cache.attrPrimaryEndPointAddress });
    new cdk.CfnOutput(this, 'LoadBalancerDnsName', { value: fargateService.loadBalancer.loadBalancerDnsName });
  }
}
