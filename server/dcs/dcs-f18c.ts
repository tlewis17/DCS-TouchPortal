import DcsBiosApi from 'dcs-bios-api';
import { DcsBase } from './dcs-base';
import { Client } from 'touchportal-api';

export class DcsF18C extends DcsBase {
  /**
   *  Stores the values of 3 strings to combine. For example, the scratchpad on the F18
   *
   */
  private displayValue: DisplayString = {
    first: '',
    second: '',
    third: ''
  };

  constructor(dcsBiosApi: DcsBiosApi, touchPortalApi: Client) {
    super(dcsBiosApi, touchPortalApi);

    this.SetupEventWatchers();
  }

  private SetupEventWatchers = (): void => {
    this.SetupUFCEvents();
  }

  private SetupUFCEvents = (): void => {
    const outputs = [
      { id: 'UFC_OPTION_DISPLAY_1', stateId: 'DCS UFC_OPTION_DISPLAY_1' },
      { id: 'UFC_OPTION_CUEING_1', stateId: 'DCS UFC_OPTION_CUEING_1' },
      { id: 'UFC_OPTION_DISPLAY_2', stateId: 'DCS UFC_OPTION_DISPLAY_2' },
      { id: 'UFC_OPTION_CUEING_2', stateId: 'DCS UFC_OPTION_CUEING_2' },
      { id: 'UFC_OPTION_DISPLAY_3', stateId: 'DCS UFC_OPTION_DISPLAY_3' },
      { id: 'UFC_OPTION_CUEING_3', stateId: 'DCS UFC_OPTION_CUEING_3' },
      { id: 'UFC_OPTION_DISPLAY_4', stateId: 'DCS UFC_OPTION_DISPLAY_4' },
      { id: 'UFC_OPTION_CUEING_4', stateId: 'DCS UFC_OPTION_CUEING_4' },
      { id: 'UFC_OPTION_DISPLAY_5', stateId: 'DCS UFC_OPTION_DISPLAY_5' },
      { id: 'UFC_OPTION_CUEING_5', stateId: 'DCS UFC_OPTION_CUEING_5' }
    ];

    outputs.forEach((o) => {
      this.dcsBiosApi.on(o.id, (value: string) => {
        this.sendStateUpdate(o.stateId, value);
      });
    });

    // Scratch Pads
    this.dcsBiosApi.on('UFC_SCRATCHPAD_NUMBER_DISPLAY', (value: string) => {
      if (value.trim().length > 0) {
        value = value.replace('@', '\xB0');
        value = value.replace('.', '\'');
      }
      this.displayValue.third = value.trim();

      this.sendStateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, this.concatDisplayValue());
    });

    this.dcsBiosApi.on('UFC_SCRATCHPAD_STRING_1_DISPLAY', (value: any) => {
      this.displayValue.first = value.trim();
      this.sendStateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, this.concatDisplayValue());
    });

    this.dcsBiosApi.on('UFC_SCRATCHPAD_STRING_2_DISPLAY', (value: any) => {
      this.displayValue.second = value.trim();
      this.sendStateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, this.concatDisplayValue());
    });
  }

  /**
   * Combines 3 strings together for total of 10 characters. 2, 2, 6.
   *
   */
  private concatDisplayValue = (): string => {
    return `${this.displayValue.first.padEnd(2, ' ')}${this.displayValue.second.padStart(2, ' ')}${this.displayValue.third.padStart(6, ' ')}`;
  }
}

/**
 * Interface to define the scratchpad value holder
 *
 */
interface DisplayString {
  first: string;
  second: string;
  third: string;
}
