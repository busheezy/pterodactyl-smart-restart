import { pteroClient } from './pteroClient';

export interface ServerResources {
  object: string;
  attributes: ServerResourcesAttributes;
}

export interface ServerResourcesAttributes {
  current_state: string;
  is_suspended: boolean;
  resources: ServerResourcesAttributesResources;
}

export interface ServerResourcesAttributesResources {
  memory_bytes: number;
  cpu_absolute: number;
  disk_bytes: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  uptime: number;
}

export async function getServerResources(serverIdentifier: string): Promise<ServerResources> {
  try {
    const { data: serverResourcesData } = await pteroClient.get<ServerResources>(
      `/servers/${serverIdentifier}/resources`,
    );

    return serverResourcesData;
  } catch (error) {
    console.error(`Error getting server resources ${serverIdentifier}`);
    console.error(error);
    throw error;
  }
}
