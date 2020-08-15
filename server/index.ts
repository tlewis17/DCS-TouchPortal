import Jimp from 'jimp';

import { WebApi } from './api/webapi';
import { DCSInterface } from './dcs/dcs-interface';

// Setup WebAPI
const webAPI = new WebApi();

// Setup TP/DCS
const dcsInterface = new DCSInterface();

// const screenshot = require('screenshot-desktop');

// DDI Looper
// const intervalObj = setInterval(() => {
//   screenshot.all({format: 'png', filename: 'test.png'}).then((imgs: any) => {
//     // imgs: an array of Buffers, one for each screen
//     console.log(imgs);

//     Jimp.read(imgs[0])
//     .then(image => {
//       image.crop(0, 0, 620, 620);
//       image.resize(200, 200);
//       //image.quality(20);
//       //image.rgba(false);
//       //image.deflateStrategy(0);
// /*           image.deflateLevel(5, (e, j) => {
//         console.log(e);
//         j.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
//           console.log(buffer);
//           TPClient.stateUpdate(`DCS LEFT_DDI_IMG`, buffer.toString('base64'));
//           TPClient.stateUpdate(`DCS LEFT_DDI_IMG Updater`, "1");
//         });
//       }); */

//       image.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
//         console.log(buffer);
//         TPClient.stateUpdate(`DCS LEFT_DDI_IMG`, buffer.toString('base64'));
//         TPClient.stateUpdate(`DCS LEFT_DDI_IMG Updater`, "1");
//       });

//       // Do stuff with the image.
//     })
//     .catch(err => {
//       // Handle an exception.
//     });
//   })
// }, 500);
