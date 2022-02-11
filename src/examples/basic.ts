import { ServiceAgent } from '../main';
import { token, serviceUrl, targetUrl } from '../config';

interface Message {
  data: {
    [s: string]: unknown;
  },
  command: { 
    [s: string]: unknown;
  }
};

// Initialize agent with URL and TOKEN
const agent = new ServiceAgent({
  serviceUrl,
  token,
  ghostId: '0'
});

// Callback with the logic that will handle incomming data/commands
const msgHandler = ({ data, command }: Message): void => {
  if (typeof data !== 'undefined') {
    // DATA HANDLER
    console.log(data);
  }

  if (typeof command !== 'undefined') {
    // COMMAND HANDLER
    console.log(command);
    const commandString = agent.getQueryStringFromObject(command);
    agent.sendCommand({
      targetUrl,
      commandString
    })
    agent.sendData({
      ghostId: '1',
      dataString: 'id=1'
    })
  }
};

agent.listen(msgHandler);