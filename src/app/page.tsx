import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";

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

    redirect(`/vote/${id}`);
  }
  return (
    <div className="bg-black text-gray-400 absolute inset-0 flex items-center justify-center">
      <div className="absolute top-12 w-full max-w-[450px]">
        <Logo />
      </div>
      <div className="mx-auto max-w-[300px] w-full">
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block mb-1.5 text-gray-400" htmlFor="vote-name">
              Vote name{" "}
            </label>
            <input
              className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
              name="vote-name"
              id="vote-name"
              type="text"
            />
          </div>
          <div>
            <label
              className="block mb-1.5 text-gray-400"
              htmlFor="vote-options"
            >
              Comma separated vote options{" "}
            </label>
            <input
              className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
              name="vote-options"
              type="text"
              placeholder="Apple,Banana,Cherry"
            />
          </div>
          <button className="bg-white text-black px-3 py-2 rounded-lg">
            Create new vote
          </button>
        </form>
      </div>
    </div>
  );
}
