import { GameDig } from 'gamedig';
import { PteroServer } from '../ptero/servers.types';

export async function getPlayerCountFromServer(pteroServer: PteroServer): Promise<number> {
  if (pteroServer.attributes.relationships.allocations.data.length === 0) {
    throw new Error('Server has no allocations');
  }

  const allocation = pteroServer.attributes.relationships.allocations.data[0];

  const host = allocation.attributes.ip;
  const port = allocation.attributes.port;

  const state = await GameDig.query({
    type: 'csgo',
    host,
    port,
  });

  return state.players.length;
}
