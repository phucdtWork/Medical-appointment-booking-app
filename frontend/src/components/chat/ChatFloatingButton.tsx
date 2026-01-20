"use client";

import React, { useState } from "react";
import { FloatButton } from "antd";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import ChatBox from "./ChatBox";
import Image from "next/image";
import chatBoxImg from "@/../../public/images/chatBoxImg.jpg";

const animationStyles = `
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chat-float-button {
    animation: pulse 2s infinite, bounce 3s ease-in-out infinite;
  }
`;

export default function ChatFloatingButton() {
  const { isDark } = useTheme();
  const t = useTranslations("chat");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{animationStyles}</style>
      {/* Floating Button */}
      {!isOpen && (
        <FloatButton
          onClick={() => setIsOpen(true)}
          type="primary"
          className="chat-float-button"
          style={{ insetInlineEnd: 24, bottom: 100, width: 70, height: 70 }}
          tooltip={{
            title: t("titleTooltip"),
            color: isDark ? "#333333" : "#ffffff",
            placement: "topLeft",
          }}
          icon={
            <Image
              src={chatBoxImg}
              alt="Chat"
              fill
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          }
        />
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`
            fixed bottom-32 right-6 z-40 
            w-96 rounded-lg shadow-2xl
            flex flex-col overflow-hidden
            ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}
          `}
          style={{
            height: "600px",
            animation: "slideUp 0.3s ease-in-out",
          }}
        >
          <ChatBox onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
