import fetch, { Response } from 'node-fetch';

interface ServiceAgentParams {
  serviceUrl: string,
  token: string,
  ghostId: string,
  restartStream: boolean
}

interface Headers {
  [key: string]: string
}

interface SendDataParams {
  ghostId: string,
  dataString: string
}

interface SendCommandParams {
  targetUrl: string,
  commandString: string
}

export class ServiceAgent {
  private serviceUrl: string
  private token: string
  private ghostId: string
  private restartStream: boolean

  constructor({ serviceUrl, token, ghostId, restartStream = true }: ServiceAgentParams) {
    this.serviceUrl = serviceUrl,
    this.token = token,
    this.ghostId = ghostId,
    this.restartStream = restartStream
  }

  private get domain(): string | void {
    const regExp = /\w[\w-]+\w(?=\.)/i;
    const result = regExp.exec(this.serviceUrl);
    
    if (!result) return;
    
    return result[0];
  }

  private get service(): string | void {
    const regExp = /(?<=(\w[\w-]+\w\.\w+)\/)(\w[\w-]+\w)/i;
    const result = regExp.exec(this.serviceUrl);
    
    if (!result) return;
    
    return result[0];
  }

  private get baseHeaders(): Headers {
    return {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  /**
   * 
   * @param {Object} obj
   * @returns query string key=value&key2=value2.
   */
  public getQueryStringFromObject(obj: { [s: string]: unknown; }): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  /**
   *
   * @param {Function} cb - will handle the incomming data and/or commands.
   * @returns ReadableStream object.
   */
  public async listen(cb: Function): Promise<Response|void> {
    let readableStream: NodeJS.ReadableStream | null;
    try {
      console.log('Agent is listening');
      const { body } = await fetch(
        this.serviceUrl,
        {
          body: `token=${this.token}&objectID=${this.ghostId}&format=json`,
          headers: {
            ...this.baseHeaders,
            ...{ 'Synx-Cat': '4' }
          },
          method: 'POST'
        }
      );
      readableStream = body;
    } catch (_e) {
      readableStream = null;
      console.log('External Error! Agent cannot listen');
    };

    if (!readableStream) return;

    readableStream.on('readable', () => {
      const data = readableStream!
        .setEncoding('utf8')
        .read();

      if (!data || typeof data !== 'string') return;

      try {
        const { RTW, CMD } = JSON.parse(data.trim());
        cb({
          data: RTW,
          command: CMD
        });
      } catch (_e) {
        console.log('Received data is not a JSON');
      }
    });

    readableStream.on('close', () => {
      console.log('Agent is closed');
      if (this.restartStream) this.listen(cb);
    });
  }

  /**
   * Data can be sendt to any ghost of this service by specifying ID of the ghost.
   * @param {SendDataParams}
   */
  public async sendData({ ghostId, dataString }: SendDataParams): Promise<void> {
    try {
      await fetch(
        this.serviceUrl,
        {
          body: `token=${this.token}&objectID=${ghostId}&${dataString}`,
          headers: {
            ...this.baseHeaders,
            ...{ 'Synx-Cat': '1' }
          },
          method: 'POST'
        });
    } catch (e) {
      console.error(e);
    }
  }
 
  /**
   * Command can be sendt only to the linked service with command schema.
   * @param {SendCommandParams}
   */
  public async sendCommand({ targetUrl, commandString }: SendCommandParams): Promise<void> {
    try {
      await fetch(
        targetUrl,
        {
          body: `token=${this.token}&refdomain=${this.domain}&refservice=${this.service}&${commandString}`,
          headers: {
            ...this.baseHeaders,
            ...{ 'Synx-Cat': '0' }
          },
          method: 'POST'
        });
    } catch(e) {
      console.error(e);
    }
  }
}