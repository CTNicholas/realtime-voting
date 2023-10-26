"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { useParams } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loading } from "@/components/Loading";
import { LiveList } from "@liveblocks/client";

export default function Room({ children }: { children: ReactNode }) {
  const { roomId } = useParams();

  return (
    <RoomProvider
      id={roomId as string}
      initialPresence={{}}
      initialStorage={{ options: new LiveList() }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
