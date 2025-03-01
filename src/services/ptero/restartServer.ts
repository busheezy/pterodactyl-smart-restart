import { pteroClient } from './pteroClient';

export async function restartServer(serverIdentifier: string) {
  try {
    await pteroClient.post(`/servers/${serverIdentifier}/power`, {
      signal: 'restart',
    });
  } catch (error) {
    console.error(`Error restarting server ${serverIdentifier}`);
    console.error(error);
  }
}
