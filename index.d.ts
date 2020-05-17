declare function RecordRTC(stream: RecordSource, config: RecordRTCConfig): RecordRTC

/** Record source types. */
declare type RecordSource = MediaStream | MediaStream[] | HTMLCanvasElement | HTMLVideoElement | HTMLElement | CanvasRenderingContext2D

declare interface RecordRTCConfig extends
	MediaStreamRecorderConfig,
	MutliStreamRecorderConfig,
	StereoAudioRecorderConfig,
	CanvasRecorderConfig,
	GifRecorderConfig,
	WebAssemblyRecorderConfig,
	WhammyRecorderConfig {

	/** 
	 * Force recorder class to use when recording data.
	 * Normally, `recorderType` can be automatically detected from `type`, `audio` and `video` properties.
	 * If you specify this property, it will force to use specified recorder.
	 * Default value is `MediaStreamRecorder` for video & audio encoding.
	 * But if `MediaStreamRecorder` is not available, `WebAssemblyRecorder` and `StereoAudioRecorder` will be used for video and audio encoding.
	 * Otherwise, `CanvasRecorder` will be selected for `canvas` type, `GifRecorder` will be selected for `gif` type.
	 */
	recorderType?: RecorderConstructor
}

/** Enum the file type and codecs supported. */
declare type RecordRTCMimeType = 'audio/webm'
	| 'video/webm'
	| 'video/webm;codecs=vp8'
	| 'video/webm;codecs=vp9'
	| 'video/webm;codecs=h264'
	| 'video/x-matroska'
	| 'video/x-matroska;codecs=avc1'
	| 'video/mpeg'	// NOT supported by any browser, yet
    | 'video/mp4'	// NOT supported by any browser, yet
	| 'audio/ogg'	// ONLY Firefox
	| 'audio/wav'
	| string

/** All the recorder classes. */
declare type RecorderConstructor = typeof MediaStreamRecorder
	| typeof StereoAudioRecorder
	| typeof WebAssemblyRecorder
	| typeof CanvasRecorder
	| typeof GifRecorder
	| typeof WhammyRecorder
	| typeof MultiStreamRecorder


/** Record audio, video or screen inside the browser. */
declare class RecordRTC {

	static invokeSaveAsDialog: typeof invokeSaveAsDialog
    static getTracks: typeof getTracks
    static getSeekableBlob: typeof getSeekableBlob
    static bytesToSize: typeof bytesToSize
	static isElectron: typeof isElectron

	static Storage: typeof Storage
	static Whammy: Whammy
	static DiskStorage: typeof DiskStorage

	static MediaStreamRecorder: typeof MediaStreamRecorder
	static StereoAudioRecorder: typeof StereoAudioRecorder
	static CanvasRecorder: typeof CanvasRecorder
	static WhammyRecorder: typeof WhammyRecorder
	static GifRecorder: typeof GifRecorder
	static MultiStreamRecorder: typeof MultiStreamRecorder
	static RecordRTCPromisesHandler: typeof RecordRTCPromisesHandler
	static WebAssemblyRecorder: typeof WebAssemblyRecorder


	/** RecordRTC version. */
	static readonly version: string

	/** This method gets a blob from indexed-DB storage. */
	static getFromDisk(type: 'all' | 'audio' | 'video' | 'gif', callback: (dataURL: string) => void): void
	
	/** This method can be used to store recorded blobs into IndexedDB storage. */
	static writeToDisk(config: {audio?: Blob, video?: Blob, gif?: Blob}): void


	/** RecordRTC version number. */
	readonly version: string

	/** A recorder can have inactive, recording, paused or stopped states. */
	readonly state: RecordRTCState

	/** It is equivalent to `recorder.getBlob()` method. Usage of `getBlob` is recommended, though. */
	readonly blob: Blob

	/** This works only with `{recorderType:StereoAudioRecorder}`, returns Audio ArrayBuffer object, supported only in Chrome. */
	readonly buffer: ArrayBuffer

