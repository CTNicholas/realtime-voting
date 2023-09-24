"use client";

import { useMutation, useOthers, useStorage } from "@/liveblocks.config";

export function CollaborativeVote({ voteName }: { voteName: string }) {
  const others = useOthers();
  const voteOptions = useStorage((root) => root.options);

  // Increment vote option
  const voteForOption = useMutation(({ storage }, index) => {
    const option = storage.get("options").get(index);

    if (!option) {
      return;
    }

    const current = option.get("count");
    option.set("count", current + 1);
  }, []);

  return (
    <div>
      <h1>{voteName}</h1>
      <div>
        {voteOptions.map((option, index) => (
          <div key={index}>
            <div>{option.name}</div>
            <div>Count: {option.count}</div>
            <button onClick={() => voteForOption(index)}>Vote for this</button>
          </div>
        ))}
      </div>
      <div>There are {others.length} other people currently voting.</div>
    </div>
  );
}
