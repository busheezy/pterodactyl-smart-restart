import { pteroClient } from './pteroClient';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { PteroServerResponse } from './servers.types';

const invocationsPath = path.join(__dirname, '..', '..', '..', 'invocations.txt');

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
