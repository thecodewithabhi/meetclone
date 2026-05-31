import { useState } from "react";

export default function ChatBox({
  socket,
}) {
  const [message, setMessage] =
    useState("");

  const sendMessage = () => {
    socket.send(
      JSON.stringify({
        type: "chat",
        message,
      })
    );

    setMessage("");
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="flex-1 p-2 rounded text-black"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}