import DcsBiosApi from 'dcs-bios-api';
import { Client } from 'touchportal-api';

export class DcsBase {
  protected dcsBiosApi: DcsBiosApi;
  protected touchPortalApi: Client;

  constructor(dcsBiosApi: DcsBiosApi, touchPortalApi: Client) {
    this.dcsBiosApi = dcsBiosApi;
    this.touchPortalApi = touchPortalApi;
  }

  /**
   * Sends a state update to Touch Portal
   *
   * @param id The ID of the state to update
   * @param value The new value
   */
  protected sendStateUpdate(id: string, value: string): void {
    // this.TPClient.stateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, concatDisplayValue());
    this.touchPortalApi.stateUpdate(id, value);
  }
}
