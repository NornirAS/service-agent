import { ServiceAgent } from '../main';
import { token } from '../config';

interface Message {
  data: {
    [s: string]: unknown;
  },
  command: { 
    [s: string]: unknown;
  }
};

// Service URL for the agent
const url = 'https://demo.cioty.com/sensora';

// Initialize agent with URL and TOKEN
const agent = new ServiceAgent({
  url,
  token
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
      targetUrl: `https://demo.cioty.com/sensora`,
      commandString
    })
    agent.sendData({
      targetUrl: `https://demo.cioty.com/sensora`,
      ghostId: '1',
      data: 'id=1'
    })
  }
};

agent.listen(msgHandler);