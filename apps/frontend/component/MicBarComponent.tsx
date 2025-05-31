import {
  MicIcon,
  MicOff,
  MonitorSpeaker,
  SpeakerIcon,
} from "lucide-react";

type MicBarProps = {
  speaker: boolean;
  mic: boolean;
  setSpeaker: (s: boolean) => void;
  setMic: (s: boolean) => void;
};

export function MicBarComponent({ speaker, mic, setSpeaker, setMic }: MicBarProps) {
  return (
    <div className="flex justify-center w-full mt-4">
      <div className="flex gap-2 bg-[#1E1E2F] p-2 px-4 rounded-full shadow-md border border-gray-700">
        <button
          onClick={() => setSpeaker(!speaker)}
          className="p-2 rounded-md hover:bg-[#2A2A3D] transition-colors duration-150"
        >
          {speaker ? <SpeakerIcon size={20} /> : <MonitorSpeaker size={20} />}
        </button>
        <button
          onClick={() => setMic(!mic)}
          className="p-2 rounded-md hover:bg-[#2A2A3D] transition-colors duration-150"
        >
          {mic ? <MicIcon size={20} /> : <MicOff size={20} />}
        </button>
      </div>
    </div>
  );
}
