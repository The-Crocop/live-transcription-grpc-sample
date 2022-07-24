"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const live_subtitling_grpc_pb_1 = require("transcription-lib-grpc-js/src/generated/live-subtitling_grpc_pb");
const language_pb_1 = require("transcription-lib-grpc-js/src/generated/language_pb");
const live_subtitling_pb_1 = require("transcription-lib-grpc-js/src/generated/live-subtitling_pb");
const GREEN = "\x1b[0;92m";
const RESET = '\x1b[0m';
const host = process.env.HOST ?? '0.0.0.0:9090';
const API_KEY = process.env.API_KEY;
// const metaCallback  = (_params, callback) => {
//     const meta = new grpc.Metadata();
//     meta.add("Authorization", `Bearer ${API_KEY}`)
//     callback(null, meta)
// }
const client = new live_subtitling_grpc_pb_1.LiveSubtitlingClient(host, grpc.credentials.createInsecure());
const sampleVideoUrl = 'rtmp://127.0.0.1:1935/live/swissinfo';
const request = new live_subtitling_pb_1.LiveTranscriptionRequest();
request.setExternalreference('myexampletest');
request.setSourceurl(sampleVideoUrl);
request.setSourcelanguage(language_pb_1.Language.DE);
const headers = new grpc.Metadata();
headers.add("Authorization", `Bearer ${API_KEY}`);
const stream = client.transcribe(request, headers);
stream.on('data', (response) => {
    console.clear();
    // final means its the final result for the section we print it in green color
    console.log(`${response.getIsfinal() ? GREEN : ''} > ${response.getResult()} ${RESET}`);
});
