import { LoadingOutlined } from "@ant-design/icons";

interface AuthLoadingProps {
  message?: string;
  description?: string;
}

export default function AuthLoading({
  message = "Verifying Access",
  description = "Checking your permissions...",
}: AuthLoadingProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
      {/* Background blur effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Loading spinner with animation */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 animate-spin">
            <LoadingOutlined className="text-4xl text-indigo-600" />
          </div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 border-r-indigo-300 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "3s" }}
          ></div>
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
          <p className="text-sm text-gray-500 max-w-xs">{description}</p>
        </div>

        {/* Loading dots animation */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
