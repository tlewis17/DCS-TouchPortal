import DcsBiosApi from 'dcs-bios-api';
import { Client, IAction } from 'touchportal-api';

import { delay } from '../shared/helpers';
import { DcsF18C } from './dcs-f18c';

/**
 * Class that handles the In/Out from DCS
 *
 * @export
 */
export class DCSInterface {
  private dcsBiosApi: DcsBiosApi;
  private TPClient: Client;
  private dcsF18C?: DcsF18C;

  /**
   * Creates an instance of DCSInterface.
   */
  constructor() {
    this.dcsBiosApi = new DcsBiosApi({ logLevel: 'INFO' });
    this.dcsBiosApi.startListening();

    this.TPClient = new Client();
    const pluginId = 'TouchPortal.SnoopPlugin';

    // Connects and Pairs to Touch Portal via Sockete
    this.TPClient.connect({ pluginId });

    // Setup Aircraft
    this.dcsF18C = new DcsF18C(this.dcsBiosApi, this.TPClient);

    this.setupEventHandlers();
    this.setupActionHandlers();
  }

  /**
   * Sends a state update to Touch Portal
   *
   * @param id The ID of the state to update
   * @param value The new value
   */
  private sendStateUpdate(id: string, value: string): void {
    // this.TPClient.stateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, concatDisplayValue());
    this.TPClient.stateUpdate(id, value);
  }

  /**
   * Perform a standard key press
   *
   * @param id The ID of the button pressed
   */
  private buttonPress = (id: string) => {
    console.log(id);
    this.dcsBiosApi.sendMessage(`${id} 1\n`).then(() => {
      console.log('sent');
      delay(500);
      this.dcsBiosApi.sendMessage(`${id} 0\n`).then(() => { });
    });
  }

  /**
   * Performs an update to a state stored in TP
   *
   * @param value The value to update to
   */
  private stateUpdate = (value: string) => {
    console.log(value);
    this.sendStateUpdate(`DCS`, value);
  }

  /**
   * Configures the event handlers for DCS output events
   *
   */
  private setupEventHandlers = (): void => {

  }

  private setupActionHandlers = () => {
    // Receive an Action Call from Touch Portal
    this.TPClient.on('Action', (data: IAction) => {
      console.log(data);

      switch (data.actionId) {
        // UFC Keys
        case 'TouchPortal.SnoopPlugin.DCS.Action.UFC.Keypad':
          data.data.forEach(o => {
            this.buttonPress(`UFC_${o.value.toUpperCase().trim()}`);
          });
          break;
        // UFC Option Selects
        case 'TouchPortal.SnoopPlugin.DCS.Action.UFC.OptionSelect':
          data.data.forEach(o => {
            this.buttonPress(`UFC_OS${o.value.toUpperCase().trim()}`);
          });
          break;
        // LDDI, RDDI, AMPCD Push Buttons
        case 'TouchPortal.SnoopPlugin.DCS.Action.DDI':
          let control = '';
          data.data.forEach(o => {
            if (o.id === 'TouchPortal.SnoopPlugin.DCS.Action.DDI.Screen.Data.Entry') {
              control = o.value.toUpperCase().trim() + '_PB_';
            } else {
              control += o.value.toUpperCase().trim();
            }
          });

          this.buttonPress(control);

/*           screenshot.listDisplays().then((displays: any) => {
            console.log(displays);
          }); */

          /*       screenshot({format: 'png', filename: 'test.png'}).then((img: any) => {
                  // img: Buffer filled with jpg goodness
                  // ...
                }).catch((err: any) => {
                  // ...
                }) */
          break;
      }

      // An action was triggered, handle it here
      /*
          {
              "type":"action",
              "pluginId":"id of the plugin",
              "actionId":"id of the action",
              "data": [
                  {
                  "id":"data object id",
                  "value":"user specified data object value",
                  },
                  {
                  "id":"data object id",
                  "value":"user specified data object value",
                  }
              ]
          }
      */

      // Once your action is done, send a State Update back to Touch Portal
      // TPClient.stateUpdate("<state id>", "value", data.InstanceId);

      // If you have multiple states to send back, you can do that in one call versus separate
      /*   let states = [
          { id: "<state id1>", value: "value" },
          { id: "<state id2>", value: "value1" }
        ]
        TPClient.stateUpdateMany(states); */
    });
  }
}
