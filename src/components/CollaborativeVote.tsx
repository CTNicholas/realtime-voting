"use client";

import { useMutation, useOthers, useStorage } from "@/liveblocks.config";
import { Logo } from "@/components/Logo";

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

  // Total vote count
  const totalCount = voteOptions.reduce((acc, option) => acc + option.count, 0);

  // Index with highest count
  const highestIndex = voteOptions.reduce((highestIndex, option, index) => {
    return option.count >= voteOptions[highestIndex]?.count
      ? index
      : highestIndex;
  }, 0);

  return (
    <div className="bg-black text-gray-400 absolute inset-0 flex items-center justify-center">
      <div className="absolute top-12 w-72">
        <Logo />
      </div>
      <div className="mx-auto max-w-[600px] w-full">
        <h1>{voteName}</h1>
        <div className="mx-auto text-center mb-10 flex justify-center items-center gap-3 text-gray-100">
          <div className="relative flex justify-center items-center">
            <div className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping " />
            <div className="rounded-full h-3 w-3 bg-green-500" />
          </div>
          <div>{others.length + 1} live on this site</div>
        </div>
        <div className="border-l border-gray-500 py-4 flex flex-col gap-1 translate-x-1/3">
          {voteOptions.map((option, index) => {
            const highest = index === highestIndex;
            return (
              <div
                key={index}
                className="relative flex items-center border-l py-1 border-transparent"
                style={{ borderColor: highest ? "white" : undefined }}
              >
                <div
                  className="right-full absolute text-right pr-6 opacity-50"
                  style={{ opacity: highest ? "1" : undefined }}
                >
                  {option.name}
                </div>
                <div
                  className="border border-l-0 border-gray-700 rounded-r-xl relative h-12 flex items-center"
                  style={{
                    width: `${(option.count / totalCount) * 100}%`,
                    background: highest ? "white" : undefined,
                  }}
                >
                  <div
                    className="absolute left-full pl-4 font-bold"
                    style={{ color: highest ? "white" : undefined }}
                  >
                    {option.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-10">
          {voteOptions.map((option, index) => (
            <button
              key={index}
              className="border border-gray-700 p-3 hover:border-gray-500 hover:text-gray-200 transition-colors duration-100 text-left select-none"
              onClick={() => voteForOption(index)}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
