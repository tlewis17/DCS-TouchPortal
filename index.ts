import express from 'express';
import { Action, ActionData } from './models/action';

// Web Server - TODO, show current status and states
const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Express + TypeScript Server - DCS'));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Setup DCS Bios
const DcsBiosApi = require('dcs-bios-api');
var dcsApi = new DcsBiosApi({ logLevel: 'INFO' });
dcsApi.startListening();

// Setup Touch Portal
const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();
const pluginId = 'TouchPortal.SnoopPlugin';

// Create States
//TPClient.createState(`DCS UFC_OPTION_DISPLAY_1`, "UFC Option Display 1 Value", '');

function stateUpdate(value: any, t: any) {
  //console.log(value, t);
  TPClient.stateUpdate(`DCS ${t.identifier}`, value);
};

// Outputs for Cueing and Display
dcsApi.on('UFC_OPTION_DISPLAY_1', stateUpdate);
dcsApi.on('UFC_OPTION_CUEING_1', stateUpdate);
dcsApi.on('UFC_OPTION_DISPLAY_2', stateUpdate);
dcsApi.on('UFC_OPTION_CUEING_2', stateUpdate);
dcsApi.on('UFC_OPTION_DISPLAY_3', stateUpdate);
dcsApi.on('UFC_OPTION_CUEING_3', stateUpdate);
dcsApi.on('UFC_OPTION_DISPLAY_4', stateUpdate);
dcsApi.on('UFC_OPTION_CUEING_4', stateUpdate);
dcsApi.on('UFC_OPTION_DISPLAY_5', stateUpdate);
dcsApi.on('UFC_OPTION_CUEING_5', stateUpdate);

// Scratch Pad Outputs
var displayValue = {
  first: '',
  second: '',
  third: ''
};

let concatDisplayValue = (): string => {
  var len = displayValue.first.length + displayValue.second.length + displayValue.third.length;
  var val =  `${displayValue.first.padEnd(2, ' ')}${displayValue.second.padStart(2, ' ')}${displayValue.third.padStart(6, ' ')}`;
  return val;
}
  

dcsApi.on('UFC_SCRATCHPAD_NUMBER_DISPLAY', (value: string) => {
  if (value.trim().length > 0) {
    value = value.replace('@', '\xB0');
    value = value.replace('.', '\'');
    //value += "\"";
  }
  displayValue.third = value.trim();

  TPClient.stateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, concatDisplayValue());
});

dcsApi.on('UFC_SCRATCHPAD_STRING_1_DISPLAY', (value: any) => {
  displayValue.first = value.trim();
  TPClient.stateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, concatDisplayValue());
});

dcsApi.on('UFC_SCRATCHPAD_STRING_2_DISPLAY', (value: any) => {
  displayValue.second = value.trim();
  TPClient.stateUpdate(`DCS UFC_SCRATCHPAD_DISPLAY`, concatDisplayValue());
});


function buttonPress(id: string) {
  console.log(id);
  dcsApi.sendMessage(`${id} 1\n`).then(() => {
    console.log('sent');
    delay(500);
    dcsApi.sendMessage(`${id} 0\n`).then(() => {});
  });
}


// Receive an Action Call from Touch Portal
TPClient.on("Action", (data: Action) => {
  console.log(data);

  switch (data.actionId) {
    // UFC Keys
    case 'TouchPortal.SnoopPlugin.DCS.Action.UFC.Keypad':
      data.data.forEach(o => {
        buttonPress(`UFC_${o.value.toUpperCase().trim()}`);
      });
      break;
    // UFC Option Selects
    case 'TouchPortal.SnoopPlugin.DCS.Action.UFC.OptionSelect':
      data.data.forEach(o => {
        buttonPress(`UFC_OS${o.value.toUpperCase().trim()}`);
      });
      break;
    // LDDI, RDDI, AMPCD Push Buttons
    case 'TouchPortal.SnoopPlugin.DCS.Action.DDI':
      var control = '';
      data.data.forEach(o => {
        if (o.id === 'TouchPortal.SnoopPlugin.DCS.Action.DDI.Screen.Data.Entry') {
          control = o.value.toUpperCase().trim() + '_PB_';
        } else {
          control += o.value.toUpperCase().trim();
        }
      });

      buttonPress(control);
      break;
  }

  //An action was triggered, handle it here
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
  //TPClient.stateUpdate("<state id>", "value", data.InstanceId);

  // If you have multiple states to send back, you can do that in one call versus separate
/*   let states = [
    { id: "<state id1>", value: "value" },
    { id: "<state id2>", value: "value1" }
  ]
  TPClient.stateUpdateMany(states); */
});

TPClient.on("ListChange", (data: any) => {
  // An Action's List dropdown changed, handle it here
  /*
      {
          "type":"listChange",
          "pluginId":"id of the plugin",
          "actionId":"id of the action",
          "listId":"id of the list being used in the inline action",
          "instanceId":"id of the instance",
          "value":"newValue",
      }
  */

  // Now send choiceUpdateSpecific based on listChange value
  //TPClient.choiceUpdateSpecific("<state id>", "value", data.instanceId)

});

// After join to Touch Portal, it sends an info message
// handle it here
TPClient.on("Info", (data: any) => {

  //Do something with the Info message here
  /*
      {
          "type":"info",
          "sdkVersion":"(SDK version code)"
          "tpVersionString":"(Version of Touch Portal in string format)"
          "tpVersionCode":"(Version of Touch Portal in code format)"
          "pluginVersion":"(Your plug-in version)"
      }
  */

  // Read some data about your program or interface, and update the choice list in Touch Portal

  //TPClient.choiceUpdate("<state id>", ["choice1", "choice2"]);

  // Dynamic State additions - for use when you want control over what states are available in TouchPortal
  //TPClient.createState("UFC_OPTION_DISPLAY_1", "UFC Option Display 1 Value", "");
});

//Connects and Pairs to Touch Portal via Sockete
TPClient.connect({ pluginId });