	/** This works only with `{recorderType:StereoAudioRecorder}`. Use this property on `stopRecording` to verify the encoder's sample-rates. */
	readonly bufferSize: number

	/** This works only with `{recorderType:StereoAudioRecorder}`. Use this property on `stopRecording` to verify the encoder's sample-rates. */
	readonly sampleRate: number

	
	/** This method can be used to clear/reset all the recorded data. */
	clearRecordedData(): void

	/** Destroy RecordRTC instance. Clear all recorders and objects. */
	destroy(): void

	/** Get the recorded blob. Use this method inside the `stopRecording` callback. */
	getBlob(): Blob

	/** Get data-URI instead of Blob. */
	getDataURL(callback: (dataURL: string) => void): void

	/** This method gets a blob from indexed-DB storage. */
	getFromDisk(callback: (dataURL: string) => void): void
	
	/** Get internal recording object (i.e. internal module). */
	getInternalRecorder(): RecorderConstructor
	
	/** Get recorder's readonly state. */
	getState(): RecordRTCState

	/** This method initializes the recording. [deprecated] */
	initRecorder(): void

	/** Fired if recorder's state changes. */
	onStateChanged: (state: RecordRTCState) => void

	/** This method pauses the recording. You can resume recording using `resumeRecording` method. */
	pauseRecording(): void

	/** This method resets the recorder. So that you can reuse single recorder instance many times. */
	reset(): void

	/** This method resumes the recording. */
	resumeRecording(): void

	/** Invoke save-as dialog to save the recorded blob into your disk. */
	save(fileName: string): void

	/** This method appends an array of webp images to the recorded video-blob. It takes an `array` object. [deprecated] */
	setAdvertisementArray(arrayOfWebPImages: {duration: number, image: string}[]): void

	/** Ask RecordRTC to auto-stop the recording after `recordingDuration` milliseconds. */
	setRecordingDuration(recordingDuration: number): void

	/** This method starts the recording. */
	startRecording(): void

	/** This method stops the recording. It is strongly recommended to get `blob` or `URI` inside the callback to make sure all recorders finished their job. */
	stopRecording(callback: (objectURI: string) => void): void

	/** Get virtual/temporary URL. Usage of this URL is limited to current tab. */
	toURL(): string
}

declare type RecordRTCState = 'inactive ' | 'recording' | 'paused' | 'stopped'


/** `RecordRTCPromisesHandler` adds promises support in `RecordRTC`. */
declare class RecordRTCPromisesHandler {

	/** RecordRTCPromisesHandler adds promises support for RecordRTC. */
	constructor(stream: MediaStream | MediaStream[] | HTMLCanvasElement | HTMLVideoElement | HTMLElement, config: RecordRTCConfig)

	/** RecordRTC version number. */
	readonly version: string

	/** Access the native RecordRTC object. */
	readonly recordRTC: RecordRTC

	/** Recorded data as `Blob` object. */
	readonly blob: Blob

	/** Destroy RecordRTC instance. Clear all recorders and objects. */
	destroy(): void

	/** This method returns the recorded blob. */
	getBlob(): Promise<Blob>

	/** This method returns data-url for the recorded blob. */
	getDataURL(): Promise<string>

	/** Returns internal recording object. */
	getInternalRecorder(): Promise<RecorderConstructor>
	
	/** Get recorder's readonly state. */
	getState(): Promise<RecordRTCState>

	/** This method pauses the recording. You can resume recording using `resumeRecording` method. */
	pauseRecording(): Promise<void>

	/** This method resets the recorder. So that you can reuse single recorder instance many times. */
	reset(): Promise<void>
	
	/** This method resumes the recording. */
	resumeRecording(): Promise<void>

	/** This method records MediaStream. */
	startRecording(): Promise<void>

	/** This method stops the recording. */
	stopRecording(): Promise<string>
}


