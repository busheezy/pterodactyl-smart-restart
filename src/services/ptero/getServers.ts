import { pteroClient } from './pteroClient';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const invocationsPath = path.join(__dirname, '..', '..', '..', 'invocations.txt');

export interface PteroServerResponse {
  data: PteroServer[];
}

export interface PteroServer {
  attributes: ServerAttributes;
}

export interface Relationships {
  allocations: Allocations;
}

export interface Allocations {
  object: string;
  data: AllocationsData[];
}

export interface AllocationsData {
  object: string;
  attributes: Attributes;
}

export interface Attributes {
  id: number;
  ip: string;
  ip_alias: string;
  port: number;
  notes: string | null;
  is_default: boolean;
}

export type ServerStatus =
  | 'installing'
  | 'install_failed'
  | 'reinstall_failed'
  | 'suspended'
  | 'restoring_backup'
  | null;

export interface ServerAttributes {
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

export interface SftpDetails {
  ip: string;
  port: number;
}

async function getAllowedServerInvocations() {
  try {
    const invocations = await fs.readFile(invocationsPath, 'utf-8');
    return invocations.split('\n');
  } catch (error) {
    console.error('Error reading invocations.json');
    console.error(error);
    return [];
  }
}

export async function getCsServers() {
  const allowedServerInvocations = await getAllowedServerInvocations();

  const {
    data: { data: servers },
  } = await pteroClient.get<PteroServerResponse>('/');

  const filteredServers = servers.filter((server) => {
    if (server.attributes.status !== null) {
      return false;
    }

    const allowed = allowedServerInvocations.some((invocation) => {
      return server.attributes.invocation.startsWith(invocation);
    });

    return allowed;
  });

  return filteredServers;
}
