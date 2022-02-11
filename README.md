# Service Agent for NodeJS

An agent should be used by the service owners for handling (send/receive) the data and commands.

## Installation

### npm

```
npm i @norniras/service-agent
```

### yarn

```
yarn add @norniras/service-agent
```

### pnpm

```
pnpm add @norniras/service-agent
```

## How to

### Initialize the agent

```javascript
import { ServiceAgent } from '@norniras/service-agent';

const agent = new ServiceAgent({
  serviceUrl: 'https://demo.cioty.com/service', // service URL
  token: 'aToken' // token
  ghostId: '' // ghost id
});
```

### Agent - listen

Takes callback as an argument that will handle incoming data and commands.
This is where all logic should be defined.

```javascript
agent.listen(({ data, command }) => {
  if (typeof data !== 'undefined') {
    // DATA HANDLER
    console.log(data);
  }

  if (typeof command !== 'undefined') {
    // COMMAND HANDLER
    console.log(command);
  }
});
```

### Agent - send data

The service owner can send data to any ghost of his service.

```javascript
agent.sendData({
  ghostId: 'id', // Ghost ID where you want to send data
  dataString: 'key=value&key1=value1' // data is sent as query string
});
```

### Agent - send command

The service owner can send commands only to the service he is linking to. Command schema defined by the service owner and can be found on micropage. We send to turn on lamp id 5 with a red color to a lamp service. The service agent of lamp service should handle this command.

```javascript
agent.sendCommand({
  targetUrl: 'https://demo.cioty.com/lamp', // service URL
  commandString: 'action=on&id=5&color=red'
});
```

### Agent - get query string from an object

From the examples above you can see that both data and commands should be sent as a query string. The method will convert objects into a query string.

```javascript
const command = {
  action: 'on',
  id: 5,
  color: 'red'
};
const commandString = agent.getQueryStringFromObject(command);

// commandString // action=on&id=5&color=red

agent.sendCommand({
  targetUrl: 'https://demo.cioty.com/lamp', // service URL
  commandString
});
```

## For developers

1. Clone repo on GitHub
2. Inside **src/config** folder create **_.env_** and copy from **_example.env_**
3. Fill up **_.env_** file
4. Run **_pnpm dev_** to start an agent
5. Using **CURLs** u can send some data to your agent and see how does it work