import Bluebird from 'bluebird';
import { getCsServers } from './services/ptero/getServers';
import { failureAlert } from './services/discord';
import { getServerResources } from './services/ptero/getServerResources';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { subMilliseconds } from 'date-fns/subMilliseconds';
import { subHours } from 'date-fns/subHours';

async function run() {
  const servers = await getCsServers();

  await Bluebird.mapSeries(servers, async (server) => {
    try {
      if (server.attributes.status !== null) {
        return;
      }

      const resources = await getServerResources(server.attributes.identifier);
      const uptimeDate = subMilliseconds(new Date(), resources.attributes.resources.uptime);
      const uptimeThreshold = subHours(new Date(), 6);

      if (uptimeDate > uptimeThreshold) {
        console.log(`${server.attributes.name} has been up for less than 6 hours, not restarting`);
        return;
      }

      console.log(`${server.attributes.name} has been up for ${formatDistanceToNow(uptimeDate)}`);
    } catch (error) {
      console.error(`Error checking server ${server.attributes.name}`);
      console.error(error);

      if (error instanceof Error) {
        await failureAlert(
          server.attributes.name,
          server.attributes.identifier,
          server.attributes.node,
          error.message,
        );
      }
    }
  });
}

run().catch(console.error);
