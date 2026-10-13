import React from "react";
import { Composition } from "remotion";
import { TrainingVideo, VideoData } from "./TrainingVideo";
import video1 from "./data/video1.json";
import video2 from "./data/video2.json";
import video4 from "./data/video4.json";
import video6 from "./data/video6.json";
import video8 from "./data/video8.json";
import video10 from "./data/video10.json";
import video22 from "./data/video22.json";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Video1-WatchThisFirst"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video1 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video1 as VideoData, audio: "vo1.mp3" }}
      />
      <Composition
        id="Video2-HowTheMoneyFlows"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video2 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video2 as VideoData, audio: "vo2.mp3" }}
      />
      <Composition
        id="Video4-GoldRushMindset"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video4 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video4 as VideoData, audio: "vo4.mp3" }}
      />
      <Composition
        id="Video6-MyVaultMindset"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video6 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video6 as VideoData, audio: "vo6.mp3" }}
      />
      <Composition
        id="Video8-LinkVaultMindset"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video8 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video8 as VideoData, audio: "vo8.mp3" }}
      />
      <Composition
        id="Video10-UnlimitedMindset"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video10 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video10 as VideoData, audio: "vo10.mp3" }}
      />
      <Composition
        id="Video22-DoneForYouProfitMindset"
        component={TrainingVideo}
        durationInFrames={Math.ceil((video22 as VideoData).durationSec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: video22 as VideoData, audio: "vo22.mp3" }}
      />
    </>
  );
};