/**
* Writing blobs into IndexedDB.
* DiskStorage is a standalone object used by RecordRTC to store recorded blobs in IndexedDB storage.
*/
declare namespace DiskStorage {

	/** This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally. */
	export function init(): void

	/** This method fetches stored blobs from IndexedDB. */
	export function Fetch(callback: (dataURL: string, type: 'audioBlob' | 'videoBlob' | 'gifBlob') => void): void	

	/** This method stores blobs in IndexedDB. */
	export function Store(Config: {audioBlob?: Blob, videoBlob?: Blob, gifBlob?: Blob}): void	

	/** This function is invoked for any known/unknown error. */
	export let onError: () => void	

	/** Name of the ObjectStore created in IndexedDB storage. */
	export const dataStoreName: string	
}

/** The IndexedDB storage type. */
declare type StorageType = 'audioBlob' | 'videoBlob' | 'gifBlob'


/** torage is a standalone object used by RecordRTC to store reusable objects e.g. `new AudioContext`. */
// declare namespace Storage {
// 	export const AudioContext: AudioContext
// }

/** Return human-readable file size. */
declare function bytesToSize(bytes: number): string

/** Seek a blob or file object. */
declare function getSeekableBlob(file: Blob, callback: (newBlob: Blob) => void): void

/** Get stream track by track kind. */
declare function getTracks(stream: MediaStream, kind: 'audio' | 'video'): MediaStreamTrack[]

/** Save as blob to local file system. */
declare function invokeSaveAsDialog(blob: Blob, fileName?: string): void

/** Detect if running in an electron environment. */
declare function isElectron(): boolean


/** 
 * Reference to https://w3c.github.io/mediacapture-record/MediaRecorder.html
 * Using native `MediaRecorder` object to record from audio and video data from `MediaStream`.
 */
declare class MediaStreamRecorder {

	/** MediaStreamRecorder is an abstraction layer for MediaRecorder API. It is used by RecordRTC to record MediaStream(s) in both Chrome and Firefox. */
	constructor(stream: MediaStream, config: MediaStreamRecorderConfig)

	/** The recorded blob object. */
	blob: Blob

	/** Array of time stamps. */
	timestamps: number[]

	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** Get MediaRecorder all recording states. */
	getAllStates(): RecordRTCState[]

	/** This method returns array of blobs. Use only with `timeSlice`. Its useful to preview recording anytime, without using the `stop` method. */
	getArrayOfBlobs(): Blob[]

	/** Get MediaRecorder all recording states. */
	getState(): RecordRTCState

	/** This method pauses the recording process. */
	pause(): void

	/** This method records MediaStream. */
	record(): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording MediaStream. */
	stop(callback: (blob: Blob) => void): void
}

declare interface MediaStreamRecorderConfig extends CommonRecorderConfig {
	/** 
	 * Which media type to record.
	 * If not specified, it will be detected from `mimeType` property.
	 */
	type?: 'video' | 'audio' | 'canvas' | 'gif'
	
	/** Which file and codec type to use when encoding media data. */
	mimeType?: RecordRTCMimeType

	/** Default value is 256 * 8 * 1024. */
	audioBitsPerSecond?: number

	/** Default value is 256 * 8 * 1024. */
	videoBitsPerSecond?: number

	/** If this is provided, skip above two, default value is 256 * 8 * 1024. */
	bitsPerSecond?: number

	/** 
	 * Auto stop recording if camera stops, or the input stream stops.
	 * Default value is `false`.
	 */
	checkForInactiveTracks?: boolean

	/** Concatenate intervals based blobs, default value is 1000. */
	timeSlice?: number,
	
	/** Get intervals based blobs. */
	ondataavailable?: (blob: Blob) => void
	
	/** Trigger when update timestamp, Requires `timeSlice` above specified. */
	onTimeStamp?: (timestamp: number) => void

	/** Callback after recorder initialized. */
	initCallback?: () => void

