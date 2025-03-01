export interface PteroServerResponse {
  data: PteroServer[];
}

export interface PteroServer {
  attributes: ServerAttributes;
}

interface Relationships {
  allocations: Allocations;
}

interface Allocations {
  object: string;
  data: AllocationsData[];
}

interface AllocationsData {
  object: string;
  attributes: Attributes;
}

interface Attributes {
  id: number;
  ip: string;
  ip_alias: string;
  port: number;
  notes: string | null;
  is_default: boolean;
}

type ServerStatus =
  | 'installing'
  | 'install_failed'
  | 'reinstall_failed'
  | 'suspended'
  | 'restoring_backup'
  | null;

interface ServerAttributes {
  server_owner: boolean;
  identifier: string;
  uuid: string;
  name: string;
  node: string;
  invocation: string;
  sftp_details: SftpDetails;
  description: string;
  status: ServerStatus;
  relationships: Relationships;
}

interface SftpDetails {
  ip: string;
  port: number;
}
