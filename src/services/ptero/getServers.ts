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
