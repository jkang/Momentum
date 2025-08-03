import Link from "next/link"

interface Message {
  type: "ai" | "user" | "action"
  text: string
  link?: string
}

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  if (message.type === "action") {
    return (
      <div className="chat-bubble action flex justify-center animate-pop-in">
        <Link
          href={message.link || "#"}
          className="action-link inline-block bg-sage-green text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
        >
          {message.text}
        </Link>
      </div>
    )
  }

  return (
    <div
      className={`chat-bubble ${message.type} flex items-start gap-3 max-w-[85%] animate-pop-in ${
        message.type === "user" ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      {message.type === "ai" && <div className="avatar w-8 h-8 rounded-full bg-sage-light flex-shrink-0"></div>}
      <div
        className={`message-content p-4 leading-relaxed ${
          message.type === "ai"
            ? "bg-sage-light rounded-2xl rounded-bl-sm"
            : "bg-white rounded-2xl rounded-br-sm shadow-sm"
        }`}
      >
        <p>{message.text}</p>
      </div>
    </div>
  )
}
