// components/LoadingIndicator.js
export default function LoadingIndicator() {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-start justify-center z-50">
        <div className="relative top-[350px] mt-4 w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }
  
  