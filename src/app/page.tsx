import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export default function Home() {
  // Create a room manually so we can attach the name of the vote to it
  async function handleSubmit(formData: FormData) {
    "use server";

    const voteName = formData.get("vote-name");
    const voteOptions = formData.get("vote-options");

    if (!voteName || !voteOptions) {
      return;
    }

    const id = nanoid();
    const body = JSON.stringify({
      id,
      defaultAccesses: [],

      // Vote name in room metadata
      metadata: {
        voteName,
      },
    });

    // Create room
    const response = await fetch(`https://api.liveblocks.io/v2/rooms`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
      },
      body,
    });

    const options = (voteOptions as string).split(",");

    const storage = JSON.stringify({
      liveblocksType: "LiveObject",
      data: {
        options: {
          liveblocksType: "LiveList",
          data: options.map((option) => ({
            liveblocksType: "LiveObject",
            data: {
              name: option,
              count: 0,
            },
          })),
        },
      },
    });

    // Add vote options to storage
    const response2 = await fetch(
      `https://api.liveblocks.io/v2/rooms/${id}/storage`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
        },
        body: storage,
      }
    );

    if (!response.ok || !response2.ok) {
      console.log(await response2.json());
      return;
    }

    redirect(`/room/${id}`);
  }
  return (
    <form action={handleSubmit}>
      Name of vote: <input name="vote-name" type="text" />
      Comma separated vote options: <input name="vote-options" type="text" />
      <button>Create new vote</button>
    </form>
  );
}
