import * as grpc from '@grpc/grpc-js'
import {LiveSubtitlingClient} from "transcription-lib-grpc-js/src/generated/live-subtitling_grpc_pb";
import {Language} from "transcription-lib-grpc-js/src/generated/language_pb";
import {
    LiveTranscriptionReply,
    LiveTranscriptionRequest
} from "transcription-lib-grpc-js/src/generated/live-subtitling_pb";

const GREEN ="\x1b[0;92m";
const RESET='\x1b[0m';
const host = process.env.HOST ?? '0.0.0.0:9090';
const API_KEY = process.env.API_KEY;

// const metaCallback  = (_params, callback) => {
//     const meta = new grpc.Metadata();
//     meta.add("Authorization", `Bearer ${API_KEY}`)
//     callback(null, meta)
// }

const client = new LiveSubtitlingClient(host, grpc.credentials.createInsecure());

const sampleVideoUrl = 'rtmp://127.0.0.1:1935/live/swissinfo'
const request = new LiveTranscriptionRequest();
request.setExternalreference('myexampletest');
request.setSourceurl(sampleVideoUrl);
request.setSourcelanguage(Language.DE);

const headers = new grpc.Metadata();
headers.add("Authorization", `Bearer ${API_KEY}`);

const stream = client.transcribe(request, headers);
stream.on('data', (response: LiveTranscriptionReply) => {
    console.clear()
    // final means its the final result for the section we print it in green color
    console.log(`${response.getIsfinal() ? GREEN : ''} > ${response.getResult()} ${RESET}`);
})