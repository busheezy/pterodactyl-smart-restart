import { pteroClient } from './pteroClient';

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

export async function getCsServers() {
  const {
    data: { data: servers },
  } = await pteroClient.get<PteroServerResponse>('/');

  const filteredServers = servers.filter((server) => {
    if (
      !server.attributes.invocation.startsWith('./game/cs2.sh') &&
      !server.attributes.invocation.startsWith('./srcds_run')
    ) {
      return false;
    }

    if (server.attributes.status !== null) {
      return false;
    }

    return true;
  });

  return filteredServers;
}
