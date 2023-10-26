import Room from "@/app/vote/[roomId]/Room";
import { CollaborativeVote } from "@/components/CollaborativeVote";

export default async function Page({ params }: any) {
  // Get vote name from metadata
  const response = await fetch(
    `https://api.liveblocks.io/v2/rooms/${params.roomId}`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return <div>Couldn’t find vote</div>;
  }

  const room = await response.json();

  return (
    <Room>
      <CollaborativeVote voteName={room.metadata.voteName} />
    </Room>
  );
}