	/** 
	 * Using native blob or compress it with current mime type.
	 * Default value is `false`.
	 */
	getNativeBlob?: boolean
}


declare interface CommonRecorderConfig {
	/** Disables console logs, default value is `false`. */
	disableLogs?: boolean
}


/** 
 * Encode multiple `MediaStream` into one.
 * Using `MediaStreamRecorder` in inner.
 */
declare class MultiStreamRecorder {

	/**
	 * Multi-videos recorder.
	 * MultiStreamRecorder can record multiple videos in single container.
	 */
	constructor(mediaStreams: MediaStream[], config?: MutliStreamRecorderConfig)

	/** Add extra media-streams to existing recordings. */
	addStreams(mediaStreams: MediaStream[]): void
	
	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** Returns MultiStreamsMixer */
	getMixer(mediaStreams: MediaStream[]): MultiStreamsMixer

	/** This method pauses the recording process. */
	pause(): void

	/** This method records MediaStream. */
	record(): void

	/** Reset videos during live recording. Replace old videos e.g. replace cameras with full-screen. */
	resetVideoStreams(mediaStreams: MediaStream[]): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording MediaStream. */
	stop(callback: (blob: Blob) => void): void
}

declare interface MutliStreamRecorderConfig extends MediaStreamRecorderConfig {

	/** To capture frame repeatly with interval time, kind of `frameRate`. */
	frameInterval?: number
	
	/** 
	 * Specifies the recording size.
	 * Can be a property object or an `HTMLVideoElement`.
	 */
	video?: HTMLVideoElement | {
		width: number
		height: number
	}

	/** 
	 * If you are recording multiple streams into single file,
	 * this helps you see what is being recorded.
	 */
	previewStream?: (stream: MediaStream) => void

	/** 
	 * The class name which will be assigned to created canvas element.
	 * Can also be used to access created `HTMLCanvasElement`.
	 */
	elementClass?: string
}


declare class MultiStreamsMixer {

	name: string

	constructor(arrayOfMediaStreams: MediaStream[], elementClass: string)

	appendStreams(streams: MediaStream | MediaStream[]): void

	getMixedStream(): MediaStream

	releaseStreams(): void

	resetVideoStreams(streams: MediaStream | MediaStream[]): void
	
	startDrawingFrames(): void
}


/** Encode stereo audio, default recorder when recorder type is `audio`. */
declare class StereoAudioRecorder {

	/**
	 * JavaScript standalone object for stereo audio recording.
	 * StereoAudioRecorder is a standalone class used by RecordRTC to bring `stereo` audio-recording in chrome.
	 */
	constructor(stream: MediaStream, config: StereoAudioRecorderConfig)

	/** Buffer-size for how frequently the audioprocess event is dispatched. */
	sampleRate?: number

	/** Buffer-size for how frequently the audioprocess event is dispatched. */
	bufferSize: number

	/** The recorded blob object. */
	blob: Blob

	/** The recorded buffer object. */
	buffer: ArrayBuffer

	/** The recorded data-view object. */
	view: DataView

	/** Set sample rates such as 8K or 16K. Reference: http://stackoverflow.com/a/28977136/552182 */
	desiredSampRate: number

	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** This method pauses the recording process. */
	pause(): void

	/** This method records MediaStream. */
	record(): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording MediaStream. */
	stop(callback: (blob: Blob) => void): void
}

declare interface StereoAudioRecorderConfig extends CommonRecorderConfig {
	/** 
	 * Specifies audio sample rate,
	 * Range from `22050` to `96000`, default value is `44100`.
	 */
	sampleRate?: number

	/** 
	 * Set resampling or interpolation rate after sampled from `sampleRate`.
	 * Range from `22050` to `96000`, default value is `44100`..
	 */
	desiredSampRate?: number

	/** Number of audio channels to output. default value is 2. */
	numberOfAudioChannels?: 1 | 2

	/** 
	 * Auto stop recording if camera stops, or the input stream stops.
	 * Default value is `false`.
	 */
	checkForInactiveTracks?: boolean

