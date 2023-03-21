type CoconutStorageConfig = {
  service: 'coconut';
};

type S3StorageConfig = {
  service: 's3';
  region: string;
  bucket: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };

  path?: string;
  secure?: boolean;
  acl?:
    | 'private'
    | 'public-read'
    | 'public-read-write'
    | 'authenticated-read'
    | 'aws-exec-read'
    | 'bucket-owner-read'
    | 'bucket-owner-full-control';
  storage_class?:
    | 'STANDARD'
    | 'REDUCED_REDUNDANCY'
    | 'STANDARD_IA'
    | 'ONEZONE_IA'
    | 'INTELLIGENT_TIERING'
    | 'GLACIER'
    | 'DEEP_ARCHIVE';
  expires?: string;
  cache_control?: string;
};

type GCSStorageConfig = {
  service: 'gcs';
  bucket: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };

  path?: string;
  expires?: string;
  cache_control?: string;
};

type DOSpacesStorageConfig = {
  service: 'dospaces';
  region?: string;
  bucket: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };

  path?: string;
  acl?: 'private' | 'public-read';
};

type LinodeStorageConfig = {
  service: 'linode';
  region: string;
  bucket: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };

  path?: string;
  acl?: 'private' | 'public-read';
};

type WasabiStorageConfig = {
  service: 'wasabi';
  region: string;
  bucket: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };

  path?: string;
  acl?: 'private' | 'public-read';
};

type S3OtherStorageConfig = {
  service: 's3other';
  bucket: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };

  path?: string;
  endpoint: string;
  force_path_style?: boolean;
};

type BackblazeStorageConfig = {
  service: 'backblaze';
  bucket_id: string;
  credentials: {
    account_id: string;
    app_key_id: string;
    app_key: string;
  };

  path?: string;
};

type RackspaceStorageConfig = {
  service: 'rackspace';
  credentials: {
    username: string;
    api_key: string;
  };
  container: string;
  path?: string;
  region?: string;
};

type AzureStorageConfig = {
  service: 'azure';
  credentials: {
    account: string;
    api_key: string;
  };
  container: string;
  path?: string;
};

type IPFSPinataStorageConfig = {
  service: 'ipfs_pinata';
  credentials: {
    api_key: string;
    secret_api_key: string;
  };
  gateway_dns: string;
};

type IPFSInfuraStorageConfig = {
  service: 'ipfs_infura';
  credentials: {
    project_id: string;
    project_secret: string;
  };
};

type URLStorageConfig = {
  url: string;
};

export type StorageConfig =
  | CoconutStorageConfig
  | S3StorageConfig
  | GCSStorageConfig
  | DOSpacesStorageConfig
  | LinodeStorageConfig
  | WasabiStorageConfig
  | S3OtherStorageConfig
  | BackblazeStorageConfig
  | RackspaceStorageConfig
  | AzureStorageConfig
  | IPFSPinataStorageConfig
  | IPFSInfuraStorageConfig
  | URLStorageConfig;

type HttpNotification = {
  type: 'http';
  url: string;
  params?: {
    [key: string]: any;
  };
  metadata?: boolean;
  events?: boolean;
};

type SNSNotification = {
  type: 'sns';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  region: string;
  topic_arn: string;
  params?: {
    [key: string]: any;
  };
  metadata?: boolean;
  events?: boolean;
};

export type NotificationConfig = HttpNotification | SNSNotification;

export type ClientConfig = {
  region?: 'us-east-1' | 'us-west-2' | 'eu-west-1';
  endpoint?: string;

  storage?: StorageConfig;
  notification?: NotificationConfig;
};

export class Client {
  Job: Job;
  Metadata: Metadata;

  constructor(api_key: string, config: ClientConfig);

  getEndpoint(): string;
}

type URLJobInputConfig = {
  url: string;
};

type S3JobInputConfig = {
  service: 's3';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  bucket: string;
  key: string;
  region: string;
};

