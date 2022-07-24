import * as grpc from '@grpc/grpc-js'
import {LiveSubtitlingClient} from "transcription-lib-grpc-js/src/generated/live-subtitling_grpc_pb";
import {Language} from "transcription-lib-grpc-js/src/generated/language_pb";
import {
    LiveTranscriptionReply,
    LiveTranscriptionRequest
} from "transcription-lib-grpc-js/src/generated/live-subtitling_pb";

// just an example we use green color to show finalized subtitles
const GREEN ="\x1b[0;92m";
const RESET='\x1b[0m';
const host = 'live.citizenjournalist.io:443' ;
const API_KEY = process.env.API_KEY; // pass your API key

const client = new LiveSubtitlingClient(host, grpc.credentials.createSsl());

const sampleVideoUrl = 'https://cdn3.wowza.com/1/eGlOcmxqcnMxMXJE/dVVnR3o1/hls/live/playlist.m3u8'; // put in your video target
const request = new LiveTranscriptionRequest();
request.setExternalreference('myexampletest'); // just to be able to reference a request, gets returned in the response
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
stream.on('end', () => {
    console.log('The End')
    // The server has finished sending
});
stream.on('error', (error) => {
    // An error has occurred and the stream has been closed.
    console.error(error)
});
stream.on('status', function(status) {
    // process status
    console.log(status);
});