	/** Concatenate intervals based blobs, default value is 1000. */
	timeSlice?: number,
	
	/** Get intervals based blobs. */
	ondataavailable?: (blob: Blob) => void

	/** Specifies `true` to disable merging channels in worker. Default value is `false`. */
	noWorker?: boolean

	/** Buffer-size for how frequently the audioprocess event is dispatched. Default value is 4096. */
	bufferSize?: number

	/** Trigger when audio was just begin to process. */
	onAudioProcessStarted?: () => void
	
	/** Callback after recorder initialized. */
	initCallback?: () => void
}


/** 
 * Capture `MediaStream` from `HTMLMediaElement`, `HTMLCanvasElement` or `CanvasRenderingContext2D`,
 * or catpure the drawing result from a normal `HTMLElement`,
 * Then encode the captured data with `MediaStreamRecorder`.
 * If `useWhammyRecorder` option is `true`, encode with `WhammyRecorder`.
 * Note a bug here: Can't transfer config to inner `MediaStreamRecorder` or `WhammyRecorder`.
 */
declare class CanvasRecorder {

	/**
	 * HTML2Canvas recording into video WebM.
	 * CanvasRecorder is a standalone class used by RecordRTC to bring HTML5-Canvas recording into video WebM. It uses HTML2Canvas library and runs top over Whammy.
	 */
	constructor(htmlElement: HTMLCanvasElement | HTMLMediaElement | HTMLElement | CanvasRenderingContext2D, config?: CanvasRecorderConfig)

	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** This method pauses the recording process. */
	pause(): void

	/** This method records Canvas. */
	record(): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording Canvas. */
	stop(callback: (blob: Blob) => void): void
}

declare interface CanvasRecorderConfig extends CommonRecorderConfig {
	
	/** Which file and codec type to use when encoding media data. */
	mimeType?: RecordRTCMimeType
	
	/** To capture frame repeatly with interval time, kind of `frameRate`. */
	frameInterval?: number

	/** Callback after recorder initialized. */
	initCallback?: () => void

	/** Callback after each frame encoded. */
	onEncodingCallback?: (framesRemaining: number, framesLength: number) => void

	/** Show mouse pointer when capturing html element. */
	showMousePointer?: boolean

	/** If specifies to `true`, will use `WhammyRecorder` to encode frames, otherwise use `MediaStreamRecorder`. */
	useWhammyRecorder?: boolean
}


/** 
 * Capture image data from `MediaStream`, `HTMLCanvasElement` or `CanvasRenderingContext2D`.
 * Notice that it doesn't encode gif in a real time, so the memory usage for cache screenshots may be very high.
 */
declare class GifRecorder {

	/** GifRecorder is standalone calss used by RecordRTC to record video or canvas into animated gif. */
	constructor(mediaStream: MediaStream | HTMLCanvasElement | CanvasRenderingContext2D, config?: GifRecorderConfig)

	/** The recorded blob object. */
	blob: Blob

	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** This method pauses the recording process. */
	pause(): void

	/** This method records MediaStream. */
	record(): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording MediaStream. */
	stop(callback: (blob: Blob) => void): void
}

declare interface GifRecorderConfig extends CommonRecorderConfig {

	/** Default value is 320. */
	width?: number

	/** Default value is 240. */
	height?: number

	/** Specifies the output size after recorded. */
	canvas?: {
		width: number
		height: number
	}

	/** 
	 * Specifies the recording size.
	 * Can be a property object or an `HTMLVideoElement`.
	 */
	video?: HTMLVideoElement | {
		width: number
		height: number
	}

	/**
	 * Here it's not the frame rate, but delay milliseconds to capture frame.
	 * Default value is `200`.
	 */
	frameRate?: number

