import { Metadata } from "next";
import MiniGameClient from "./MiniGameClient";

export const metadata: Metadata = {
  title: "Play Nexus Run | NexusPlay",
  description: "Play the addictive 3D mini-game exclusive to NexusPlay. Dodge the obstacles and set a high score!",
};

export default function PlayPage() {
  return <MiniGameClient />;
}
