import { MessageBuilder, Webhook } from 'webhook-discord';
import { env } from '../env';
import { PteroServer } from './ptero/servers.types';

const hook = new Webhook(env.DISCORD_WEBHOOK_URL);

export async function successAlert(server: PteroServer, hoursSinceRestart: number) {
  const embed = new MessageBuilder()
    .setName('Ptero Restarter')
    .setTitle(server.attributes.name)
    .setColor('#00FF00')
    .setDescription(`Server has been restarted after ${hoursSinceRestart} hours of uptime!`)
    .addField('Identifier', server.attributes.identifier)
    .addField('Node', server.attributes.node)
    .setURL(`${env.PTERO_URL}/server/$identifier}`)
    .setTime();

  await hook.send(embed);
}

export async function failureAlert(server: PteroServer, errorMessage: string) {
  const embed = new MessageBuilder()
    .setName('Ptero Restarter')
    .setTitle(server.attributes.name)
    .setColor('#FF0000')
    .setDescription(errorMessage)
    .addField('Identifier', server.attributes.identifier)
    .addField('Node', server.attributes.node)
    .setURL(`${env.PTERO_URL}/server/${server.attributes.identifier}`)
    .setTime();

  await hook.send(embed);
}