	/**
	 * Sets quality of color quantization (conversion of images to the 
	 * maximum 256 colors allowed by the GIF specification). 
	 * Lower values (minimum = 1) produce better colors, 
	 * but slow processing significantly. `10` is the default, 
	 * and produces good color mapping at reasonable speeds. 
	 * Values greater than 20 do not yield significant improvements in speed.
	 */
	quality?: number
	
	/** Callback after recorder initialized. */
	initCallback?: () => void

	/** Trigger after recorder started. */
	onGifRecordingStarted?: () => void

	/** Trigger after encoded each frame to data URL. */
	onGifPreview?: (dataURL: string) => void
}


/** Capture image data from `MediaStream`, `MediaSource`, or a `Blob`, and then encode them to webm format in a wasm worker. */
declare class WebAssemblyRecorder {

	/** MediaStreamRecorder is an abstraction layer for MediaRecorder API. It is used by RecordRTC to record MediaStream(s) in both Chrome and Firefox. */
	constructor(stream: MediaStream, config: WebAssemblyRecorderConfig)

	/** The recorded blob object. */
	blob: Blob

	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** This method pauses the recording process. */
	pause(): void

	/** This method records MediaStream. */
	record(): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording MediaStream. */
	stop(callback: (blob: Blob) => void): void
}

declare interface WebAssemblyRecorderConfig extends CommonRecorderConfig {

	/** 
	 * The frame rate of the recording.
	 * Default value is `30`.
	 */
	frameRate?: number

	/** Default value is 640. */
	width?: number

	/** Default value is 480. */
	height?: number

	/** 
	 * The bitrate of the recording.
	 * Values from 0 to 1000+, default value is 1200.
	 */
	bitrate?: number

	/** Web Worker Path. */
	workerPath?: string

	/** Web Assembly Path. */
	webAssemblyPath?: string

	/** Callback after recorder initialized. */
	initCallback?: () => void
}


/**
 * A real time javascript webm encoder based on a canvas hack.
 * Whammy is a standalone class used by RecordRTC to bring video recording in Chrome.
 * It is written by antimatter15.
 */
declare interface Whammy {
	Video: (speed: number, quality: number) => WhammyVideo
}

declare class WhammyVideo {
	constructor(frameRate: number)

	/** Pass Canvas or Context or image/webp(string) to Whammy encoder. */
	add(frame: number, duration: number): void

	/** Encodes frames in WebM container. It uses WebWorkinvoke to invoke 'ArrayToWebM' method. */
	compile(callback: (blob: Blob) => void): void
}


/** 
 * Using `Whammy` webm recorder to encode some screenshots to a webm video in a web worker.
 * Notice that it doesn't encode videos in a real time, so the memory usage for cache screenshots may be very high.
 * Otherwise note that you can't set encoding quality, although there is an API exist in `Whammy`.
 */
declare class WhammyRecorder {

	/** MediaStreamRecorder is an abstraction layer for MediaRecorder API. It is used by RecordRTC to record MediaStream(s) in both Chrome and Firefox. */
	constructor(stream: MediaStream, config: WhammyRecorderConfig)

	/** This method resets currently recorded data. */
	clearRecordedData(): void

	/** This method pauses the recording process. */
	pause(): void

	/** This method records MediaStream. */
	record(): void

	/** This method resumes the recording process. */
	resume(): void

	/** This method stops recording MediaStream. */
	stop(callback: (blob: Blob) => void): void
}

declare interface WhammyRecorderConfig extends CommonRecorderConfig {

	/** Default value is 320. */
	width?: number

	/** Default value is 240. */
	height?: number

	/** Specifies the output size after recorded. */
	canvas?: {
		width: number
		height: number
	}

	/** 
	 * Specifies the recording size.
	 * Can be a property object or an `HTMLVideoElement`.
	 */
	video?: HTMLVideoElement | {
		width: number
		height: number
	}

	/** To capture frame repeatly with interval time, kind of `frameRate`. */
	frameInterval?: number

	/** Callback after recorder initialized. */
	initCallback?: () => void
}