type GCSJobInputConfig = {
  service: 'gcs';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  bucket: string;
  key: string;
};

type DOSpacesJobInputConfig = {
  service: 'dospaces';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  bucket: string;
  key: string;
  region: string;
};

type LinodeJobInputConfig = {
  service: 'linode';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  bucket: string;
  key: string;
  region: string;
};

type WasabiJobInputConfig = {
  service: 'wasabi';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  bucket: string;
  key: string;
  region: string;
};

type S3OtherJobInputConfig = {
  service: 's3other';
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
  bucket: string;
  key: string;
  endpoint: string;
  region?: string;
};

type JobInputConfig =
  | URLJobInputConfig
  | S3JobInputConfig
  | GCSJobInputConfig
  | DOSpacesJobInputConfig
  | LinodeJobInputConfig
  | WasabiJobInputConfig
  | S3OtherJobInputConfig;

type JobOutputConfig = {
  [key: string]: any;
};

type JobSettingsConfig = {
  ultrafast?: boolean;
};

type JobConfig = {
  input: JobInputConfig;
  outputs: JobOutputConfig;
  notification?: NotificationConfig;
  storage?: StorageConfig;
  settings?: JobSettingsConfig;
};

type JobStatusStates = 'job.starting' | 'job.processing' | 'job.completed' | 'job.failed';
type InputStatusStates = 'input.starting' | 'input.transferring' | 'input.transferred' | 'input.failed';
type VideoStatusStates =
  | 'video.waiting'
  | 'video.queued'
  | 'video.encoding'
  | 'video.encoded'
  | 'video.failed'
  | 'video.skipped';
type ImageStatusStates =
  | 'image.waiting'
  | 'image.queued'
  | 'image.processing'
  | 'image.created'
  | 'image.failed'
  | 'image.skipped';
type HttpStreamStatusStates =
  | 'httpstream.waiting'
  | 'httpstream.queued'
  | 'httpstream.variants.encoding'
  | 'httpstream.packaging'
  | 'httpstream.packaged'
  | 'httpstream.failed'
  | 'httpstream.skipped';

type InputStatus = {
  status: InputStatusStates;
};

type VideoStatus = {
  type: 'video';
  key: string;
  status: VideoStatusStates;

  [key: string]: any; //TODO: needs more detail
};

type ImageStatus = {
  type: 'image';
  key: string;
  status: ImageStatusStates;
  [key: string]: any; //TODO: needs more detail
};

type HttpStreamStatus = {
  type: 'httpstream';
  key: string;
  status: HttpStreamStatusStates;
  [key: string]: any; //TODO: needs more detail
};

type OutputsStatus = VideoStatus | ImageStatus | HttpStreamStatus;

type JobStatus = {
  id: string;
  created_at: string;
  completed_at: string | null;
  status: JobStatusStates;
  progress: string;
  input: InputStatus;
  outputs: OutputsStatus;
};

type Callback<T> = (data: T, err: any) => void;

declare class Job {
  static create(opts: JobConfig): Promise<JobStatus>;
  static create(opts: JobConfig, callback: Callback<JobStatus>): void;

  static retrieve(job_id: string): Promise<JobStatus>;
  static retrieve(job_id: string, callback: Callback<JobStatus>): void;
}

type MetadataInfo = {
  job_id: string;
  metadata: any; //TODO: needs more detail
};

declare class Metadata {
  static retrieve(job_id: string): Promise<MetadataInfo>;
  static retrieve(job_id: string, callback: Callback<MetadataInfo>): void;
}

export type NotificationEventStates =
  | 'job.completed'
  | 'job.failed'
  | 'input.transferred'
  | 'output.completed'
  | 'output.failed';

export type NotificationPayload = {
  job_id: string;
  event: NotificationEventStates;
  metadata: boolean;
  progress?: string;
  data: any; //TODO: needs more detail
};
