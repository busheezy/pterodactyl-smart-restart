import Bluebird from 'bluebird';
import { getCsServers } from './services/ptero/getServers';
import { failureAlert, successAlert } from './services/discord';
import { getServerResources } from './services/ptero/getServerResources';
import { subMilliseconds } from 'date-fns/subMilliseconds';
import { differenceInHours } from 'date-fns/differenceInHours';
import { getPlayerCountFromServer } from './services/gamedig/getPlayersFromServer';
import { restartServer } from './services/ptero/restartServer';

async function run() {
  const servers = await getCsServers();

  await Bluebird.mapSeries(servers, async (server) => {
    try {
      const resources = await getServerResources(server.attributes.identifier);
      const uptimeDate = subMilliseconds(new Date(), resources.attributes.resources.uptime);
      const hoursSinceRestart = differenceInHours(new Date(), uptimeDate);

      if (hoursSinceRestart < 6) {
        return;
      }

      const playerCount = await getPlayerCountFromServer(server);

      if (playerCount !== 0) {
        return;
      }

      await successAlert(server, hoursSinceRestart);

      await restartServer(server.attributes.identifier);
    } catch (error) {
      if (error instanceof Error) {
        await failureAlert(server, error.message);
      }
    }
  });
}

run().catch(console.error);
